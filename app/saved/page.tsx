"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  DollarSign,
  Clock,
  Building,
  Briefcase,
  Bookmark,
  BookmarkX,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/landing/Navbar";
import type { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";

export default function SavedJobsPage() {
  const savedJobs = useQuery(api.savedJobs.getSavedJobs);
  const toggleSave = useMutation(api.savedJobs.toggleSave);

  const handleUnsave = async (jobId: string) => {
    try {
      await toggleSave({ jobId: jobId as Id<"jobs"> });
      toast.success("Job removed from saved");
    } catch {
      toast.error("Failed to unsave job");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Bookmark className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-bold">Saved Jobs</h1>
          </div>
          <p className="text-muted-foreground ml-[52px]">
            Jobs you&apos;ve bookmarked for later
          </p>
        </div>

        {savedJobs === undefined ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-border/50 animate-pulse">
                <CardContent className="p-6">
                  <div className="h-6 w-48 rounded bg-muted" />
                  <div className="mt-2 h-4 w-32 rounded bg-muted" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : !savedJobs || savedJobs.length === 0 ? (
          <Card className="border-border/50">
            <CardContent className="py-20 text-center">
              <Bookmark className="mx-auto mb-4 h-12 w-12 text-muted-foreground/40" />
              <p className="text-lg font-semibold">No saved jobs yet</p>
              <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
                Browse jobs and click the bookmark icon to save positions you&apos;re interested in.
              </p>
              <Link href="/jobs" className="mt-6 inline-block">
                <Button className="rounded-full gap-2">
                  Browse Jobs
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {savedJobs.length} saved job{savedJobs.length === 1 ? "" : "s"}
            </p>
            {savedJobs.map((entry: any) => {
              if (!entry || !entry.job) return null;
              const job = entry.job;
              return (
                <Card
                  key={entry._id}
                  className="group border-border/40 transition-all hover:border-primary/15 hover:shadow-md hover:shadow-primary/5"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <Link href={`/jobs/${job._id}`} className="flex items-start gap-4 flex-1 min-w-0">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-bold text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                          {job.companyName.charAt(0).toUpperCase()}
                        </div>
                        <div className="space-y-1.5 min-w-0">
                          <h3 className="text-lg font-semibold tracking-tight text-foreground truncate group-hover:text-primary transition-colors">
                            {job.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1 font-medium text-foreground/80">
                              <Building className="h-3.5 w-3.5" />
                              {job.companyName}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5" />
                              {job.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {job.jobType}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 pt-1">
                            {job.skills?.slice(0, 3).map((skill: string) => (
                              <Badge
                                key={skill}
                                variant="secondary"
                                className="bg-primary/5 border border-primary/10 text-primary/80 text-xs"
                              >
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </Link>

                      <div className="flex items-center gap-3 shrink-0">
                        {job.salaryMin != null && job.salaryMax != null && (
                          <div className="text-sm font-semibold text-foreground/90 flex items-center gap-1 whitespace-nowrap">
                            <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                            {job.salaryMin.toLocaleString()} - {job.salaryMax.toLocaleString()}
                          </div>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUnsave(job._id)}
                          className="text-destructive border-destructive/20 hover:bg-destructive/10 gap-1.5"
                        >
                          <BookmarkX className="h-4 w-4" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
