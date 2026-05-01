import { UserPlus, Search, FileText, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Create Profile",
    description: "Build your professional brand in minutes. Add skills, experience, and what you're looking for.",
  },
  {
    icon: Search,
    step: "02",
    title: "Discover Jobs",
    description: "Browse curated listings from verified companies. Filter roles to find your perfect match.",
  },
  {
    icon: FileText,
    step: "03",
    title: "Apply Instantly",
    description: "Submit applications seamlessly with a single click using your saved profile data.",
  },
  {
    icon: CheckCircle,
    step: "04",
    title: "Get Hired",
    description: "Connect directly with hiring managers, track your applications, and land the role.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-card/50 py-24 sm:py-32 border-b border-border/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary mb-4">
            How It Works
          </div>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Get started in{" "}
            <span className="gradient-text">four simple steps</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            From profile creation to getting hired — it&apos;s that simple.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <div 
              key={step.step} 
              className="group relative flex flex-col items-start rounded-2xl border border-border/40 bg-card p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5"
            >
              {/* Step number */}
              <div className="absolute top-4 right-4 text-4xl font-black text-primary/8 select-none">
                {step.step}
              </div>
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-md group-hover:shadow-primary/20">
                <step.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-semibold tracking-tight text-foreground">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>

              {/* Connector line (hidden on last) */}
              {i < steps.length - 1 && (
                <div className="absolute -right-3 top-1/2 hidden h-px w-6 bg-primary/15 lg:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
