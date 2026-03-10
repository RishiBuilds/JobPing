import { v } from "convex/values";
import { internalMutation, query } from "./_generated/server";
import { requireAuth, getConvexUser, requireOrgMembership } from "./helpers";

export const upsertMembership = internalMutation({
  args: {
    clerkOrgId: v.string(),
    clerkUserId: v.string(),
    clerkRole: v.string(),
  },
  handler: async (ctx, args) => {
    const org = await ctx.db
      .query("organizations")
      .withIndex("by_clerkOrgId", (q) => q.eq("clerkOrgId", args.clerkOrgId))
      .unique();

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkUserId))
      .unique();

    if (!org || !user) return null;

    const memberships = await ctx.db
      .query("memberships")
      .withIndex("by_organizationId", (q) => q.eq("organizationId", org._id))
      .collect();

    const existing = memberships.find((m) => m.userId === user._id);

    if (existing) {
      await ctx.db.patch(existing._id, { clerkRole: args.clerkRole });
      return existing._id;
    }

    await ctx.db.patch(user._id, { role: "employer" });

    return await ctx.db.insert("memberships", {
      organizationId: org._id,
      userId: user._id,
      clerkRole: args.clerkRole,
      joinedAt: Date.now(),
    });
  },
});

export const deleteMembership = internalMutation({
  args: {
    clerkOrgId: v.string(),
    clerkUserId: v.string(),
  },
  handler: async (ctx, args) => {
    const org = await ctx.db
      .query("organizations")
      .withIndex("by_clerkOrgId", (q) => q.eq("clerkOrgId", args.clerkOrgId))
      .unique();

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkUserId))
      .unique();

    if (!org || !user) return;

    const memberships = await ctx.db
      .query("memberships")
      .withIndex("by_organizationId", (q) => q.eq("organizationId", org._id))
      .collect();

    const membership = memberships.find((m) => m.userId === user._id);

    if (membership) {
      await ctx.db.delete(membership._id);
    }
  },
});

export const getByOrg = query({
  args: { organizationId: v.id("organizations") },
  handler: async (ctx, args) => {

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) throw new Error("User not found");

    await requireOrgMembership(ctx, user._id, args.organizationId);

    const memberships = await ctx.db
      .query("memberships")
      .withIndex("by_organizationId", (q) =>
        q.eq("organizationId", args.organizationId)
      )
      .collect();

    const enriched = await Promise.all(
      memberships.map(async (m) => {
        const memberUser = await ctx.db.get(m.userId);
        return {
          ...m,
          userName: memberUser
            ? `${memberUser.firstName ?? ""} ${memberUser.lastName ?? ""}`.trim()
            : "Unknown",
          userEmail: memberUser?.email ?? "",
          userImage: memberUser?.imageUrl,
        };
      })
    );

    return enriched;
  },
});
