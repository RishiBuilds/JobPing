"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect, useRef } from "react";

export function SyncUser() {
  const { user, isSignedIn } = useUser();
  const syncUser = useMutation(api.users.syncCurrentUser);
  const synced = useRef(false);

  useEffect(() => {
    if (!isSignedIn || !user || synced.current) return;

    synced.current = true;

    syncUser({
      email: user.primaryEmailAddress?.emailAddress ?? "",
      firstName: user.firstName ?? undefined,
      lastName: user.lastName ?? undefined,
      imageUrl: user.imageUrl ?? undefined,
    }).catch(console.error);
  }, [isSignedIn, user, syncUser]);

  return null;
}
