"use client";

import { OrganizationProfile, useOrganization } from "@clerk/nextjs";

export default function TeamPage() {
  const { organization } = useOrganization();

  if (!organization) {
    return (
      <div className="py-20 text-center text-muted-foreground">
        Select an organization to manage your team.
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Team Management</h1>
        <p className="mt-1 text-muted-foreground">
          Manage your team members, roles, and invitations
        </p>
      </div>

      <OrganizationProfile
        routing="hash"
        appearance={{
          elements: {
            rootBox: "w-full max-w-none",
            cardBox: "shadow-none w-full max-w-none",
            card: "shadow-none border border-border/50 rounded-xl w-full max-w-none",
          },
        }}
      />
    </div>
  );
}
