/**
 * Dev-only internal mutation for account provisioning (DEV_SEED=1 required).
 *
 * This module is intentionally separate from devAccounts.ts so that:
 *   - The mutation runs in the Convex V8 runtime (no "use node" needed here).
 *   - The action in devAccounts.ts runs the heavy Scrypt hashing in Node.js.
 *
 * DO NOT import this in any non-dev code path.
 */

import { ConvexError, v } from "convex/values";
import { internalMutation } from "./_generated/server";
import { requireDevSeed } from "./devGuard";
import type { Id } from "./_generated/dataModel";

// ── Dev account specs ──────────────────────────────────────────────────────
const DEV_OWNER_EMAIL = "owner@indiapaypayroll.com";
const DEV_ADMIN_EMAIL = "admin@indiapaypayroll.com";
const DEV_USER_EMAIL = "user@indiapaypayroll.com";
const DEV_WORKSPACE_NAME = "IndiaPay Dev Workspace";
const PROVIDER = "password";

/**
 * Idempotent mutation. Accepts pre-hashed password hashes from the Node
 * action (devAccounts.ts) or CLI script to avoid Scrypt in V8 runtime.
 */
export const provisionDevAccountsMutation = internalMutation({
  args: {
    ownerHash: v.optional(v.string()),
    adminHash: v.optional(v.string()),
    userHash: v.optional(v.string()),
  },
  handler: async (
    ctx,
    { ownerHash, adminHash, userHash },
  ): Promise<{
    ownerCreated: boolean;
    adminCreated: boolean;
    userCreated: boolean;
    workspaceId: string;
    message: string;
  }> => {
    requireDevSeed();

    const now = Date.now();

    // ── 1. Upsert owner user + authAccount ─────────────────────────────
    let ownerUserId: Id<"users">;
    let ownerCreated = false;
    const existingOwner = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", DEV_OWNER_EMAIL))
      .unique();

    if (existingOwner) {
      ownerUserId = existingOwner._id;
      const patchObj: { emailVerificationTime?: number; username?: string } = {};
      if (!existingOwner.emailVerificationTime) {
        patchObj.emailVerificationTime = now;
      }
      if (!existingOwner.username) {
        patchObj.username = "owner";
      }
      if (Object.keys(patchObj).length > 0) {
        await ctx.db.patch(ownerUserId, patchObj);
      }
    } else {
      ownerUserId = await ctx.db.insert("users", {
        email: DEV_OWNER_EMAIL,
        name: "Dev Workspace Owner",
        username: "owner",
        emailVerificationTime: now,
      });
      ownerCreated = true;
    }

    if (ownerHash) {
      const existingOwnerAccount = await ctx.db
        .query("authAccounts")
        .withIndex("providerAndAccountId", (q) =>
          q.eq("provider", PROVIDER).eq("providerAccountId", DEV_OWNER_EMAIL),
        )
        .unique();
      if (!existingOwnerAccount) {
        await ctx.db.insert("authAccounts", {
          userId: ownerUserId,
          provider: PROVIDER,
          providerAccountId: DEV_OWNER_EMAIL,
          secret: ownerHash,
          emailVerified: DEV_OWNER_EMAIL,
        });
      } else {
        await ctx.db.patch(existingOwnerAccount._id, {
          userId: ownerUserId,
          secret: ownerHash,
          emailVerified: DEV_OWNER_EMAIL,
        });
      }
    }

    // ── 2. Upsert admin user + authAccount ──────────────────────────────
    let adminUserId: Id<"users">;
    let adminCreated = false;
    const existingAdmin = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", DEV_ADMIN_EMAIL))
      .unique();

    if (existingAdmin) {
      adminUserId = existingAdmin._id;
      const patchObj: { emailVerificationTime?: number; username?: string } = {};
      if (!existingAdmin.emailVerificationTime) {
        patchObj.emailVerificationTime = now;
      }
      if (!existingAdmin.username) {
        patchObj.username = "admin";
      }
      if (Object.keys(patchObj).length > 0) {
        await ctx.db.patch(adminUserId, patchObj);
      }
    } else {
      adminUserId = await ctx.db.insert("users", {
        email: DEV_ADMIN_EMAIL,
        name: "Dev Admin",
        username: "admin",
        emailVerificationTime: now,
      });
      adminCreated = true;
    }

    if (adminHash) {
      const existingAdminAccount = await ctx.db
        .query("authAccounts")
        .withIndex("providerAndAccountId", (q) =>
          q.eq("provider", PROVIDER).eq("providerAccountId", DEV_ADMIN_EMAIL),
        )
        .unique();
      if (!existingAdminAccount) {
        await ctx.db.insert("authAccounts", {
          userId: adminUserId,
          provider: PROVIDER,
          providerAccountId: DEV_ADMIN_EMAIL,
          secret: adminHash,
          emailVerified: DEV_ADMIN_EMAIL,
        });
      } else {
        await ctx.db.patch(existingAdminAccount._id, {
          userId: adminUserId,
          secret: adminHash,
          emailVerified: DEV_ADMIN_EMAIL,
        });
      }
    }

    // ── 3. Upsert normal user + authAccount ─────────────────────────────
    let userUserId: Id<"users">;
    let userCreated = false;
    const existingUser = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", DEV_USER_EMAIL))
      .unique();

    if (existingUser) {
      userUserId = existingUser._id;
      const patchObj: { emailVerificationTime?: number; username?: string } = {};
      if (!existingUser.emailVerificationTime) {
        patchObj.emailVerificationTime = now;
      }
      if (!existingUser.username) {
        patchObj.username = "user";
      }
      if (Object.keys(patchObj).length > 0) {
        await ctx.db.patch(userUserId, patchObj);
      }
    } else {
      userUserId = await ctx.db.insert("users", {
        email: DEV_USER_EMAIL,
        name: "Dev User",
        username: "user",
        emailVerificationTime: now,
      });
      userCreated = true;
    }

    if (userHash) {
      const existingUserAccount = await ctx.db
        .query("authAccounts")
        .withIndex("providerAndAccountId", (q) =>
          q.eq("provider", PROVIDER).eq("providerAccountId", DEV_USER_EMAIL),
        )
        .unique();
      if (!existingUserAccount) {
        await ctx.db.insert("authAccounts", {
          userId: userUserId,
          provider: PROVIDER,
          providerAccountId: DEV_USER_EMAIL,
          secret: userHash,
          emailVerified: DEV_USER_EMAIL,
        });
      } else {
        await ctx.db.patch(existingUserAccount._id, {
          userId: userUserId,
          secret: userHash,
          emailVerified: DEV_USER_EMAIL,
        });
      }
    }

    // ── 4. Locate or create dev workspace ───────────────────────────────
    let workspaceId: Id<"workspaces">;

    // Check existing admin membership first so Owner is bound to the active dev workspace
    const existingAdminMembership = await ctx.db
      .query("members")
      .withIndex("by_user", (q) => q.eq("userId", adminUserId))
      .first();

    if (existingAdminMembership) {
      workspaceId = existingAdminMembership.workspaceId;
    } else {
      const existingWsByName = await ctx.db
        .query("workspaces")
        .filter((q) => q.eq(q.field("name"), DEV_WORKSPACE_NAME))
        .first();

      if (existingWsByName) {
        workspaceId = existingWsByName._id;
      } else {
        workspaceId = await ctx.db.insert("workspaces", {
          name: DEV_WORKSPACE_NAME,
          ownerId: ownerUserId,
          createdAt: now,
        });
      }
    }

    // Formerly Owner, now Admin: role="admin"
    const ownerMembership = await ctx.db
      .query("members")
      .withIndex("by_user_workspace", (q) =>
        q.eq("userId", ownerUserId).eq("workspaceId", workspaceId),
      )
      .unique();
    if (!ownerMembership) {
      await ctx.db.insert("members", {
        workspaceId,
        userId: ownerUserId,
        role: "admin",
        createdAt: now,
      });
    } else if (ownerMembership.role === "owner") {
      await ctx.db.patch(ownerMembership._id, { role: "admin" });
    }

    // Admin: role="admin" (do not promote to owner)
    const adminMembership = await ctx.db
      .query("members")
      .withIndex("by_user_workspace", (q) =>
        q.eq("userId", adminUserId).eq("workspaceId", workspaceId),
      )
      .unique();
    if (!adminMembership) {
      await ctx.db.insert("members", {
        workspaceId,
        userId: adminUserId,
        role: "admin",
        createdAt: now,
      });
    } else if (adminMembership.role !== "admin") {
      await ctx.db.patch(adminMembership._id, { role: "admin" });
    }

    // Member: role="member"
    // Also remove any rogue admin/owner memberships in other workspaces for DEV_USER_EMAIL
    const allUserMemberships = await ctx.db
      .query("members")
      .withIndex("by_user", (q) => q.eq("userId", userUserId))
      .collect();
    for (const m of allUserMemberships) {
      if (m.workspaceId !== workspaceId) {
        await ctx.db.delete(m._id);
      }
    }

    const userMembership = await ctx.db
      .query("members")
      .withIndex("by_user_workspace", (q) =>
        q.eq("userId", userUserId).eq("workspaceId", workspaceId),
      )
      .unique();
    if (!userMembership) {
      await ctx.db.insert("members", {
        workspaceId,
        userId: userUserId,
        role: "member",
        createdAt: now,
      });
    } else if (userMembership.role !== "member") {
      await ctx.db.patch(userMembership._id, { role: "member" });
    }

    // ── 6. Upsert employee records for dev accounts ─────────────────────
    const existingOwnerEmp = await ctx.db
      .query("employees")
      .withIndex("by_email", (q) => q.eq("email", DEV_OWNER_EMAIL))
      .filter((q) => q.eq(q.field("workspaceId"), workspaceId))
      .first();

    if (!existingOwnerEmp) {
      await ctx.db.insert("employees", {
        workspaceId,
        firstName: "Dev",
        lastName: "Owner",
        email: DEV_OWNER_EMAIL,
        department: "Executive",
        designation: "Managing Director / Owner",
        status: "active",
        userId: ownerUserId,
        createdAt: now,
        updatedAt: now,
      });
    } else if (!existingOwnerEmp.userId) {
      await ctx.db.patch(existingOwnerEmp._id, { userId: ownerUserId });
    }

    const existingAdminEmp = await ctx.db
      .query("employees")
      .withIndex("by_email", (q) => q.eq("email", DEV_ADMIN_EMAIL))
      .filter((q) => q.eq(q.field("workspaceId"), workspaceId))
      .first();

    if (!existingAdminEmp) {
      await ctx.db.insert("employees", {
        workspaceId,
        firstName: "Dev",
        lastName: "Admin",
        email: DEV_ADMIN_EMAIL,
        department: "Human Resources",
        designation: "HR Admin",
        status: "active",
        userId: adminUserId,
        createdAt: now,
        updatedAt: now,
      });
    } else if (!existingAdminEmp.userId) {
      await ctx.db.patch(existingAdminEmp._id, { userId: adminUserId });
    }

    const existingUserEmp = await ctx.db
      .query("employees")
      .withIndex("by_email", (q) => q.eq("email", DEV_USER_EMAIL))
      .filter((q) => q.eq(q.field("workspaceId"), workspaceId))
      .first();

    if (!existingUserEmp) {
      await ctx.db.insert("employees", {
        workspaceId,
        firstName: "Dev",
        lastName: "User",
        email: DEV_USER_EMAIL,
        department: "Engineering",
        designation: "Software Engineer",
        status: "active",
        userId: userUserId,
        createdAt: now,
        updatedAt: now,
      });
    } else if (!existingUserEmp.userId) {
      await ctx.db.patch(existingUserEmp._id, { userId: userUserId });
    }

    return {
      ownerCreated,
      adminCreated,
      userCreated,
      workspaceId,
      message:
        `Dev accounts ready. Owner (${DEV_OWNER_EMAIL}) role=owner, ` +
        `Admin (${DEV_ADMIN_EMAIL}) role=admin, User (${DEV_USER_EMAIL}) role=member. ` +
        `Workspace: ${DEV_WORKSPACE_NAME}.`,
    };
  },
});
