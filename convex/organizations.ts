import { v } from "convex/values";
import { action, internalMutation, query, mutation } from "./_generated/server";
import { internal } from "./_generated/api";

export const upsertOrganization = internalMutation({
  args: {
    clerkOrgId: v.string(),
    name: v.string(),
    slug: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("organizations")
      .withIndex("by_clerkOrgId", (q) => q.eq("clerkOrgId", args.clerkOrgId))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        name: args.name,
        slug: args.slug,
        imageUrl: args.imageUrl,
      });
      return existing._id;
    }

    return await ctx.db.insert("organizations", {
      clerkOrgId: args.clerkOrgId,
      name: args.name,
      slug: args.slug,
      imageUrl: args.imageUrl,
      plan: "free",
      createdAt: Date.now(),
    });
  },
});

export const updatePlan = internalMutation({
  args: {
    clerkOrgId: v.string(),
    plan: v.union(v.literal("free"), v.literal("pro"), v.literal("enterprise")),
  },
  handler: async (ctx, args) => {
    const org = await ctx.db
      .query("organizations")
      .withIndex("by_clerkOrgId", (q) => q.eq("clerkOrgId", args.clerkOrgId))
      .unique();

    if (org) {
      await ctx.db.patch(org._id, { plan: args.plan });
    }
  },
});

export const deleteOrganization = internalMutation({
  args: {
    clerkOrgId: v.string(),
  },
  handler: async (ctx, args) => {
    const org = await ctx.db
      .query("organizations")
      .withIndex("by_clerkOrgId", (q) => q.eq("clerkOrgId", args.clerkOrgId))
      .unique();

    if (org) {
      const memberships = await ctx.db
        .query("memberships")
        .withIndex("by_organizationId", (q) => q.eq("organizationId", org._id))
        .collect();
      
      for (const membership of memberships) {
        await ctx.db.delete(membership._id);
      }

      const jobs = await ctx.db
        .query("jobs")
        .withIndex("by_organizationId", (q) => q.eq("organizationId", org._id))
        .collect();

      for (const job of jobs) {
        const applications = await ctx.db
          .query("applications")
          .withIndex("by_jobId", (q) => q.eq("jobId", job._id))
          .collect();
        
        for (const app of applications) {
          await ctx.db.delete(app._id);
        }

        await ctx.db.delete(job._id);
      }

      await ctx.db.delete(org._id);
    }
  },
});

// PUBLIC

export const syncOrganization = mutation({
  args: { 
    clerkOrgId: v.string(),
    name: v.string(),
    slug: v.optional(v.string()),
    imageUrl: v.optional(v.string())
  },
  handler: async (ctx: any, args: any) => {
    const existing = await ctx.db
      .query("organizations")
      .withIndex("by_clerkOrgId", (q: any) => q.eq("clerkOrgId", args.clerkOrgId))
      .unique();

    let orgId = existing?._id;

    if (!existing) {
      orgId = await ctx.db.insert("organizations", {
        clerkOrgId: args.clerkOrgId,
        name: args.name,
        slug: args.slug,
        imageUrl: args.imageUrl,
        plan: "free",
        createdAt: Date.now(),
      });
    }

    const identity = await ctx.auth.getUserIdentity();
    if (identity) {
      const user = await ctx.db
        .query("users")
        .withIndex("by_clerkId", (q: any) => q.eq("clerkId", identity.subject))
        .unique();

      if (user && orgId) {
        const existingMembership = await ctx.db
          .query("memberships")
          .withIndex("by_userId_organizationId", (q: any) =>
            q.eq("userId", user._id).eq("organizationId", orgId)
          )
          .unique();

        if (!existingMembership) {
          await ctx.db.insert("memberships", {
            userId: user._id,
            organizationId: orgId,
            clerkRole: "org:admin",
            joinedAt: Date.now(),
          });

          if (user.role !== "employer") {
            await ctx.db.patch(user._id, { role: "employer" });
          }
        }
      }
    }

    return await ctx.db.get(orgId);
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("organizations")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
  },
});

export const listTop = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("organizations")
      .order("desc")
      .take(10);
  },
});

export const requestPlanChange = action({
  args: {
    clerkOrgId: v.string(),
    plan: v.union(v.literal("free"), v.literal("pro"), v.literal("enterprise")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    await ctx.runMutation(internal.organizations.updatePlan, {
      clerkOrgId: args.clerkOrgId,
      plan: args.plan,
    });
  },
});
