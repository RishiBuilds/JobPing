"use client";

import {
  Zap,
  Search,
  Users,
  Upload,
  Activity,
  Bell,
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Real-time Updates",
    description: "Get instant notifications when new jobs match your profile or when employers view your application.",
  },
  {
    icon: Search,
    title: "Smart Search",
    description: "Filter by role, location, salary, work mode, and experience level to find your perfect match.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Invite your hiring team, manage roles, and collaborate on candidate reviews in one dashboard.",
  },
  {
    icon: Upload,
    title: "Resume Upload",
    description: "Upload your resume once and apply to multiple positions with a single click. PDF and Word supported.",
  },
  {
    icon: Activity,
    title: "Application Tracking",
    description: "Track every application from submission to offer. See real-time status updates and hiring pipeline.",
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    description: "Stay informed with instant alerts for new applications, status changes, and job expirations.",
  },
];

export function Features() {
  return (
    <section id="features" className="relative overflow-hidden py-24 sm:py-32 bg-background">
      {/* Subtle bg */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 h-[300px] w-[300px] rounded-full bg-primary/5 blur-[100px]" />
        <div className="absolute bottom-0 left-0 h-[250px] w-[250px] rounded-full bg-primary/3 blur-[80px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary mb-4">
            Platform Features
          </div>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Everything you need to{" "}
            <span className="gradient-text">hire & get hired</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Powerful tools for both job seekers and employers, designed to make the hiring process seamless.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="group relative rounded-2xl border border-border/40 bg-card p-7 transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-md group-hover:shadow-primary/20">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold tracking-tight text-foreground">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
