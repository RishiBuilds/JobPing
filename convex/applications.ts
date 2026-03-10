import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import {
  requireAuth,
  getConvexUser,
  requireOrgMembership,
  sanitizeInput,
  sanitizeUrl,
} from "./helpers";

export const apply = mutation({
  args: {
    jobId: v.id("jobs"),
    resumeUrl: v.optional(v.string()),
    resumeStorageId: v.optional(v.id("_storage")),
    resumeFileName: v.optional(v.string()),
    coverLetter: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await requireAuth(ctx);
    const user = await getConvexUser(ctx, identity.subject);

    // Verify the job exists and is published
    const job = await ctx.db.get(args.jobId);
    if (!job || job.isDeleted)
      throw new Error("Job not found");
    if (!job.isPublished)
      throw new Error("This job is not accepting applications");
    if (job.expiresAt && job.expiresAt < Date.now())
      throw new Error("This job posting has expired");

    // Check if already applied using compound index
    const existing = await ctx.db
      .query("applications")
      .withIndex("by_jobId_applicantId", (q) =>
        q.eq("jobId", args.jobId).eq("applicantId", user._id)
      )
      .unique();

    if (existing) {
      throw new Error("You have already applied to this job");
    }

    // Sanitize inputs
    const sanitizedResumeUrl = args.resumeUrl
      ? sanitizeUrl(args.resumeUrl)
      : undefined;
    const sanitizedCoverLetter = args.coverLetter
      ? sanitizeInput(args.coverLetter)
      : undefined;

    // Server-side file type validation for uploaded resumes
    if (args.resumeStorageId) {
      const allowedMimeTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      // Read file metadata from Convex storage system table
      const fileUrl = await ctx.storage.getUrl(args.resumeStorageId);
      if (!fileUrl) {
        throw new Error("Uploaded file not found in storage");
      }

      // Check file name extension as a server-side validation layer
      const fileName = args.resumeFileName?.toLowerCase() ?? "";
      const allowedExtensions = [".pdf", ".doc", ".docx"];
      const hasValidExtension = allowedExtensions.some((ext) =>
        fileName.endsWith(ext)
      );
      if (fileName && !hasValidExtension) {
        await ctx.storage.delete(args.resumeStorageId);
        throw new Error(
          "Invalid file type. Only PDF and Word documents are allowed."
        );
      }
    }

    const applicationId = await ctx.db.insert("applications", {
      jobId: args.jobId,
      applicantId: user._id,
      resumeUrl: sanitizedResumeUrl,
      resumeStorageId: args.resumeStorageId,
      resumeFileName: args.resumeFileName
        ? sanitizeInput(args.resumeFileName)
        : undefined,
      coverLetter: sanitizedCoverLetter,
      status: "pending",
      isDeleted: false,
      updatedAt: Date.now(),
      appliedAt: Date.now(),
    });

    // Activity log
    await ctx.db.insert("activityLogs", {
      organizationId: job.organizationId,
      userId: user._id,
      action: "application_submitted",
      details: `New application for "${job.title}"`,
      timestamp: Date.now(),
    });

    // Notify all org members about new application
    const memberships = await ctx.db
      .query("memberships")
      .withIndex("by_organizationId", (q) =>
        q.eq("organizationId", job.organizationId)
      )
      .collect();

    const applicantName =
      `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || user.email;

    await Promise.all(
      memberships.map((m) =>
        ctx.db.insert("notifications", {
          userId: m.userId,
          type: "new_application",
          title: "New Application",
          message: `${applicantName} applied for "${job.title}"`,
          jobId: args.jobId,
          applicationId,
          isRead: false,
          createdAt: Date.now(),
        })
      )
    );

    return applicationId;
  },
});

export const getByJob = query({
  args: { jobId: v.id("jobs") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) throw new Error("User not found");

    const job = await ctx.db.get(args.jobId);
    if (!job) throw new Error("Job not found");
    await requireOrgMembership(ctx, user._id, job.organizationId);

    const applications = await ctx.db
      .query("applications")
      .withIndex("by_jobId", (q) => q.eq("jobId", args.jobId))
      .order("desc")
      .collect();

    // Filter out soft-deleted and enrich
    const enriched = await Promise.all(
      applications
        .filter((app) => !app.isDeleted)
        .map(async (app) => {
          const applicant = await ctx.db.get(app.applicantId);
          // Generate download URL for resume if stored in Convex
          let resumeDownloadUrl: string | null = null;
          if (app.resumeStorageId) {
            resumeDownloadUrl = await ctx.storage.getUrl(app.resumeStorageId);
          }
          return {
            ...app,
            applicantName: applicant
              ? `${applicant.firstName ?? ""} ${applicant.lastName ?? ""}`.trim()
              : "Unknown",
            applicantEmail: applicant?.email ?? "",
            applicantImage: applicant?.imageUrl,
            resumeDownloadUrl,
          };
        })
    );

    return enriched;
  },
});

export const getByApplicant = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) return [];

    const applications = await ctx.db
      .query("applications")
      .withIndex("by_applicantId", (q) => q.eq("applicantId", user._id))
      .order("desc")
      .collect();

    // Enrich with job data, filter soft-deleted
    const enriched = await Promise.all(
      applications
        .filter((app) => !app.isDeleted)
        .map(async (app) => {
          const job = await ctx.db.get(app.jobId);
          let companyName = "Unknown";
          if (job) {
            const org = await ctx.db.get(job.organizationId);
            companyName = org?.name ?? "Unknown";
          }
          return {
            ...app,
            jobTitle: job?.title ?? "Job Removed",
            jobLocation: job?.location ?? "",
            companyName,
          };
        })
    );

    return enriched;
  },
});

export const updateStatus = mutation({
  args: {
    applicationId: v.id("applications"),
    status: v.union(
      v.literal("pending"),
      v.literal("reviewed"),
      v.literal("shortlisted"),
      v.literal("rejected"),
      v.literal("hired")
    ),
  },
  handler: async (ctx, args) => {
    const identity = await requireAuth(ctx);
    const user = await getConvexUser(ctx, identity.subject);

    const application = await ctx.db.get(args.applicationId);
    if (!application || application.isDeleted)
      throw new Error("Application not found");

    const job = await ctx.db.get(application.jobId);
    if (!job) throw new Error("Job not found");
    await requireOrgMembership(ctx, user._id, job.organizationId);

    const oldStatus = application.status;
    await ctx.db.patch(args.applicationId, {
      status: args.status,
      updatedAt: Date.now(),
    });

    // Activity log
    await ctx.db.insert("activityLogs", {
      organizationId: job.organizationId,
      userId: user._id,
      action: "status_changed",
      details: `Application status changed from "${oldStatus}" to "${args.status}" for "${job.title}"`,
      timestamp: Date.now(),
    });

    // Notify the applicant about status change
    const statusLabels: Record<string, string> = {
      reviewed: "is being reviewed",
      shortlisted: "has been shortlisted! 🎉",
      rejected: "was not selected",
      hired: "is accepted — you're hired! 🎉",
      pending: "is back to pending",
    };

    await ctx.db.insert("notifications", {
      userId: application.applicantId,
      type: "status_change",
      title: "Application Update",
      message: `Your application for "${job.title}" ${statusLabels[args.status] ?? "has been updated"}`,
      jobId: application.jobId,
      applicationId: args.applicationId,
      isRead: false,
      createdAt: Date.now(),
    });
  },
});

export const getApplicationCount = query({
  args: { jobId: v.id("jobs") },
  handler: async (ctx, args) => {
    const apps = await ctx.db
      .query("applications")
      .withIndex("by_jobId", (q) => q.eq("jobId", args.jobId))
      .collect();
    return apps.filter((a) => !a.isDeleted).length;
  },
});

export const checkIfApplied = query({
  args: {
    jobId: v.id("jobs"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return false;

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) return false;

    const existing = await ctx.db
      .query("applications")
      .withIndex("by_jobId_applicantId", (q) =>
        q.eq("jobId", args.jobId).eq("applicantId", user._id)
      )
      .unique();

    return existing !== null && !existing.isDeleted;
  },
});
