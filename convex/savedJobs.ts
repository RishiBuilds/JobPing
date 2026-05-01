import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAuth, getConvexUser } from "./helpers";

export const toggleSave = mutation({
  args: { jobId: v.id("jobs") },
  handler: async (ctx, args) => {
    const identity = await requireAuth(ctx);
    const user = await getConvexUser(ctx, identity.subject);

    const existing = await ctx.db
      .query("savedJobs")
      .withIndex("by_userId_jobId", (q) =>
        q.eq("userId", user._id).eq("jobId", args.jobId)
      )
      .unique();

    if (existing) {
      await ctx.db.delete(existing._id);
      return { saved: false };
    }

    await ctx.db.insert("savedJobs", {
      userId: user._id,
      jobId: args.jobId,
      savedAt: Date.now(),
    });

    return { saved: true };
  },
});

export const checkIfSaved = query({
  args: { jobId: v.id("jobs") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return false;

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) return false;

    const existing = await ctx.db
      .query("savedJobs")
      .withIndex("by_userId_jobId", (q) =>
        q.eq("userId", user._id).eq("jobId", args.jobId)
      )
      .unique();

    return existing !== null;
  },
});

export const getSavedJobs = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) return [];

    const savedEntries = await ctx.db
      .query("savedJobs")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();

    const enriched = await Promise.all(
      savedEntries.map(async (entry) => {
        const job = await ctx.db.get(entry.jobId);
        if (!job || job.isDeleted) return null;

        const org = await ctx.db.get(job.organizationId);
        return {
          ...entry,
          job: {
            ...job,
            companyName: org?.name ?? "Unknown Company",
            companyLogo: org?.imageUrl,
          },
        };
      })
    );

    return enriched.filter(Boolean);
  },
});
