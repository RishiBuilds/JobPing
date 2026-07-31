"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Is JobPing free to use for job seekers?",
    answer:
      "Yes! JobPing is completely free for job seekers. You can create a profile, browse all listings, save jobs, and apply to positions without spending a cent. We only charge employers who want to post more than one active job listing.",
  },
  {
    question: "How do I apply for a job on JobPing?",
    answer:
      "Once you have a profile, just find a job you like and click Apply. You can upload your resume (PDF or Word), add a cover letter, and submit — all in under two minutes. Your application is instantly sent to the employer's dashboard.",
  },
  {
    question: "Can I track the status of my applications?",
    answer:
      "Absolutely. Your Applications page shows every job you've applied to, along with a real-time status tracker — from Pending → Reviewed → Shortlisted → Hired. You'll also receive notifications when your status changes.",
  },
  {
    question: "How does the Free employer plan work?",
    answer:
      "The Free plan lets you post 1 active job at a time with standard applicant tracking and email notifications. When you're ready to scale, you can upgrade to Pro (5 active jobs, team collaboration) or Enterprise (unlimited postings, custom workflows).",
  },
  {
    question: "Is my profile data private and secure?",
    answer:
      "Your privacy is a priority. You control exactly who sees your profile and applications. All data is encrypted in transit and at rest. We never share your personal information with third parties without your explicit consent.",
  },
  {
    question: "How do I invite team members to my organization?",
    answer:
      "From your dashboard, open the organization switcher and go to Manage Organization. You can invite team members by email and assign them roles (admin or member). Collaboration features are available on the Pro and Enterprise plans.",
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-border/40 last:border-0">
      <button
        className="flex w-full items-center justify-between gap-4 py-5 text-left transition-colors hover:text-primary"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="text-base font-medium text-foreground">{question}</span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 ${
            open ? "rotate-180 text-primary" : ""
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          open ? "max-h-60 pb-5 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <p className="text-sm leading-relaxed text-muted-foreground">{answer}</p>
      </div>
    </div>
  );
}

export function FAQ() {
  return (
    <section className="bg-background py-24 sm:py-32 border-b border-border/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-3">
          {/* Left heading */}
          <div className="lg:col-span-1">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary mb-4">
              FAQ
            </div>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Frequently asked{" "}
              <span className="gradient-text">questions</span>
            </h2>
            <p className="mt-4 text-base text-muted-foreground leading-relaxed">
              Everything you need to know about JobPing. Can&apos;t find your answer?{" "}
              <a href="#" className="text-primary underline-offset-4 hover:underline">
                Contact us
              </a>
              .
            </p>
          </div>

          {/* Right accordion */}
          <div className="lg:col-span-2 rounded-2xl border border-border/40 bg-card px-6 divide-y-0">
            {faqs.map((faq) => (
              <FAQItem key={faq.question} {...faq} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
