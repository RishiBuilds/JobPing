import { v } from "convex/values";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";

// Define the expected event types for Clerk webhooks
export const processClerkEvent = action({
  args: {
    adminSecret: v.string(),
    eventType: v.string(),
    eventData: v.any(),
  },
  handler: async (ctx, args) => {
    // Verify the admin secret 
    const expectedSecret = process.env.WEBHOOK_PROCESSING_SECRET;
    if (!expectedSecret || args.adminSecret !== expectedSecret) {
      throw new Error("Unauthorized: Invalid admin secret");
    }

    const { eventType, eventData } = args;

    // User events
    if (eventType === "user.created" || eventType === "user.updated") {
      const primaryEmail =
        eventData.email_addresses?.[0]?.email_address ?? "";

      await ctx.runMutation(internal.users.upsertUser, {
        clerkId: eventData.id,
        email: primaryEmail,
        firstName: eventData.first_name ?? undefined,
        lastName: eventData.last_name ?? undefined,
        imageUrl: eventData.image_url ?? undefined,
      });
    }

    if (eventType === "user.deleted") {
      if (eventData.id) {
        await ctx.runMutation(internal.users.deleteUser, {
          clerkId: eventData.id,
        });
      }
    }

    // Organization events 
    if (
      eventType === "organization.created" ||
      eventType === "organization.updated"
    ) {
      await ctx.runMutation(internal.organizations.upsertOrganization, {
        clerkOrgId: eventData.id,
        name: eventData.name,
        slug: eventData.slug ?? undefined,
        imageUrl: eventData.image_url ?? undefined,
      });
    }

    if (eventType === "organization.deleted") {
      if (eventData.id) {
        await ctx.runMutation(internal.organizations.deleteOrganization, {
          clerkOrgId: eventData.id,
        });
      }
    }

    // Membership events 
    if (
      eventType === "organizationMembership.created" ||
      eventType === "organizationMembership.updated"
    ) {
      await ctx.runMutation(internal.memberships.upsertMembership, {
        clerkOrgId: eventData.organization.id,
        clerkUserId: eventData.public_user_data.user_id,
        clerkRole: eventData.role,
      });
    }

    if (eventType === "organizationMembership.deleted") {
      await ctx.runMutation(internal.memberships.deleteMembership, {
        clerkOrgId: eventData.organization.id,
        clerkUserId: eventData.public_user_data.user_id,
      });
    }

    return { success: true };
  },
});
