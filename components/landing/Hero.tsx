"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Briefcase, Building2, Building, UserPlus, CheckCircle2 } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function Hero() {
  const stats = useQuery(api.jobs.getStats);

  const formatCount = (n: number) => {
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M+`;
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K+`;
    return `${n}`;
  };

  return (
    <section className="relative overflow-hidden bg-background pt-24 pb-16 sm:pt-32 sm:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-8 lg:items-center">
          
          {/* Left Hero Content */}
          <div className="max-w-2xl">
            <div className="inline-flex items-center rounded-full border border-border/40 bg-muted/30 px-3 py-1 text-sm font-medium text-muted-foreground mb-6">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
              Join {stats ? formatCount(stats.activeJobs) : "thousands of"} active opportunities
            </div>
            
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl xl:text-[4rem] xl:leading-[1.1]">
              Find the Right Job Faster.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-xl">
              JobPing is the modern job platform connecting top talent with the best companies. Simple, fast, and built for your career growth.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link href="/jobs">
                <Button size="lg" className="h-12 px-8 text-base rounded-full shadow-sm hover:shadow-md transition-all">
                  Find Jobs
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" size="lg" className="h-12 px-8 text-base rounded-full border-border/60 hover:bg-muted font-medium">
                  Post a Job
                </Button>
              </Link>
            </div>

            {/* Value Props */}
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary/80" />
                <span>Verified Employers</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary/80" />
                <span>One-Click Appy</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary/80" />
                <span>Private Profiles</span>
              </div>
            </div>
          </div>

          {/* Right UI Preview Mockup */}
          <div className="relative mx-auto w-full max-w-[500px] lg:max-w-none">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -z-10 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[100px] dark:bg-primary/10" />
            
            <div className="relative rounded-2xl border border-black/20 dark:border-white/20 bg-background shadow-2xl shadow-black/5 ring-1 ring-black/5 dark:ring-white/5">
              {/* Fake Window Controls */}
              <div className="flex items-center gap-2 border-b border-black/20 dark:border-white/20 bg-muted/20 px-4 py-3">
                <div className="h-3 w-3 rounded-full bg-red-400/80" />
                <div className="h-3 w-3 rounded-full bg-amber-400/80" />
                <div className="h-3 w-3 rounded-full bg-green-400/80" />
                <div className="ml-2 flex flex-1 items-center justify-center">
                  <div className="h-4 w-32 rounded bg-muted/40" />
                </div>
              </div>
              
              <div className="flex">
                {/* Fake Sidebar */}
                <div className="hidden w-40 flex-col gap-2 border-r border-black/20 dark:border-white/20 bg-black/[.02] dark:bg-white/[.02] p-4 sm:flex">
                  <div className="h-6 w-20 rounded bg-black/15 dark:bg-white/15 mb-4" />
                  <div className="h-4 w-full rounded bg-black/10 dark:bg-white/10" />
                  <div className="h-4 w-5/6 rounded bg-black/10 dark:bg-white/10" />
                  <div className="h-4 w-4/6 rounded bg-black/10 dark:bg-white/10" />
                  <div className="mt-8 h-4 w-16 rounded bg-black/15 dark:bg-white/15 mb-2" />
                  <div className="flex items-center gap-2 mt-2">
                    <div className="h-6 w-6 rounded-full bg-black/15 dark:bg-white/15" />
                    <div className="h-4 w-16 rounded bg-black/10 dark:bg-white/10" />
                  </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 p-5 sm:p-6">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <div className="h-5 w-32 rounded bg-foreground/10 mb-2" />
                      <div className="h-4 w-48 rounded bg-muted/40" />
                    </div>
                    <div className="h-8 w-24 rounded-full bg-primary/10" />
                  </div>

                  {/* Job List */}
                  <div className="space-y-3">
                    {(() => {
                      const publishedJobs = useQuery(api.jobs.listPublished);

                      if (publishedJobs === undefined) {
                        return (
                          <div className="space-y-3">
                            {[1, 2].map((i) => (
                              <div key={i} className="flex flex-col gap-3 rounded-2xl border border-black/20 dark:border-white/20 bg-white dark:bg-zinc-950 p-4">
                                <div className="flex items-center gap-3">
                                  <div className="h-10 w-10 animate-pulse rounded-xl bg-muted" />
                                  <div className="space-y-2">
                                    <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                                    <div className="h-3 w-20 animate-pulse rounded bg-muted" />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                      }

                      const displayJobs = publishedJobs.length > 0 
                        ? publishedJobs.slice(0, 2)
                        : [
                            { 
                              title: "Senior Frontend Engineer", 
                              companyName: "Stripe", 
                              companyLogo: null, 
                              workMode: "remote", 
                              salaryMin: 160000, 
                              salaryMax: 210000 
                            },
                            { 
                              title: "Product Designer", 
                              companyName: "Linear", 
                              companyLogo: null, 
                              workMode: "remote", 
                              salaryMin: 140000, 
                              salaryMax: 180000 
                            },
                          ];

                      return displayJobs.map((job: any, i) => (
                        <div key={i} className="flex flex-col gap-3 rounded-2xl border border-black/20 dark:border-white/20 bg-white dark:bg-zinc-950 p-4 transition-all hover:border-black/30 dark:hover:border-white/30 hover:shadow-md">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-black dark:bg-zinc-800 font-bold text-white shadow-sm">
                                {job.companyLogo && !job.companyLogo.includes("default") ? (
                                  <img src={job.companyLogo} alt={job.companyName} className="h-full w-full object-cover" />
                                ) : (
                                  <Building className="h-5 w-5 text-white/90" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-foreground">{job.title}</p>
                                <p className="truncate text-xs text-muted-foreground mt-0.5">{job.companyName}</p>
                              </div>
                            </div>
                            <span className="shrink-0 rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-medium text-green-600 dark:text-green-400 capitalize">
                              {job.workMode || "Remote"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between border-t border-black/10 dark:border-white/10 pt-3">
                            <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                              {job.salaryMin && job.salaryMax 
                                ? `$${Math.round(job.salaryMin/1000)}k - $${Math.round(job.salaryMax/1000)}k`
                                : "Competitive"}
                            </span>
                            <div className="h-6 w-16 shrink-0 rounded-md bg-muted/50" />
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
