import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for small teams getting started.",
    features: [
      "1 active job posting",
      "Standard applicant tracking",
      "Email notifications",
      "Community support",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: "$49",
    period: "/month",
    description: "For growing teams with active hiring needs.",
    features: [
      "5 active job postings",
      "Advanced applicant tracking",
      "Team collaboration (3 members)",
      "Priority support",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$199",
    period: "/month",
    description: "For large companies with high-volume hiring.",
    features: [
      "Unlimited job postings",
      "Custom hiring workflows",
      "Unlimited team members",
      "Dedicated account manager",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export function Pricing() {
  return (
    <section className="bg-background py-24 sm:py-32" id="pricing">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Start free and scale as you grow. No hidden fees.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3 lg:gap-12 lg:px-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col justify-between rounded-3xl p-8 transition-all duration-300 ${
                plan.popular
                  ? "border border-border/60 bg-card shadow-2xl shadow-black/5 ring-1 ring-primary/20 dark:shadow-none"
                  : "border border-border/40 bg-zinc-50/50 hover:border-border/80 dark:bg-card"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-0 right-0 mx-auto w-fit rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-sm">
                  Recommended
                </div>
              )}
              
              <div>
                <h3 className="text-xl font-semibold text-foreground">{plan.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {plan.description}
                </p>

                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-bold tracking-tight text-foreground">{plan.price}</span>
                  <span className="text-sm font-medium text-muted-foreground">
                    {plan.period}
                  </span>
                </div>

                <Link href="/sign-up" className="mt-8 block">
                  <Button
                    className={`w-full font-medium rounded-full ${
                      plan.popular
                        ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                        : "bg-background text-foreground border-border/60 hover:bg-muted"
                    }`}
                    variant={plan.popular ? "default" : "outline"}
                    size="lg"
                  >
                    {plan.cta}
                  </Button>
                </Link>

                <div className="mt-8 border-t border-border/40 pt-8" />
                
                <ul className="space-y-4">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm font-medium text-foreground/80"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
