"use client";

import { useState, useEffect } from "react";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, Users, FileText, TrendingUp, Plus } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { organization } = useOrganization();
  const { user } = useUser();

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

  if (!organization) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-muted/50 border border-border/50">
          <Briefcase className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold">Welcome to JobPing</h2>
        <p className="mt-2 max-w-md text-muted-foreground">
          Create or select an organization to start posting jobs and managing
          your hiring pipeline.
        </p>
        <p className="mt-4 text-sm text-muted-foreground">
          Use the organization switcher in the sidebar to get started.
        </p>
      </div>
    );
  }

  const activeJobs = jobs?.filter((j) => j.isPublished).length ?? 0;
  const totalJobs = jobs?.length ?? 0;
  const draftJobs = totalJobs - activeJobs;

  const stats = [
    {
      label: "Active Jobs",
      value: activeJobs,
      icon: Briefcase,
      color: "text-foreground",
      bg: "bg-muted",
    },
    {
      label: "Draft Jobs",
      value: draftJobs,
      icon: FileText,
      color: "text-muted-foreground",
      bg: "bg-muted/50",
    },
    {
      label: "Total Jobs",
      value: totalJobs,
      icon: TrendingUp,
      color: "text-foreground",
      bg: "bg-muted",
    },
    {
      label: "Plan",
      value: convexOrg?.plan?.toUpperCase() ?? "FREE",
      icon: Users,
      color: "text-muted-foreground",
      bg: "bg-muted/50",
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {organization.name} Dashboard
          </h1>
          <p className="mt-1 text-muted-foreground">
            Manage your jobs and applicants
          </p>
        </div>
        <Link href="/dashboard/jobs/new">
          <Button className="font-medium">
            <Plus className="mr-2 h-4 w-4" />
            Post a Job
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border/50">
            <CardContent className="flex items-center gap-4 p-6">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg}`}
              >
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Jobs */}
      <Card className="mt-8 border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Jobs</CardTitle>
          <Link href="/dashboard/jobs">
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {!jobs || jobs.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              <p>No jobs yet. Post your first job to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.slice(0, 5).map((job) => (
                <div
                  key={job._id}
                  className="flex items-center justify-between rounded-lg border border-border/50 p-4"
                >
                  <div>
                    <h3 className="font-medium">{job.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {job.location} · {job.jobType} · {job.workMode}
                    </p>
                  </div>
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
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
