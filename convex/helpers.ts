import type { MutationCtx, QueryCtx } from "./_generated/server";
import type { Id } from "./_generated/dataModel";

export async function requireAuth(ctx: MutationCtx | QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Unauthorized");
  }
  return identity;
}

export async function getConvexUser(ctx: MutationCtx | QueryCtx, clerkId: string) {
  const user = await ctx.db
    .query("users")
    .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
    .unique();
  if (!user) {
    throw new Error("User not found");
  }
  return user;
}

export async function requireOrgMembership(
  ctx: MutationCtx | QueryCtx,
  userId: Id<"users"> | string,
  organizationId: Id<"organizations"> | string
) {
  const membership = await ctx.db
    .query("memberships")
    .withIndex("by_userId_organizationId", (q) =>
      q
        .eq("userId", userId as Id<"users">)
        .eq("organizationId", organizationId as Id<"organizations">)
    )
    .unique();

  if (!membership) {
    throw new Error("Forbidden: Not a member of this organization");
  }
}


export function sanitizeInput(input: string): string {
  return input
    .replace(/<[^>]*>/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "")
    .trim();
}

export function sanitizeUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return trimmed;

  try {
    const parsed = new URL(trimmed);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      throw new Error("Invalid URL protocol — only http/https allowed");
    }
    return parsed.href;
  } catch {
    throw new Error("Invalid URL format");
  }
}
