"use client";

import { useState, useEffect } from "react";
import { useOrganization } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Plus,
  MoreHorizontal,
  Eye,
  EyeOff,
  Pencil,
  Trash2,
  MapPin,
  Clock,
} from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";

export default function JobsPage() {
  const { organization } = useOrganization();
  const [deletingJobId, setDeletingJobId] = useState<string | null>(null);

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

  const togglePublish = useMutation(api.jobs.togglePublish);
  const deleteJob = useMutation(api.jobs.deleteJob);

  const handleTogglePublish = async (jobId: string) => {
    try {
      await togglePublish({ jobId: jobId as Id<"jobs"> });
      toast.success("Job status updated");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update job status"
      );
    }
  };

  const handleDeleteJob = async () => {
    if (!deletingJobId) return;
    try {
      await deleteJob({ jobId: deletingJobId as Id<"jobs"> });
      toast.success("Job deleted successfully");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete job"
      );
    } finally {
      setDeletingJobId(null);
    }
  };

  if (!organization) {
    return (
      <div className="py-20 text-center text-muted-foreground">
        Select an organization to manage jobs.
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Jobs</h1>
          <p className="mt-1 text-muted-foreground">
            Manage your job postings
          </p>
        </div>
        <Link href="/dashboard/jobs/new">
          <Button className="font-medium">
            <Plus className="mr-2 h-4 w-4" />
            Create Job
          </Button>
        </Link>
      </div>

      {!jobs || jobs.length === 0 ? (
        <Card className="border-border/50">
          <CardContent className="py-16 text-center">
            <p className="text-muted-foreground">
              No jobs yet. Create your first job posting!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <Card key={job._id} className="border-border/50">
              <CardContent className="flex items-center justify-between p-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold">{job.title}</h3>
                    <Badge
                      variant={job.isPublished ? "default" : "secondary"}
                      className={
                        job.isPublished
                          ? "bg-foreground text-background"
                          : "bg-muted text-muted-foreground"
                      }
                    >
                      {job.isPublished ? "Published" : "Draft"}
                    </Badge>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {job.jobType}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {job.workMode}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {job.experienceLevel}
                    </Badge>
                    {job.salaryMin != null && job.salaryMax != null && (
                      <span>
                        ${job.salaryMin.toLocaleString()} - $
                        {job.salaryMax.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {job.skills.slice(0, 5).map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="text-xs"
                      >
                        {skill}
                      </Badge>
                    ))}
                    {job.skills.length > 5 && (
                      <Badge variant="secondary" className="text-xs">
                        +{job.skills.length - 5}
                      </Badge>
                    )}
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => handleTogglePublish(job._id)}
                    >
                      {job.isPublished ? (
                        <>
                          <EyeOff className="mr-2 h-4 w-4" />
                          Unpublish
                        </>
                      ) : (
                        <>
                          <Eye className="mr-2 h-4 w-4" />
                          Publish
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/jobs/${job._id}/edit`}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => setDeletingJobId(job._id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deletingJobId}
        onOpenChange={(open) => !open && setDeletingJobId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this job?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the job
              posting and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteJob}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
