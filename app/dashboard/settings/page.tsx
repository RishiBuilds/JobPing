"use client";

import { UserProfile } from "@clerk/nextjs";

export default function SettingsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="mt-1 text-muted-foreground">
          Manage your account settings
        </p>
      </div>

      <UserProfile
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
