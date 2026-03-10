"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Building, MapPin, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function RecentJobs() {
  const publishedJobs = useQuery(api.jobs.listPublished);

  const fallbackJobs = [
    {
      title: "Senior Full-Stack Engineer",
      companyName: "Linear",
      location: "Remote",
      salaryMin: 160000,
      salaryMax: 200000,
      jobType: "full-time",
      skills: ["React", "TypeScript", "Node.js"],
      companyLogo: null,
      createdAt: Date.now() - 2 * 60 * 60 * 1000, // 2 hours ago
    },
    {
      title: "Product Designer",
      companyName: "Stripe",
      location: "San Francisco, CA",
      salaryMin: 140000,
      salaryMax: 180000,
      jobType: "full-time",
      skills: ["Figma", "Research", "Systems"],
      companyLogo: null,
      createdAt: Date.now() - 5 * 60 * 60 * 1000, // 5 hours ago
    },
    {
      title: "Staff Backend Engineer",
      companyName: "Vercel",
      location: "New York, NY",
      salaryMin: 180000,
      salaryMax: 220000,
      jobType: "full-time",
      skills: ["Rust", "Go", "Distributed"],
      companyLogo: null,
      createdAt: Date.now() - 24 * 60 * 60 * 1000, // 1 day ago
    },
  ];

  const jobs = publishedJobs && publishedJobs.length > 0 
    ? publishedJobs.slice(0, 3) 
    : fallbackJobs;

  const timeAgo = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 24) return `${hours || 1} hour${hours <= 1 ? '' : 's'} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days === 1 ? '' : 's'} ago`;
  };

  return (
    <section className="border-b border-border/40 bg-card py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div className="max-w-xl">
            <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Recent job openings
            </h2>
            <p className="mt-3 text-lg text-muted-foreground">
              Explore the latest opportunities from top companies actively hiring right now.
            </p>
          </div>
          <Link href="/jobs">
            <Button variant="outline" className="group rounded-full bg-background border-border/60 hover:border-foreground/20 hover:bg-muted/50 transition-all font-medium">
              View all jobs
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {jobs.map((job: any) => (
            <Link key={job._id || job.title} href="/sign-up">
              <div className="group relative flex h-full flex-col justify-between rounded-xl border border-border/40 bg-background p-6 transition-all duration-200 hover:-translate-y-1 hover:border-border/80 hover:shadow-lg hover:shadow-black/[0.03]">
                <div>
                  <div className="mb-5 flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border border-border/50 bg-black dark:bg-zinc-800 font-bold text-white shadow-sm transition-transform group-hover:scale-105">
                      {job.companyLogo && !job.companyLogo.includes("default") ? (
                        <img src={job.companyLogo} alt={job.companyName} className="h-full w-full object-cover" />
                      ) : (
                        <Building className="h-6 w-6 text-white/90" />
                      )}
                    </div>
                    <Badge variant="secondary" className="bg-muted/50 text-muted-foreground text-[10px] font-medium tracking-wider uppercase rounded-sm group-hover:bg-muted group-hover:text-foreground">
                      {timeAgo(job.createdAt)}
                    </Badge>
                  </div>

                  <h3 className="mb-1.5 text-lg font-semibold tracking-tight text-foreground line-clamp-1">
                    {job.title}
                  </h3>
                  
                  <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5 font-medium text-foreground/80">
                      <Building className="h-4 w-4" />
                      {job.companyName}
                    </span>
                    <span className="flex items-center gap-1.5 capitalize">
                      <MapPin className="h-4 w-4" />
                      {job.location || job.workMode}
                    </span>
                  </div>

                  <div className="mb-6 flex flex-wrap gap-2">
                    {job.skills?.slice(0, 3).map((tag: string) => (
                      <span key={tag} className="inline-flex rounded-md bg-muted/40 px-2 py-1 text-xs font-medium text-muted-foreground">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-auto flex items-center justify-between border-t border-border/50 pt-4">
                  <span className="text-sm font-semibold text-foreground/90">
                    {job.salaryMin && job.salaryMax 
                      ? `$${Math.round(job.salaryMin/1000)}k - $${Math.round(job.salaryMax/1000)}k`
                      : "Competitive"}
                  </span>
                  <span className="text-sm font-medium text-muted-foreground capitalize">
                    {job.jobType ? job.jobType.replace("-", " ") : "Full time"}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
