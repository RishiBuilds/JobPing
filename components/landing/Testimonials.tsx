import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Nitin Vijay",
    role: "Software Engineer",
    company: "Google",
    initials: "SC",
    quote: "JobPing helped me find my dream role in just 2 weeks. The search filters are incredibly precise, and the one-click apply saved me hours.",
  },
  {
    name: "Sanjay Bansal",
    role: "Head of Talent",
    company: "TechCorp",
    initials: "MJ",
    quote: "We've been using JobPing for 6 months and it's transformed our hiring. The applicant management tools are best-in-class.",
  },
  {
    name: "Alakh Pandey",
    role: "Product Designer",
    company: "Stripe",
    initials: "ER",
    quote: "The platform is beautifully designed and intuitive. I received 3 offers within a month of creating my profile. Highly recommend!",
  },
  {
    name: "Khan GS",
    role: "Engineering Manager",
    company: "Linear",
    initials: "DK",
    quote: "Finding high-quality talent is hard. JobPing gives us direct access to candidates who are actively looking and match our stack perfectly.",
  },
  {
    name: "Anita Desai",
    role: "Data Scientist",
    company: "Vercel",
    initials: "AD",
    quote: "I love the privacy features. I could securely browse opportunities without alerting my current employer until I was ready to interview.",
  },
  {
    name: "Nikita Bier",
    role: "Startup Founder",
    company: "Nova AI",
    initials: "JW",
    quote: "As an early-stage startup, we compete for top talent. JobPing levels the playing field and connects us directly with great engineers.",
  },
];

const scrollItems = [...testimonials, ...testimonials];

export function Testimonials() {
  return (
    <section className="overflow-hidden border-t border-border/40 bg-zinc-50/50 py-24 sm:py-32 dark:bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Trusted by professionals
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            See how top talent and leading companies use JobPing to connect.
          </p>
        </div>

        <div className="relative mt-16 flex w-full flex-col items-center justify-center overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="flex w-max animate-[marquee_60s_linear_infinite] gap-6 pr-6 hover:[animation-play-state:paused] py-4">
            {scrollItems.map((t, idx) => (
              <div
                key={`${t.name}-${idx}`}
                className="w-[350px] shrink-0 sm:w-[400px]"
              >
                <div className="flex h-full flex-col justify-between rounded-2xl border border-border/40 bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-border/80 hover:shadow-md">
                  <div className="mb-6 flex items-center gap-4">
                    <Avatar className="h-12 w-12 border border-border/50 shadow-sm">
                      <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
                        {t.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-semibold text-foreground tracking-tight">{t.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {t.role} at <span className="font-medium text-foreground/80">{t.company}</span>
                      </div>
                    </div>
                  </div>
                  <blockquote className="text-sm leading-relaxed text-foreground/90 font-medium">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
