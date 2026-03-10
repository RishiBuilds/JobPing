import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import {
  requireAuth,
  getConvexUser,
  requireOrgMembership,
  sanitizeInput,
} from "./helpers";

export const createJob = mutation({
  args: {
    organizationId: v.id("organizations"),
    title: v.string(),
    description: v.string(),
    location: v.string(),
    salaryMin: v.optional(v.number()),
    salaryMax: v.optional(v.number()),
    jobType: v.union(
      v.literal("full-time"),
      v.literal("part-time"),
      v.literal("contract"),
      v.literal("internship")
    ),
    workMode: v.union(
      v.literal("remote"),
      v.literal("onsite"),
      v.literal("hybrid")
    ),
    experienceLevel: v.union(
      v.literal("entry"),
      v.literal("mid"),
      v.literal("senior"),
      v.literal("lead"),
      v.literal("executive")
    ),
    skills: v.array(v.string()),
    expiresAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await requireAuth(ctx);
    const user = await getConvexUser(ctx, identity.subject);
    await requireOrgMembership(ctx, user._id, args.organizationId);

    // Check org plan limits
    const org = await ctx.db.get(args.organizationId);
    if (!org) throw new Error("Organization not found");

    const existingJobs = await ctx.db
      .query("jobs")
      .withIndex("by_organizationId", (q) =>
        q.eq("organizationId", args.organizationId)
      )
      .collect();

    const activeJobs = existingJobs.filter(
      (j) => j.isPublished && !j.isDeleted
    );
    const limits: Record<string, number> = {
      free: 1,
      pro: 5,
      enterprise: Infinity,
    };

    if (activeJobs.length >= limits[org.plan]) {
      throw new Error(
        `Plan limit reached. Your ${org.plan} plan allows ${limits[org.plan]} active job(s). Upgrade to post more.`
      );
    }

    // Sanitize inputs
    const sanitizedTitle = sanitizeInput(args.title);
    const sanitizedDescription = sanitizeInput(args.description);
    const sanitizedLocation = sanitizeInput(args.location);
    const sanitizedSkills = args.skills.map(sanitizeInput);

    // Validate salary
    if (
      args.salaryMin !== undefined &&
      args.salaryMax !== undefined &&
      args.salaryMin > args.salaryMax
    ) {
      throw new Error("Minimum salary cannot be greater than maximum salary");
    }

    const jobId = await ctx.db.insert("jobs", {
      organizationId: args.organizationId,
      title: sanitizedTitle,
      description: sanitizedDescription,
      location: sanitizedLocation,
      salaryMin: args.salaryMin,
      salaryMax: args.salaryMax,
      jobType: args.jobType,
      workMode: args.workMode,
      experienceLevel: args.experienceLevel,
      skills: sanitizedSkills,
      isPublished: false,
      isDeleted: false,
      postedBy: user._id,
      expiresAt: args.expiresAt,
      updatedAt: Date.now(),
      createdAt: Date.now(),
    });

    // Activity log
    await ctx.db.insert("activityLogs", {
      organizationId: args.organizationId,
      userId: user._id,
      action: "job_created",
      details: `Created job "${sanitizedTitle}"`,
      timestamp: Date.now(),
    });

    return jobId;
  },
});

export const updateJob = mutation({
  args: {
    jobId: v.id("jobs"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    location: v.optional(v.string()),
    salaryMin: v.optional(v.number()),
    salaryMax: v.optional(v.number()),
    jobType: v.optional(
      v.union(
        v.literal("full-time"),
        v.literal("part-time"),
        v.literal("contract"),
        v.literal("internship")
      )
    ),
    workMode: v.optional(
      v.union(
        v.literal("remote"),
        v.literal("onsite"),
        v.literal("hybrid")
      )
    ),
    experienceLevel: v.optional(
      v.union(
        v.literal("entry"),
        v.literal("mid"),
        v.literal("senior"),
        v.literal("lead"),
        v.literal("executive")
      )
    ),
    skills: v.optional(v.array(v.string())),
    expiresAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await requireAuth(ctx);
    const user = await getConvexUser(ctx, identity.subject);

    const job = await ctx.db.get(args.jobId);
    if (!job || job.isDeleted) throw new Error("Job not found");
    await requireOrgMembership(ctx, user._id, job.organizationId);

    // Validate salary
    const newMin = args.salaryMin ?? job.salaryMin;
    const newMax = args.salaryMax ?? job.salaryMax;
    if (
      newMin !== undefined &&
      newMax !== undefined &&
      newMin > newMax
    ) {
      throw new Error("Minimum salary cannot be greater than maximum salary");
    }

    const { jobId, ...updates } = args;

    // Sanitize text fields
    const sanitized: Record<string, any> = { updatedAt: Date.now() };
    for (const [key, val] of Object.entries(updates)) {
      if (val === undefined) continue;
      if (key === "title" || key === "description" || key === "location") {
        sanitized[key] = sanitizeInput(val as string);
      } else if (key === "skills") {
        sanitized[key] = (val as string[]).map(sanitizeInput);
      } else {
        sanitized[key] = val;
      }
    }

    await ctx.db.patch(jobId, sanitized);
  },
});

export const deleteJob = mutation({
  args: { jobId: v.id("jobs") },
  handler: async (ctx, args) => {
    const identity = await requireAuth(ctx);
    const user = await getConvexUser(ctx, identity.subject);

    const job = await ctx.db.get(args.jobId);
    if (!job || job.isDeleted) throw new Error("Job not found");
    await requireOrgMembership(ctx, user._id, job.organizationId);

    // Soft delete
    await ctx.db.patch(args.jobId, {
      isDeleted: true,
      isPublished: false,
      updatedAt: Date.now(),
    });

    // Activity log
    await ctx.db.insert("activityLogs", {
      organizationId: job.organizationId,
      userId: user._id,
      action: "job_deleted",
      details: `Deleted job "${job.title}"`,
      timestamp: Date.now(),
    });
  },
});

export const togglePublish = mutation({
  args: { jobId: v.id("jobs") },
  handler: async (ctx, args) => {
    const identity = await requireAuth(ctx);
    const user = await getConvexUser(ctx, identity.subject);

    const job = await ctx.db.get(args.jobId);
    if (!job || job.isDeleted) throw new Error("Job not found");
    await requireOrgMembership(ctx, user._id, job.organizationId);

    // If publishing, check plan limits + expiry
    if (!job.isPublished) {
      const org = await ctx.db.get(job.organizationId);
      if (!org) throw new Error("Organization not found");

      const activeJobs = await ctx.db
        .query("jobs")
        .withIndex("by_organizationId_isPublished", (q) =>
          q.eq("organizationId", job.organizationId).eq("isPublished", true)
        )
        .collect();

      const nonDeletedActive = activeJobs.filter((j) => !j.isDeleted);
      const limits: Record<string, number> = {
        free: 1,
        pro: 5,
        enterprise: Infinity,
      };

      if (nonDeletedActive.length >= limits[org.plan]) {
        throw new Error(
          `Plan limit reached. Your ${org.plan} plan allows ${limits[org.plan]} active job(s).`
        );
      }

      // Check expiry
      if (job.expiresAt && job.expiresAt < Date.now()) {
        throw new Error("Cannot publish expired job. Update the expiry date.");
      }
    }

    await ctx.db.patch(args.jobId, {
      isPublished: !job.isPublished,
      updatedAt: Date.now(),
    });
  },
});

export const listByOrg = query({
  args: { organizationId: v.id("organizations") },
  handler: async (ctx, args) => {
    const jobs = await ctx.db
      .query("jobs")
      .withIndex("by_organizationId", (q) =>
        q.eq("organizationId", args.organizationId)
      )
      .order("desc")
      .collect();

    // Filter out soft-deleted
    return jobs.filter((j) => !j.isDeleted);
  },
});

export const listPublished = query({
  args: {},
  handler: async (ctx) => {
    const jobs = await ctx.db
      .query("jobs")
      .withIndex("by_isPublished", (q) => q.eq("isPublished", true))
      .order("desc")
      .take(100);

    // Filter out deleted and expired
    const now = Date.now();
    const activeJobs = jobs.filter(
      (j) => !j.isDeleted && (!j.expiresAt || j.expiresAt > now)
    );

    const enriched = await Promise.all(
      activeJobs.map(async (job) => {
        const org = await ctx.db.get(job.organizationId);
        const poster = await ctx.db.get(job.postedBy);
        return {
          ...job,
          companyName: org?.name ?? "Unknown Company",
          companyLogo: org?.imageUrl,
          posterName: poster
            ? `${poster.firstName ?? ""} ${poster.lastName ?? ""}`.trim()
            : "Unknown",
        };
      })
    );

    return enriched;
  },
});

export const getById = query({
  args: { jobId: v.id("jobs") },
  handler: async (ctx, args) => {
    const job = await ctx.db.get(args.jobId);
    if (!job || job.isDeleted) return null;

    const org = await ctx.db.get(job.organizationId);
    const poster = await ctx.db.get(job.postedBy);

    return {
      ...job,
      companyName: org?.name ?? "Unknown Company",
      companyLogo: org?.imageUrl,
      companySlug: org?.slug,
      posterName: poster
        ? `${poster.firstName ?? ""} ${poster.lastName ?? ""}`.trim()
        : "Unknown",
      isExpired: job.expiresAt ? job.expiresAt < Date.now() : false,
    };
  },
});

export const searchJobs = query({
  args: {
    searchTerm: v.optional(v.string()),
    location: v.optional(v.string()),
    jobType: v.optional(v.string()),
    workMode: v.optional(v.string()),
    experienceLevel: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let jobs = await ctx.db
      .query("jobs")
      .withIndex("by_isPublished", (q) => q.eq("isPublished", true))
      .order("desc")
      .take(100);

    // Filter out deleted and expired
    const now = Date.now();
    jobs = jobs.filter(
      (j) => !j.isDeleted && (!j.expiresAt || j.expiresAt > now)
    );

    // Server-side filtering
    if (args.searchTerm) {
      const term = args.searchTerm.toLowerCase();
      jobs = jobs.filter(
        (j) =>
          j.title.toLowerCase().includes(term) ||
          j.description.toLowerCase().includes(term) ||
          j.skills.some((s) => s.toLowerCase().includes(term))
      );
    }

    if (args.location) {
      const loc = args.location.toLowerCase();
      jobs = jobs.filter((j) => j.location.toLowerCase().includes(loc));
    }

    if (args.jobType && args.jobType !== "all") {
      jobs = jobs.filter((j) => j.jobType === args.jobType);
    }

    if (args.workMode && args.workMode !== "all") {
      jobs = jobs.filter((j) => j.workMode === args.workMode);
    }

    if (args.experienceLevel && args.experienceLevel !== "all") {
      jobs = jobs.filter((j) => j.experienceLevel === args.experienceLevel);
    }

    // Enrich
    const enriched = await Promise.all(
      jobs.map(async (job) => {
        const org = await ctx.db.get(job.organizationId);
        return {
          ...job,
          companyName: org?.name ?? "Unknown Company",
          companyLogo: org?.imageUrl,
        };
      })
    );

    return enriched;
  },
});

// Stats query for landing page
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const publishedJobs = await ctx.db
      .query("jobs")
      .withIndex("by_isPublished", (q) => q.eq("isPublished", true))
      .collect();

    const activeJobs = publishedJobs.filter(
      (j) => !j.isDeleted && (!j.expiresAt || j.expiresAt > Date.now())
    );

    const allUsers = await ctx.db.query("users").collect();
    const allOrgs = await ctx.db.query("organizations").collect();

    return {
      activeJobs: activeJobs.length,
      companies: allOrgs.length,
      jobSeekers: allUsers.filter((u) => u.role === "job_seeker").length,
    };
  },
});

// Resume upload URL generation
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await requireAuth(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});
