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
    <section id="how-it-works" className="bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            How it works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Get started in four simple steps to find your next opportunity.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <div 
              key={step.step} 
              className="group relative flex flex-col items-start rounded-2xl border border-border/40 bg-card p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-border/80 hover:shadow-md"
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <step.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-semibold tracking-tight text-foreground">
                {step.step}. {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
