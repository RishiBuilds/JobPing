import { v } from "convex/values";
import { internalMutation, query } from "./_generated/server";
import { requireAuth, getConvexUser, requireOrgMembership } from "./helpers";

export const log = internalMutation({
  args: {
    organizationId: v.optional(v.id("organizations")),
    userId: v.optional(v.id("users")),
    action: v.string(),
    details: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("activityLogs", {
      organizationId: args.organizationId,
      userId: args.userId,
      action: args.action,
      details: args.details,
      timestamp: Date.now(),
    });
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

    return await ctx.db
      .query("activityLogs")
      .withIndex("by_organizationId", (q) =>
        q.eq("organizationId", args.organizationId)
      )
      .order("desc")
      .take(50);
  },
});
