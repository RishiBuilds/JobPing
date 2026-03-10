"use client";

import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import { ReactNode } from "react";
import { SyncUser } from "@/components/SyncUser";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/ThemeProvider";

const convex = new ConvexReactClient(
  process.env.NEXT_PUBLIC_CONVEX_URL as string
);

import { shadcn } from "@clerk/ui/themes";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        theme: shadcn,
        variables: {
          colorPrimary: "#18181b",
        },
        elements: {
          avatarBox: "shadow-sm border border-border/50",
        }
      }}
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SyncUser />
          <Toaster richColors position="top-right" />
          {children}
        </ThemeProvider>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
