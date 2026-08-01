import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse Jobs — JobPing",
  description:
    "Explore top job opportunities, filter by location, role, and salary, and land your next dream position on JobPing.",
};

export default function JobsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
