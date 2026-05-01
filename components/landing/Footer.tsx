import Link from "next/link";
import { Github, Twitter, Linkedin, Briefcase, ArrowRight } from "lucide-react";

const footerLinks = {
  Product: [
    { label: "Find Jobs", href: "/jobs" },
    { label: "For Employers", href: "/dashboard" },
    { label: "Pricing", href: "#pricing" },
    { label: "How it Works", href: "#how-it-works" },
  ],
  Company: [
    { label: "About Us", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Mission", href: "#" },
    { label: "Contact", href: "#" },
  ],
  Resources: [
    { label: "Blog", href: "#" },
    { label: "Help Center", href: "#" },
    { label: "Career Advice", href: "#" },
    { label: "Salary Guide", href: "#" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background text-foreground">
      {/* Pre-footer CTA */}
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl shadow-2xl shadow-primary/10">
          {/* Gradient background */}
          <div className="absolute inset-0 accent-gradient-bg" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-15 mix-blend-overlay"></div>
          
          <div className="relative z-10 px-6 py-16 text-center sm:px-16 sm:py-20">
            <div className="mx-auto max-w-2xl">
              <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Ready to find your next opportunity?
              </h2>
              <p className="mx-auto mt-4 text-lg text-white/80">
                Join thousands of professionals who&apos;ve already found their dream role through JobPing.
              </p>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/sign-up"
                  className="group inline-flex h-12 items-center justify-center rounded-full bg-white px-8 font-medium text-gray-900 transition-all hover:bg-white/90 hover:scale-105 shadow-lg"
                >
                  Create Free Profile
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/jobs"
                  className="inline-flex h-12 items-center justify-center rounded-full border border-white/30 px-8 font-medium text-white transition-all hover:bg-white/10"
                >
                  Browse Jobs
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-12 pt-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-12 sm:grid-cols-4 lg:grid-cols-6 lg:gap-8">
          
          {/* Brand & Mission */}
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="flex w-fit items-center gap-2 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground transition-transform group-hover:scale-105 shadow-sm">
                <Briefcase className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold tracking-tight">JobPing</span>
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted-foreground">
              The modern job platform connecting talented professionals with top companies worldwide. Built for the future of work.
            </p>
            <div className="mt-8 flex items-center gap-3">
              <a href="#" className="rounded-full bg-primary/10 p-2 text-primary transition-all hover:bg-primary hover:text-primary-foreground hover:scale-110">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="rounded-full bg-primary/10 p-2 text-primary transition-all hover:bg-primary hover:text-primary-foreground hover:scale-110">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href="#" className="rounded-full bg-primary/10 p-2 text-primary transition-all hover:bg-primary hover:text-primary-foreground hover:scale-110">
                <Github className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="col-span-1 lg:col-span-1">
              <h4 className="text-sm font-semibold text-foreground tracking-tight">{title}</h4>
              <ul className="mt-5 space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* Divider & Copyright */}
        <div className="mt-16 border-t border-border/40 pt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} JobPing Inc. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground/60">
            Built with Next.js, Convex & Clerk
          </p>
        </div>
      </div>
    </footer>
  );
}
