"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function TrustedCompanies() {
  const organizations = useQuery(api.organizations.listTop);

  const fallbackCompanies = [
    { name: "Stripe" },
    { name: "Linear" },
    { name: "Vercel" },
    { name: "Notion" },
    { name: "Figma" },
    { name: "Ramp" },
    { name: "OpenAI" },
    { name: "Anthropic" },
  ];

  const companies = (organizations && organizations.length > 0)
    ? organizations.map((org) => ({ name: org.name }))
    : fallbackCompanies;

  const scrollingCompanies = [...companies, ...companies];

  return (
    <section className="relative overflow-hidden border-b border-border/40 bg-zinc-50/50 py-12 dark:bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="mb-8 text-center text-sm font-medium uppercase tracking-widest text-muted-foreground/80">
          Trusted by engineering & design teams at
        </p>
        
        {/* Marquee Container */}
        <div className="relative mt-8 flex w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          
          <div className="flex w-max animate-[marquee_40s_linear_infinite] items-center gap-16 pr-16 hover:[animation-play-state:paused]">
            {scrollingCompanies.map((company, index) => (
              <div
                key={`${company.name}-${index}`}
                className="group flex flex-shrink-0 cursor-pointer items-center gap-2 grayscale opacity-60 transition-all duration-300 hover:scale-105 hover:grayscale-0 hover:opacity-100"
              >
                <span className="text-xl font-bold tracking-tight text-foreground/90">
                  {company.name}
                </span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
