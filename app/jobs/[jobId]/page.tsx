"use client";

import { use, useState, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  MapPin,
  DollarSign,
  Briefcase,
  Clock,
  Users,
  Building,
  ArrowLeft,
  CheckCircle,
  Upload,
  FileText,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import type { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";

export default function JobDetailPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = use(params);
  const { user, isSignedIn } = useUser();

  const job = useQuery(api.jobs.getById, {
    jobId: jobId as Id<"jobs">,
  });

  const hasApplied = useQuery(api.applications.checkIfApplied, {
    jobId: jobId as Id<"jobs">,
  });

  const apply = useMutation(api.applications.apply);
  const generateUploadUrl = useMutation(api.jobs.generateUploadUrl);

  const [coverLetter, setCoverLetter] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload a PDF or Word document");
      return;
    }

    // 5MB limit
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be under 5MB");
      return;
    }

    setResumeFile(file);
  };

  const handleApply = async () => {
    setIsSubmitting(true);
    try {
      let storageId: Id<"_storage"> | undefined;
      let fileName: string | undefined;

      // Upload resume file if selected
      if (resumeFile) {
        setIsUploading(true);
        const uploadUrl = await generateUploadUrl();
        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": resumeFile.type },
          body: resumeFile,
        });
        const { storageId: sid } = await result.json();
        storageId = sid;
        fileName = resumeFile.name;
        setIsUploading(false);
      }

      await apply({
        jobId: jobId as Id<"jobs">,
        coverLetter: coverLetter || undefined,
        resumeUrl: resumeUrl || undefined,
        resumeStorageId: storageId,
        resumeFileName: fileName,
      });
      toast.success("Application submitted successfully!");
      setIsDialogOpen(false);
      setCoverLetter("");
      setResumeUrl("");
      setResumeFile(null);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to submit application"
      );
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  if (job === undefined) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-64 rounded bg-muted" />
          <div className="h-4 w-128 rounded bg-muted" />
          <div className="h-48 rounded-lg bg-muted" />
        </div>
      </div>
    );
  }

  if (job === null) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-amber-500" />
        <h2 className="text-xl font-bold">Job Not Found</h2>
        <p className="mt-2 text-muted-foreground">
          This job posting may have been removed or is no longer available.
        </p>
        <Link href="/jobs">
          <Button className="mt-6" variant="outline">
            Browse Other Jobs
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link
        href="/jobs"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Jobs
      </Link>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Card className="border-border/50">
            <CardContent className="p-8">
              {/* Expiry Warning */}
              {job.isExpired && (
                <div className="mb-6 flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-600">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  This job posting has expired and is no longer accepting applications.
                </div>
              )}

              <div className="mb-8">
                <div className="mb-6 flex items-start gap-5">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-border/50 bg-muted/30 text-2xl font-bold text-foreground">
                    {job.companyName.charAt(0).toUpperCase()}
                  </div>
                  <div className="space-y-1">
                    <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl text-foreground">
                      {job.title}
                    </h1>
                    <p className="text-lg font-medium text-muted-foreground">
                      {job.companyName}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-y border-border/40 py-4 text-sm font-medium text-muted-foreground">
                  <span className="flex items-center gap-2 text-foreground/80">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    {job.jobType}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {job.workMode}
                  </span>
                  <span className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {job.experienceLevel}
                  </span>
                  {job.salaryMin != null && job.salaryMax != null && (
                    <span className="flex items-center gap-2 font-semibold text-foreground/90">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              <div className="prose prose-sm max-w-none dark:prose-invert">
                <h3 className="text-lg font-semibold">About This Role</h3>
                <p className="whitespace-pre-wrap text-muted-foreground">
                  {job.description}
                </p>
              </div>

              {job.skills.length > 0 && (
                <div className="mt-8">
                  <h3 className="mb-3 text-lg font-semibold">
                    Required Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div>
          <Card className="border-border/50">
            <CardContent className="p-6">
              {job.isExpired ? (
                <div className="text-center">
                  <AlertTriangle className="mx-auto mb-3 h-10 w-10 text-amber-500" />
                  <p className="font-semibold text-amber-600">Job Expired</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    This position is no longer accepting applications.
                  </p>
                  <Link href="/jobs">
                    <Button variant="outline" className="mt-4 w-full">
                      Browse Other Jobs
                    </Button>
                  </Link>
                </div>
              ) : hasApplied ? (
                <div className="text-center">
                  <CheckCircle className="mx-auto mb-3 h-10 w-10 text-green-500" />
                  <p className="font-semibold text-green-600">
                    You&apos;ve Applied!
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Your application has been submitted.
                  </p>
                  <Link href="/applications">
                    <Button variant="outline" className="mt-4 w-full">
                      View Applications
                    </Button>
                  </Link>
                </div>
              ) : isSignedIn ? (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full font-medium">
                      Apply Now
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Apply to {job.title}</DialogTitle>
                      <DialogDescription>
                        Submit your application to {job.companyName}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      {/* Resume Upload */}
                      <div className="space-y-2">
                        <Label>Resume Upload</Label>
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-border/50 p-4 transition-colors hover:border-foreground/50 hover:bg-muted/50"
                        >
                          {resumeFile ? (
                            <>
                              <FileText className="h-5 w-5 shrink-0 text-foreground" />
                              <div className="flex-1 truncate">
                                <p className="truncate text-sm font-medium">
                                  {resumeFile.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {(resumeFile.size / 1024).toFixed(0)} KB
                                </p>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setResumeFile(null);
                                }}
                              >
                                Remove
                              </Button>
                            </>
                          ) : (
                            <>
                              <Upload className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <p className="text-sm font-medium">
                                  Click to upload resume
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  PDF or Word, max 5MB
                                </p>
                              </div>
                            </>
                          )}
                        </div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".pdf,.doc,.docx"
                          className="hidden"
                          onChange={handleFileSelect}
                        />
                      </div>

                      {/* Or paste URL */}
                      <div className="space-y-2">
                        <Label htmlFor="resumeUrl">
                          Or paste resume URL
                        </Label>
                        <Input
                          id="resumeUrl"
                          placeholder="https://drive.google.com/..."
                          value={resumeUrl}
                          onChange={(e) => setResumeUrl(e.target.value)}
                          disabled={!!resumeFile}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="coverLetter">
                          Cover Letter (optional)
                        </Label>
                        <Textarea
                          id="coverLetter"
                          placeholder="Tell the hiring team why you're a great fit..."
                          value={coverLetter}
                          onChange={(e) => setCoverLetter(e.target.value)}
                          rows={5}
                        />
                      </div>
                      <Button
                        onClick={handleApply}
                        disabled={isSubmitting}
                        className="w-full font-medium"
                      >
                        {isUploading
                          ? "Uploading resume..."
                          : isSubmitting
                            ? "Submitting..."
                            : "Submit Application"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              ) : (
                <div className="text-center">
                  <p className="mb-3 text-sm text-muted-foreground">
                    Sign in to apply for this position
                  </p>
                  <Link href="/sign-in">
                    <Button className="w-full font-medium">
                      Sign In to Apply
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
