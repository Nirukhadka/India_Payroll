import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { audit } from "./auditLog";
import { MARKETPLACE_SEED_APPS } from "./marketplaceAppsData";
import { requireMember, requireRole } from "./orgs";

// -----------------------------------------------------------------------------
// 1. SEED & CATALOG QUERIES
// -----------------------------------------------------------------------------

export const getCatalog = query({
  args: {
    workspaceId: v.id("workspaces"),
    category: v.optional(v.string()),
    search: v.optional(v.string()),
    sort: v.optional(
      v.union(v.literal("a_z"), v.literal("z_a"), v.literal("popular")),
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");
    await requireMember(ctx, userId, args.workspaceId);

    // Fetch database apps, or fallback to static seed catalog if not seeded
    let apps = await ctx.db.query("marketplaceApps").collect();
    if (apps.length === 0) {
      apps = MARKETPLACE_SEED_APPS.map((a, idx) => ({
        _id: `seed_app_${idx}` as unknown as import("./_generated/dataModel").Id<"marketplaceApps">,
        _creationTime: Date.now(),
        ...a,
        createdAt: Date.now(),
      }));
    }

    // Filter by Category
    if (args.category && args.category !== "All") {
      apps = apps.filter(
        (a) =>
          a.category.toLowerCase() === args.category?.toLowerCase() ||
          a.secondaryCategory?.toLowerCase() === args.category?.toLowerCase(),
      );
    }

    // Filter by Search Query
    if (args.search?.trim()) {
      const q = args.search.trim().toLowerCase();
      apps = apps.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.provider.toLowerCase().includes(q) ||
          a.tagline.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q) ||
          a.supportedFeatures.some((f) => f.toLowerCase().includes(q)),
      );
    }

    // Sort
    if (args.sort === "z_a") {
      apps.sort((a, b) => b.name.localeCompare(a.name));
    } else if (args.sort === "popular") {
      apps.sort((a, b) => b.ratingCount * b.rating - a.ratingCount * a.rating);
    } else {
      // Default: A - Z
      apps.sort((a, b) => a.name.localeCompare(b.name));
    }

    return apps;
  },
});

export const getAppDetails = query({
  args: {
    workspaceId: v.id("workspaces"),
    appId: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");
    await requireMember(ctx, userId, args.workspaceId);

    const app =
      (await ctx.db
        .query("marketplaceApps")
        .withIndex("by_app_id", (q) => q.eq("appId", args.appId))
        .first()) || MARKETPLACE_SEED_APPS.find((a) => a.appId === args.appId);

    if (!app)
      throw new ConvexError("Application not found in marketplace catalog");

    // Fetch workspace specific installation/request status
    const orgApp = await ctx.db
      .query("marketplaceOrgApps")
      .withIndex("by_workspace_app", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("appId", args.appId),
      )
      .first();

    // Check if user has marked it as interested
    const interested = await ctx.db
      .query("marketplaceInterestedApps")
      .withIndex("by_workspace_user", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId),
      )
      .filter((q) => q.eq(q.field("appId"), args.appId))
      .first();

    return {
      app,
      orgStatus: orgApp?.status ?? "available",
      orgApp,
      isInterested: Boolean(interested),
    };
  },
});

// -----------------------------------------------------------------------------
// 2. MY APPS & ORG STATUS MANAGEMENT
// -----------------------------------------------------------------------------

export const getMyApps = query({
  args: {
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");
    await requireMember(ctx, userId, args.workspaceId);

    const orgApps = await ctx.db
      .query("marketplaceOrgApps")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId))
      .collect();

    // Combine with catalog details
    const result = orgApps.map((orgApp) => {
      const appMeta = MARKETPLACE_SEED_APPS.find(
        (a) => a.appId === orgApp.appId,
      );
      return {
        ...orgApp,
        app: appMeta,
      };
    });

    return result;
  },
});

export const requestAppAccess = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    appId: v.string(),
    requestReason: v.string(),
    requestedModules: v.optional(v.array(v.string())),
    contactName: v.string(),
    contactEmail: v.string(),
    contactPhone: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");
    await requireMember(ctx, userId, args.workspaceId);

    const appMeta = MARKETPLACE_SEED_APPS.find((a) => a.appId === args.appId);
    if (!appMeta) throw new ConvexError("Unknown marketplace application");

    const existing = await ctx.db
      .query("marketplaceOrgApps")
      .withIndex("by_workspace_app", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("appId", args.appId),
      )
      .first();

    const now = Date.now();
    let orgAppId: import("./_generated/dataModel").Id<"marketplaceOrgApps">;

    if (existing) {
      if (existing.status === "active" || existing.status === "installed") {
        throw new ConvexError("Application is already active or installed");
      }
      await ctx.db.patch(existing._id, {
        status: "pending_approval",
        requestedBy: userId,
        requestReason: args.requestReason,
        requestedModules: args.requestedModules,
        contactName: args.contactName,
        contactEmail: args.contactEmail,
        contactPhone: args.contactPhone,
        requestedAt: now,
        updatedAt: now,
      });
      orgAppId = existing._id;
    } else {
      orgAppId = await ctx.db.insert("marketplaceOrgApps", {
        workspaceId: args.workspaceId,
        appId: args.appId,
        status: "pending_approval",
        requestedBy: userId,
        requestReason: args.requestReason,
        requestedModules: args.requestedModules,
        contactName: args.contactName,
        contactEmail: args.contactEmail,
        contactPhone: args.contactPhone,
        requestedAt: now,
        updatedAt: now,
      });
    }

    // Trigger In-App Notification
    await ctx.db.insert("marketplaceNotifications", {
      workspaceId: args.workspaceId,
      recipientUserId: undefined, // Broadcast to all admins
      appId: args.appId,
      appName: appMeta.name,
      title: `Access Request: ${appMeta.name}`,
      message: `${args.contactName} has requested integration access for ${appMeta.name}.`,
      type: "request_submitted",
      isRead: false,
      createdAt: now,
    });

    await audit(
      ctx,
      args.workspaceId,
      userId,
      "marketplace.request_access",
      {
        targetId: orgAppId,
        details: {
          appId: args.appId,
          appName: appMeta.name,
          reason: args.requestReason,
        },
      },
    );

    return { success: true, orgAppId };
  },
});

export const reviewAppRequest = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    appId: v.string(),
    action: v.union(v.literal("approve"), v.literal("reject")),
    reviewComments: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");
    await requireRole(ctx, userId, args.workspaceId, ["admin"]);

    const appMeta = MARKETPLACE_SEED_APPS.find((a) => a.appId === args.appId);
    if (!appMeta) throw new ConvexError("Unknown application");

    const existing = await ctx.db
      .query("marketplaceOrgApps")
      .withIndex("by_workspace_app", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("appId", args.appId),
      )
      .first();

    if (!existing)
      throw new ConvexError("No request record found for this application");

    const now = Date.now();
    const newStatus = args.action === "approve" ? "approved" : "rejected";

    await ctx.db.patch(existing._id, {
      status: newStatus,
      reviewedBy: userId,
      reviewComments: args.reviewComments,
      reviewedAt: now,
      updatedAt: now,
    });

    // Create Notification
    await ctx.db.insert("marketplaceNotifications", {
      workspaceId: args.workspaceId,
      recipientUserId: existing.requestedBy,
      appId: args.appId,
      appName: appMeta.name,
      title:
        args.action === "approve"
          ? `Request Approved: ${appMeta.name}`
          : `Request Declined: ${appMeta.name}`,
      message:
        args.action === "approve"
          ? `Your integration request for ${appMeta.name} has been approved. You can now proceed to configuration.`
          : `Your request for ${appMeta.name} was declined. Notes: ${args.reviewComments ?? "None"}`,
      type: args.action === "approve" ? "request_approved" : "request_rejected",
      isRead: false,
      createdAt: now,
    });

    await audit(
      ctx,
      args.workspaceId,
      userId,
      `marketplace.${newStatus}`,
      { targetId: existing._id, appId: args.appId, comments: args.reviewComments },
    );

    return { success: true, status: newStatus };
  },
});

export const configureAndActivateApp = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    appId: v.string(),
    configSettings: v.string(), // JSON string of safe config options
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");
    await requireRole(ctx, userId, args.workspaceId, ["admin"]);

    const appMeta = MARKETPLACE_SEED_APPS.find((a) => a.appId === args.appId);
    if (!appMeta) throw new ConvexError("Unknown application");

    const existing = await ctx.db
      .query("marketplaceOrgApps")
      .withIndex("by_workspace_app", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("appId", args.appId),
      )
      .first();

    const now = Date.now();

    if (existing) {
      await ctx.db.patch(existing._id, {
        status: "active",
        configSettings: args.configSettings,
        installedAt: now,
        updatedAt: now,
      });
    } else {
      await ctx.db.insert("marketplaceOrgApps", {
        workspaceId: args.workspaceId,
        appId: args.appId,
        status: "active",
        configSettings: args.configSettings,
        installedAt: now,
        updatedAt: now,
      });
    }

    await ctx.db.insert("marketplaceNotifications", {
      workspaceId: args.workspaceId,
      appId: args.appId,
      appName: appMeta.name,
      title: `App Activated: ${appMeta.name}`,
      message: `${appMeta.name} has been successfully configured and is now active for your organization.`,
      type: "installation_completed",
      isRead: false,
      createdAt: now,
    });

    return { success: true };
  },
});

// -----------------------------------------------------------------------------
// 3. INTERESTED APPS MANAGEMENT
// -----------------------------------------------------------------------------

export const getInterestedApps = query({
  args: {
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");
    await requireMember(ctx, userId, args.workspaceId);

    const userInterested = await ctx.db
      .query("marketplaceInterestedApps")
      .withIndex("by_workspace_user", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId),
      )
      .collect();

    // Map to app data
    let appIds = userInterested.map((i) => i.appId);

    // If empty, return default interested app (LueinHire) matching greytHR reference
    if (appIds.length === 0) {
      appIds = ["lueinhire"];
    }

    const apps = MARKETPLACE_SEED_APPS.filter((a) => appIds.includes(a.appId));
    return apps;
  },
});

export const toggleInterestedApp = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    appId: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");
    await requireMember(ctx, userId, args.workspaceId);

    const existing = await ctx.db
      .query("marketplaceInterestedApps")
      .withIndex("by_workspace_user", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId),
      )
      .filter((q) => q.eq(q.field("appId"), args.appId))
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
      return { isInterested: false };
    }
    await ctx.db.insert("marketplaceInterestedApps", {
      workspaceId: args.workspaceId,
      userId,
      appId: args.appId,
      addedAt: Date.now(),
    });
    return { isInterested: true };
  },
});

// -----------------------------------------------------------------------------
// 4. NOTIFICATIONS
// -----------------------------------------------------------------------------

export const getNotifications = query({
  args: {
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");
    await requireMember(ctx, userId, args.workspaceId);

    const notes = await ctx.db
      .query("marketplaceNotifications")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId))
      .order("desc")
      .take(50);

    return notes;
  },
});

export const markNotificationAsRead = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    notificationId: v.id("marketplaceNotifications"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");
    await requireMember(ctx, userId, args.workspaceId);

    await ctx.db.patch(args.notificationId, { isRead: true });
    return { success: true };
  },
});

export const markAllNotificationsAsRead = mutation({
  args: {
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");
    await requireMember(ctx, userId, args.workspaceId);

    const unread = await ctx.db
      .query("marketplaceNotifications")
      .withIndex("by_workspace_read", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("isRead", false),
      )
      .collect();

    for (const n of unread) {
      await ctx.db.patch(n._id, { isRead: true });
    }
    return { count: unread.length };
  },
});

// -----------------------------------------------------------------------------
// 5. BOOK A DEMO
// -----------------------------------------------------------------------------

export const submitDemoRequest = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    name: v.string(),
    organization: v.string(),
    workEmail: v.string(),
    contactNumber: v.string(),
    interestedAppId: v.string(),
    preferredDate: v.string(),
    additionalInfo: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");
    await requireMember(ctx, userId, args.workspaceId);

    const id = await ctx.db.insert("marketplaceDemoRequests", {
      workspaceId: args.workspaceId,
      userId,
      name: args.name,
      organization: args.organization,
      workEmail: args.workEmail,
      contactNumber: args.contactNumber,
      interestedAppId: args.interestedAppId,
      preferredDate: args.preferredDate,
      additionalInfo: args.additionalInfo,
      status: "received",
      createdAt: Date.now(),
    });

    await audit(
      ctx,
      args.workspaceId,
      userId,
      "marketplace.book_demo",
      {
        targetId: id,
        name: args.name,
        appId: args.interestedAppId,
        date: args.preferredDate,
      },
    );

    return { success: true, requestId: id };
  },
});

// -----------------------------------------------------------------------------
// 6. TAKE A TOUR PREFERENCE
// -----------------------------------------------------------------------------

export const getTourStatus = query({
  args: {
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return { hasCompletedTour: false };

    const pref = await ctx.db
      .query("marketplaceTourPreferences")
      .withIndex("by_workspace_user", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId),
      )
      .first();

    return { hasCompletedTour: pref?.hasCompletedTour ?? false };
  },
});

export const setTourCompleted = mutation({
  args: {
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");
    await requireMember(ctx, userId, args.workspaceId);

    const existing = await ctx.db
      .query("marketplaceTourPreferences")
      .withIndex("by_workspace_user", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId),
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        hasCompletedTour: true,
        completedAt: Date.now(),
      });
    } else {
      await ctx.db.insert("marketplaceTourPreferences", {
        workspaceId: args.workspaceId,
        userId,
        hasCompletedTour: true,
        completedAt: Date.now(),
      });
    }

    return { success: true };
  },
});
