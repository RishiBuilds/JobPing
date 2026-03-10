"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Building, Briefcase } from "lucide-react";
import Link from "next/link";

export default function ApplicationsPage() {
  const applications = useQuery(api.applications.getByApplicant);

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-500/10 text-yellow-600",
    reviewed: "bg-blue-500/10 text-blue-600",
    shortlisted: "bg-green-500/10 text-green-600",
    rejected: "bg-red-500/10 text-red-600",
    hired: "bg-foreground text-background",
  };

  if (!applications) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="mb-8 text-2xl font-bold">My Applications</h1>
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
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">My Applications</h1>
        <p className="mt-1 text-muted-foreground">
          Track your job applications
        </p>
      </div>

      {applications.length === 0 ? (
        <Card className="border-border/50">
          <CardContent className="py-16 text-center">
            <Briefcase className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
            <p className="font-medium">No applications yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Start browsing jobs and apply to positions that match your skills.
            </p>
            <Link
              href="/jobs"
              className="mt-4 inline-block rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background hover:bg-foreground/90 transition-colors"
            >
              Browse Jobs
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {applications.length} application
            {applications.length === 1 ? "" : "s"}
          </p>
          {applications.map((app) => (
            <Card key={app._id} className="border-border/50">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{app.jobTitle}</h3>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Building className="h-3.5 w-3.5" />
                        {app.companyName}
                      </span>
                      {app.jobLocation && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {app.jobLocation}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        Applied {new Date(app.appliedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <Badge className={statusColors[app.status] ?? ""}>
                    {app.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
