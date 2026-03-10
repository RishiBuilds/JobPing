import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    role: v.union(v.literal("job_seeker"), v.literal("employer")),
    createdAt: v.number(),
  })
    .index("by_clerkId", ["clerkId"])
    .index("by_email", ["email"]),

  organizations: defineTable({
    clerkOrgId: v.string(),
    name: v.string(),
    slug: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    plan: v.union(
      v.literal("free"),
      v.literal("pro"),
      v.literal("enterprise")
    ),
    createdAt: v.number(),
  })
    .index("by_clerkOrgId", ["clerkOrgId"])
    .index("by_slug", ["slug"]),

  jobs: defineTable({
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
    isPublished: v.boolean(),
    isDeleted: v.optional(v.boolean()),
    postedBy: v.id("users"),
    expiresAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_organizationId", ["organizationId"])
    .index("by_isPublished", ["isPublished"])
    .index("by_organizationId_isPublished", ["organizationId", "isPublished"]),

  applications: defineTable({
    jobId: v.id("jobs"),
    applicantId: v.id("users"),
    resumeUrl: v.optional(v.string()),
    resumeStorageId: v.optional(v.id("_storage")),
    resumeFileName: v.optional(v.string()),
    coverLetter: v.optional(v.string()),
    status: v.union(
      v.literal("pending"),
      v.literal("reviewed"),
      v.literal("shortlisted"),
      v.literal("rejected"),
      v.literal("hired")
    ),
    isDeleted: v.optional(v.boolean()),
    updatedAt: v.optional(v.number()),
    appliedAt: v.number(),
  })
    .index("by_jobId", ["jobId"])
    .index("by_applicantId", ["applicantId"])
    .index("by_jobId_status", ["jobId", "status"])
    .index("by_jobId_applicantId", ["jobId", "applicantId"]),

  memberships: defineTable({
    organizationId: v.id("organizations"),
    userId: v.id("users"),
    clerkRole: v.string(),
    joinedAt: v.number(),
  })
    .index("by_organizationId", ["organizationId"])
    .index("by_userId", ["userId"])
    .index("by_userId_organizationId", ["userId", "organizationId"]),

  notifications: defineTable({
    userId: v.id("users"),
    type: v.union(
      v.literal("new_application"),
      v.literal("status_change"),
      v.literal("job_expired")
    ),
    title: v.string(),
    message: v.string(),
    jobId: v.optional(v.id("jobs")),
    applicationId: v.optional(v.id("applications")),
    isRead: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_isRead", ["userId", "isRead"]),

  activityLogs: defineTable({
    organizationId: v.optional(v.id("organizations")),
    userId: v.optional(v.id("users")),
    action: v.string(),
    details: v.optional(v.string()),
    timestamp: v.number(),
  })
    .index("by_organizationId", ["organizationId"])
    .index("by_userId", ["userId"]),
});
