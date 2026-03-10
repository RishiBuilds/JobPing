"use client";

import { useState, useEffect } from "react";
import { useOrganization } from "@clerk/nextjs";
import { useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, CreditCard, Zap, Crown, Rocket } from "lucide-react";
import { toast } from "sonner";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for small teams getting started.",
    icon: Zap,
    features: [
      "1 active job posting",
      "Standard applicant tracking",
      "Email notifications",
      "Community support",
    ],
    planKey: "free" as const,
    popular: false,
  },
  {
    name: "Pro",
    price: "$49",
    period: "/month",
    description: "For growing teams with active hiring needs.",
    icon: Rocket,
    features: [
      "5 active job postings",
      "Advanced applicant tracking",
      "Team collaboration (3 members)",
      "Priority support",
    ],
    planKey: "pro" as const,
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$199",
    period: "/month",
    description: "For large companies with high-volume hiring.",
    icon: Crown,
    features: [
      "Unlimited job postings",
      "Custom hiring workflows",
      "Unlimited team members",
      "Dedicated account manager",
    ],
    planKey: "enterprise" as const,
    popular: false,
  },
];

export default function BillingPage() {
  const { organization } = useOrganization();
  const [upgrading, setUpgrading] = useState<string | null>(null);

  const syncOrg = useMutation(api.organizations.syncOrganization);
  const [convexOrg, setConvexOrg] = useState<any>(null);

  useEffect(() => {
    if (organization?.id && organization?.name) {
      syncOrg({
        clerkOrgId: organization.id,
        name: organization.name,
        slug: organization.slug || undefined,
        imageUrl: organization.imageUrl || undefined,
      }).then((org) => setConvexOrg(org))
        .catch(console.error);
    }
  }, [organization?.id, organization?.name]);

  const updatePlan = useAction(api.organizations.requestPlanChange);

  const currentPlan = convexOrg?.plan ?? "free";

  const handleUpgrade = async (
    planKey: "free" | "pro" | "enterprise"
  ) => {
    if (!convexOrg || !organization) return;

    setUpgrading(planKey);
    try {
      await updatePlan({
        clerkOrgId: organization.id,
        plan: planKey,
      });
      toast.success(`Plan updated to ${planKey.charAt(0).toUpperCase() + planKey.slice(1)}!`);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update plan"
      );
    } finally {
      setUpgrading(null);
    }
  };

  if (!organization) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <CreditCard className="mb-4 h-12 w-12 text-muted-foreground/50" />
        <h2 className="text-xl font-bold">No Organization Selected</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Select or create an organization to manage billing.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Billing</h1>
        <p className="mt-1 text-muted-foreground">
          Manage your subscription and billing
        </p>
      </div>

      {/* Current Plan */}
      <Card className="mb-8 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-muted-foreground" />
            Current Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Badge>
              {currentPlan.toUpperCase()}
            </Badge>
            <p className="text-sm text-muted-foreground">
              {currentPlan === "free"
                ? "1 active job posting"
                : currentPlan === "pro"
                  ? "5 active job postings"
                  : "Unlimited job postings"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Plans Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => {
          const isCurrent = plan.planKey === currentPlan;
          const isDowngrade =
            (currentPlan === "enterprise" && plan.planKey !== "enterprise") ||
            (currentPlan === "pro" && plan.planKey === "free");
          const PlanIcon = plan.icon;

          return (
            <Card
              key={plan.name}
              className={`relative border-border/50 transition-all overflow-visible ${
                plan.popular
                  ? "border-foreground shadow-lg ring-1 ring-foreground"
                  : isCurrent
                    ? "border-foreground/50 ring-1 ring-foreground/20"
                    : "hover:border-border/80"
              }`}
            >
              {plan.popular && !isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="text-xs bg-zinc-900 text-white hover:bg-zinc-900/90 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/90 shadow-sm border-none">
                    Most Popular
                  </Badge>
                </div>
              )}
              <CardContent className="p-6">
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-foreground">
                    <PlanIcon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                </div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">
                    {plan.period}
                  </span>
                </div>

                <ul className="mt-6 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-foreground" />
                      <span className="text-muted-foreground">{f}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`mt-6 w-full font-medium ${
                    isCurrent
                      ? ""
                      : "bg-foreground text-background hover:bg-foreground/90"
                  }`}
                  variant={isCurrent ? "outline" : "default"}
                  disabled={isCurrent || upgrading !== null}
                  onClick={() => handleUpgrade(plan.planKey)}
                >
                  {isCurrent
                    ? "Current Plan"
                    : upgrading === plan.planKey
                      ? "Updating..."
                      : isDowngrade
                        ? "Downgrade"
                        : "Upgrade"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Plan changes take effect immediately. For enterprise pricing, contact
        our sales team.
      </p>
    </div>
  );
}
