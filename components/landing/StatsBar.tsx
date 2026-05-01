"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Briefcase, Building2, Users, FileText } from "lucide-react";
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

const statItems = [
  { key: "activeJobs", label: "Active Jobs", icon: Briefcase, suffix: "+" },
  { key: "companies", label: "Companies", icon: Building2, suffix: "+" },
  { key: "jobSeekers", label: "Job Seekers", icon: Users, suffix: "+" },
  { key: "applications", label: "Applications", icon: FileText, suffix: "+" },
];

export function StatsBar() {
  const stats = useQuery(api.jobs.getStats);

  const jobsCounter = useCountUp(stats?.activeJobs ?? 0);
  const companiesCounter = useCountUp(stats?.companies ?? 0);
  const seekersCounter = useCountUp(stats?.jobSeekers ?? 0);
  const appsCounter = useCountUp(stats?.applications ?? 0);

  const counters = [jobsCounter, companiesCounter, seekersCounter, appsCounter];
  const fallbacks = [150, 45, 500, 1200];

  return (
    <section className="relative overflow-hidden border-y border-primary/10">
      {/* Gradient background */}
      <div className="absolute inset-0 accent-gradient-bg opacity-[0.06]" />
      
      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {statItems.map((item, i) => {
            const counter = counters[i];
            const value = counter.count || fallbacks[i];
            
            return (
              <div
                key={item.key}
                ref={counter.ref}
                className="group flex flex-col items-center text-center"
              >
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110">
                  <item.icon className="h-5 w-5" />
                </div>
                <p className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  {value.toLocaleString()}{item.suffix}
                </p>
                <p className="mt-1 text-sm font-medium text-muted-foreground">
                  {item.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
