import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Applications - JobPing",
  description:
    "Track and manage your submitted job applications on JobPing.",
};

export default function ApplicationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
