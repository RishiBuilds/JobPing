"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Building, CheckCircle2, Sparkles, ArrowRight } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect, useState, useRef } from "react";

function useCountUp(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!ref.current || hasAnimated.current || target <= 0) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const start = performance.now();
          const step = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
}

function formatCount(n: number) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M+`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K+`;
  return `${n}`;
}

export function Hero() {
  const stats = useQuery(api.jobs.getStats);
  const publishedJobs = useQuery(api.jobs.listPublished);

  const jobCount = useCountUp(stats?.activeJobs ?? 0);
  const companyCount = useCountUp(stats?.companies ?? 0);
  const seekerCount = useCountUp(stats?.jobSeekers ?? 0);

  return (
    <section className="relative overflow-hidden bg-background pt-24 pb-20 sm:pt-32 sm:pb-28">
      {/* Animated gradient orbs */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-primary/8 blur-[120px] animate-float" />
        <div className="absolute top-1/2 -right-32 h-[400px] w-[400px] rounded-full bg-primary/6 blur-[100px] animate-float delay-200" style={{ animationDuration: '8s' }} />
        <div className="absolute -bottom-20 left-1/3 h-[350px] w-[350px] rounded-full bg-primary/5 blur-[80px] animate-float delay-400" style={{ animationDuration: '10s' }} />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-8 lg:items-center">
          
          {/* Left Hero Content */}
          <div className="max-w-2xl">
            <div className="animate-fade-in-up inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-8">
              <Sparkles className="h-3.5 w-3.5 mr-2" />
              Join {stats ? formatCount(stats.activeJobs) : "thousands of"} active opportunities
            </div>
            
            <h1 className="animate-fade-in-up delay-100 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl xl:text-[4rem] xl:leading-[1.1]">
              Find the Right Job{" "}
              <span className="gradient-text">Faster.</span>
            </h1>
            <p className="animate-fade-in-up delay-200 mt-6 text-lg text-muted-foreground leading-relaxed max-w-xl">
              JobPing is the modern job platform connecting top talent with the best companies. Simple, fast, and built for your career growth.
            </p>

            {/* CTAs */}
            <div className="animate-fade-in-up delay-300 mt-10 flex flex-wrap items-center gap-4">
              <Link href="/jobs">
                <Button size="lg" className="h-12 px-8 text-base rounded-full shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]">
                  Find Jobs
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" size="lg" className="h-12 px-8 text-base rounded-full border-primary/20 hover:bg-primary/5 hover:border-primary/40 font-medium transition-all">
                  Post a Job
                </Button>
              </Link>
            </div>

            {/* Value Props */}
            <div className="animate-fade-in-up delay-400 mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>Verified Employers</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>One-Click Apply</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>Private Profiles</span>
              </div>
            </div>

            {/* Live stats counters */}
            <div className="animate-fade-in-up delay-500 mt-12 grid grid-cols-3 gap-6">
              <div ref={jobCount.ref}>
                <p className="text-2xl font-bold text-foreground">{formatCount(jobCount.count)}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Active Jobs</p>
              </div>
              <div ref={companyCount.ref}>
                <p className="text-2xl font-bold text-foreground">{formatCount(companyCount.count)}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Companies</p>
              </div>
              <div ref={seekerCount.ref}>
                <p className="text-2xl font-bold text-foreground">{formatCount(seekerCount.count)}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Job Seekers</p>
              </div>
            </div>
          </div>

          {/* Right UI Preview Mockup */}
          <div className="animate-fade-in-up delay-300 relative mx-auto w-full max-w-[500px] lg:max-w-none">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -z-10 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/8 blur-[100px] animate-glow-pulse" />
            
            <div className="relative rounded-2xl border border-primary/15 bg-background shadow-2xl shadow-primary/5 ring-1 ring-primary/5">
              {/* Fake Window Controls */}
              <div className="flex items-center gap-2 border-b border-primary/10 bg-muted/20 px-4 py-3">
                <div className="h-3 w-3 rounded-full bg-red-400/80" />
                <div className="h-3 w-3 rounded-full bg-amber-400/80" />
                <div className="h-3 w-3 rounded-full bg-green-400/80" />
                <div className="ml-2 flex flex-1 items-center justify-center">
                  <div className="h-4 w-32 rounded bg-muted/40" />
                </div>
              </div>
              
              <div className="flex">
                {/* Fake Sidebar */}
                <div className="hidden w-40 flex-col gap-2 border-r border-primary/10 bg-primary/[.02] p-4 sm:flex">
                  <div className="h-6 w-20 rounded bg-primary/15 mb-4" />
                  <div className="h-4 w-full rounded bg-primary/8" />
                  <div className="h-4 w-5/6 rounded bg-primary/8" />
                  <div className="h-4 w-4/6 rounded bg-primary/8" />
                  <div className="mt-8 h-4 w-16 rounded bg-primary/15 mb-2" />
                  <div className="flex items-center gap-2 mt-2">
                    <div className="h-6 w-6 rounded-full bg-primary/15" />
                    <div className="h-4 w-16 rounded bg-primary/8" />
                  </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 p-5 sm:p-6">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <div className="h-5 w-32 rounded bg-foreground/10 mb-2" />
                      <div className="h-4 w-48 rounded bg-muted/40" />
                    </div>
                    <div className="h-8 w-24 rounded-full accent-gradient-bg opacity-80" />
                  </div>

                  {/* Job List */}
                  <div className="space-y-3">
                    {(() => {
                      if (publishedJobs === undefined) {
                        return (
                          <div className="space-y-3">
                            {[1, 2].map((i) => (
                              <div key={i} className="flex flex-col gap-3 rounded-2xl border border-primary/10 bg-white dark:bg-zinc-950 p-4">
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
                        <div key={i} className="flex flex-col gap-3 rounded-2xl border border-primary/10 bg-white dark:bg-zinc-950 p-4 transition-all hover:border-primary/25 hover:shadow-md">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-primary/10 font-bold text-primary shadow-sm">
                                {job.companyLogo && !job.companyLogo.includes("default") ? (
                                  <img src={job.companyLogo} alt={job.companyName} className="h-full w-full object-cover" />
                                ) : (
                                  <Building className="h-5 w-5" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-foreground">{job.title}</p>
                                <p className="truncate text-xs text-muted-foreground mt-0.5">{job.companyName}</p>
                              </div>
                            </div>
                            <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary capitalize">
                              {job.workMode || "Remote"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between border-t border-primary/10 pt-3">
                            <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                              {job.salaryMin && job.salaryMax 
                                ? `$${Math.round(job.salaryMin/1000)}k - $${Math.round(job.salaryMax/1000)}k`
                                : "Competitive"}
                            </span>
                            <div className="h-6 w-16 shrink-0 rounded-md bg-primary/8" />
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
