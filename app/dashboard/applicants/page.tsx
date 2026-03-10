"use client";

import { useState, useEffect } from "react";
import { useOrganization } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Users,
  FileText,
  ExternalLink,
  Download,
  UserSearch,
} from "lucide-react";
import type { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";

export default function ApplicantsPage() {
  const { organization } = useOrganization();
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);

  const syncOrg = useMutation(api.organizations.syncOrganization);
  const [convexOrg, setConvexOrg] = useState<any>(null);

  useEffect(() => {
    if (organization?.id && organization?.name) {
      syncOrg({
        clerkOrgId: organization.id,
        name: organization.name,
        slug: organization.slug || undefined,
        imageUrl: organization.imageUrl || undefined,
      }).then((org) => setConvexOrg(org))
        .catch(console.error);
    }
  }, [organization?.id, organization?.name]);

  const jobs = useQuery(
    api.jobs.listByOrg,
    convexOrg?._id ? { organizationId: convexOrg._id } : "skip"
  );

  const applicants = useQuery(
    api.applications.getByJob,
    selectedJobId ? { jobId: selectedJobId as Id<"jobs"> } : "skip"
  );

  const updateStatus = useMutation(api.applications.updateStatus);

  const handleStatusChange = async (
    applicationId: string,
    newStatus: string
  ) => {
    try {
      await updateStatus({
        applicationId: applicationId as Id<"applications">,
        status: newStatus as
          | "pending"
          | "reviewed"
          | "shortlisted"
          | "rejected"
          | "hired",
      });
      toast.success(`Status updated to ${newStatus}`);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update status"
      );
    }
  };

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-500/10 text-yellow-600",
    reviewed: "bg-blue-500/10 text-blue-600",
    shortlisted: "bg-green-500/10 text-green-600",
    rejected: "bg-red-500/10 text-red-600",
    hired: "bg-foreground text-background",
  };

  if (!organization) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <UserSearch className="mb-4 h-12 w-12 text-muted-foreground/50" />
        <h2 className="text-xl font-bold">No Organization Selected</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Select or create an organization to view applicants.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Applicants</h1>
        <p className="mt-1 text-muted-foreground">
          Review and manage job applications
        </p>
      </div>

      {/* Job Selector */}
      <div className="mb-6">
        <Select
          value={selectedJobId ?? ""}
          onValueChange={(val) => setSelectedJobId(val || null)}
        >
          <SelectTrigger className="w-full max-w-sm">
            <SelectValue placeholder="Select a job to view applicants" />
          </SelectTrigger>
          <SelectContent>
            {jobs?.map((job) => (
              <SelectItem key={job._id} value={job._id}>
                {job.title} ({job.isPublished ? "Published" : "Draft"})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Applicants List */}
      {!selectedJobId ? (
        <Card className="border-border/50">
          <CardContent className="py-16 text-center">
            <Users className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
            <p className="font-medium">Select a Job</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Choose a job posting above to view its applicants
            </p>
          </CardContent>
        </Card>
      ) : !applicants || applicants.length === 0 ? (
        <Card className="border-border/50">
          <CardContent className="py-16 text-center">
            <UserSearch className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
            <p className="font-medium">No Applications Yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              No one has applied to this position yet. Share the job posting to attract candidates.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {applicants.length} applicant{applicants.length === 1 ? "" : "s"}
          </p>
          {applicants.map((app) => (
            <Card key={app._id} className="border-border/50">
              <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted border border-border/50 text-foreground">
                    <span className="text-sm font-medium">
                      {app.applicantName?.charAt(0)?.toUpperCase() ?? "?"}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold">
                      {app.applicantName || "Unknown"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {app.applicantEmail}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Applied{" "}
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Badge className={statusColors[app.status] ?? ""}>
                    {app.status}
                  </Badge>

                  <Select
                    value={app.status}
                    onValueChange={(val) =>
                      handleStatusChange(app._id, val)
                    }
                  >
                    <SelectTrigger className="w-36">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="reviewed">Reviewed</SelectItem>
                      <SelectItem value="shortlisted">Shortlisted</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="hired">Hired</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Resume download */}
                  {(app.resumeDownloadUrl || app.resumeUrl) && (
                    <a
                      href={app.resumeDownloadUrl ?? app.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" size="sm">
                        <Download className="mr-1 h-4 w-4" />
                        Resume
                      </Button>
                    </a>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedApplication(app)}
                  >
                    <FileText className="mr-1 h-4 w-4" />
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Application Detail Dialog */}
      <Dialog
        open={!!selectedApplication}
        onOpenChange={(open) => !open && setSelectedApplication(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Application from {selectedApplication?.applicantName}
            </DialogTitle>
            <DialogDescription>
              {selectedApplication?.applicantEmail}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <p className="mb-1 text-sm font-medium text-muted-foreground">
                Status
              </p>
              <Badge
                className={
                  statusColors[selectedApplication?.status ?? ""] ?? ""
                }
              >
                {selectedApplication?.status}
              </Badge>
            </div>

            {/* Resume section */}
            {(selectedApplication?.resumeDownloadUrl ||
              selectedApplication?.resumeUrl) && (
              <div>
                <p className="mb-1 text-sm font-medium text-muted-foreground">
                  Resume
                </p>
                <a
                  href={
                    selectedApplication.resumeDownloadUrl ??
                    selectedApplication.resumeUrl
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-border/50 px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted/50"
                >
                  <Download className="h-4 w-4" />
                  {selectedApplication?.resumeFileName ?? "Download Resume"}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}

            {selectedApplication?.coverLetter && (
              <div>
                <p className="mb-1 text-sm font-medium text-muted-foreground">
                  Cover Letter
                </p>
                <p className="rounded-lg border border-border/50 bg-muted/50 p-3 text-sm whitespace-pre-wrap">
                  {selectedApplication.coverLetter}
                </p>
              </div>
            )}

            <div>
              <p className="text-xs text-muted-foreground">
                Applied on{" "}
                {selectedApplication?.appliedAt
                  ? new Date(
                      selectedApplication.appliedAt
                    ).toLocaleDateString()
                  : "Unknown"}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
