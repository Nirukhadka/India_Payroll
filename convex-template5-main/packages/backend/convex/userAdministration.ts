import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import type { Doc, Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

// Default Roles Seed matching greytHR
export const DEFAULT_USER_ROLES = [
  {
    roleKey: "aspro_user",
    name: "Aspro User",
    description: "Standard processing and data operations access",
    isSystem: false,
    lastUpdatedOn: "05 Oct 2026 @ 20:25:34",
    permissions: {
      payroll: { view: true, write: false, approve: false },
      attendance: { view: true, write: false, approve: false },
      employees: { view: true, write: false, approve: false },
      leaves: { view: true, write: false, approve: false },
      claims: { view: true, write: false, approve: false },
      reports: { view: true, export: false },
      settings: { view: false, write: false },
    },
  },
  {
    roleKey: "attend_admin_view",
    name: "Attend admin(View)",
    description: "Read-only attendance and shift roster auditing",
    isSystem: false,
    lastUpdatedOn: "05 Oct 2026 @ 20:25:34",
    permissions: {
      payroll: { view: false, write: false, approve: false },
      attendance: { view: true, write: false, approve: false },
      employees: { view: true, write: false, approve: false },
      leaves: { view: true, write: false, approve: false },
      claims: { view: false, write: false, approve: false },
      reports: { view: true, export: true },
      settings: { view: false, write: false },
    },
  },
  {
    roleKey: "attend_admin_write",
    name: "Attend admin(Write)",
    description:
      "Full attendance modifications, overrides, and muster management",
    isSystem: false,
    lastUpdatedOn: "05 Oct 2026 @ 20:25:34",
    permissions: {
      payroll: { view: false, write: false, approve: false },
      attendance: { view: true, write: true, approve: true },
      employees: { view: true, write: false, approve: false },
      leaves: { view: true, write: true, approve: true },
      claims: { view: false, write: false, approve: false },
      reports: { view: true, export: true },
      settings: { view: false, write: false },
    },
  },
  {
    roleKey: "cadmin",
    name: "cadmin",
    description:
      "Company Super Administrator with unconditional platform access",
    isSystem: true,
    lastUpdatedOn: "30 Oct 2026 @ 10:58:58",
    permissions: {
      payroll: { view: true, write: true, approve: true },
      attendance: { view: true, write: true, approve: true },
      employees: { view: true, write: true, approve: true },
      leaves: { view: true, write: true, approve: true },
      claims: { view: true, write: true, approve: true },
      reports: { view: true, export: true },
      settings: { view: true, write: true },
    },
  },
  {
    roleKey: "claim_admin_view",
    name: "Claim admin (View)",
    description: "Audit reimbursement and expense claim submissions",
    isSystem: false,
    lastUpdatedOn: "05 Oct 2026 @ 20:25:34",
    permissions: {
      payroll: { view: false, write: false, approve: false },
      attendance: { view: false, write: false, approve: false },
      employees: { view: true, write: false, approve: false },
      leaves: { view: false, write: false, approve: false },
      claims: { view: true, write: false, approve: false },
      reports: { view: true, export: true },
      settings: { view: false, write: false },
    },
  },
  {
    roleKey: "claim_admin_write",
    name: "Claim admin (Write)",
    description: "Manage and settle employee expense claims",
    isSystem: false,
    lastUpdatedOn: "05 Oct 2026 @ 20:25:34",
    permissions: {
      payroll: { view: false, write: false, approve: false },
      attendance: { view: false, write: false, approve: false },
      employees: { view: true, write: false, approve: false },
      leaves: { view: false, write: false, approve: false },
      claims: { view: true, write: true, approve: true },
      reports: { view: true, export: true },
      settings: { view: false, write: false },
    },
  },
  {
    roleKey: "employee_view",
    name: "Employe (View)",
    description: "Directory and profile read-only privileges",
    isSystem: false,
    lastUpdatedOn: "05 Oct 2026 @ 20:25:34",
    permissions: {
      payroll: { view: false, write: false, approve: false },
      attendance: { view: false, write: false, approve: false },
      employees: { view: true, write: false, approve: false },
      leaves: { view: false, write: false, approve: false },
      claims: { view: false, write: false, approve: false },
      reports: { view: false, export: false },
      settings: { view: false, write: false },
    },
  },
  {
    roleKey: "employee_write",
    name: "Employe (Write)",
    description: "Manage onboarding, profile edits, and exit tracking",
    isSystem: false,
    lastUpdatedOn: "05 Oct 2026 @ 20:25:34",
    permissions: {
      payroll: { view: false, write: false, approve: false },
      attendance: { view: false, write: false, approve: false },
      employees: { view: true, write: true, approve: true },
      leaves: { view: false, write: false, approve: false },
      claims: { view: false, write: false, approve: false },
      reports: { view: true, export: true },
      settings: { view: false, write: false },
    },
  },
  {
    roleKey: "employee",
    name: "employee",
    description: "Default standard employee self-service role",
    isSystem: true,
    lastUpdatedOn: "30 Oct 2026 @ 10:51:51",
    permissions: {
      payroll: { view: false, write: false, approve: false },
      attendance: { view: false, write: false, approve: false },
      employees: { view: false, write: false, approve: false },
      leaves: { view: false, write: false, approve: false },
      claims: { view: false, write: false, approve: false },
      reports: { view: false, export: false },
      settings: { view: false, write: false },
    },
  },
  {
    roleKey: "leave_admin_view",
    name: "leave admin(View)",
    description: "Audit employee leave balances and history",
    isSystem: false,
    lastUpdatedOn: "19 Oct 2026 @ 11:05:54",
    permissions: {
      payroll: { view: false, write: false, approve: false },
      attendance: { view: true, write: false, approve: false },
      employees: { view: true, write: false, approve: false },
      leaves: { view: true, write: false, approve: false },
      claims: { view: false, write: false, approve: false },
      reports: { view: true, export: true },
      settings: { view: false, write: false },
    },
  },
  {
    roleKey: "lop_reversal_api",
    name: "LOP_AND_REVERSAL_API",
    description:
      "Automated API role for Loss-of-Pay calculations and adjustments",
    isSystem: true,
    lastUpdatedOn: "20 Oct 2026 @ 09:15:00",
    permissions: {
      payroll: { view: true, write: true, approve: false },
      attendance: { view: true, write: false, approve: false },
      employees: { view: true, write: false, approve: false },
      leaves: { view: true, write: false, approve: false },
      claims: { view: false, write: false, approve: false },
      reports: { view: false, export: false },
      settings: { view: false, write: false },
    },
  },
  {
    roleKey: "manager",
    name: "manager",
    description: "Team manager with approval capabilities over direct reports",
    isSystem: true,
    lastUpdatedOn: "25 Oct 2026 @ 14:20:10",
    permissions: {
      payroll: { view: false, write: false, approve: false },
      attendance: { view: true, write: false, approve: true },
      employees: { view: true, write: false, approve: false },
      leaves: { view: true, write: false, approve: true },
      claims: { view: true, write: false, approve: true },
      reports: { view: true, export: false },
      settings: { view: false, write: false },
    },
  },
  {
    roleKey: "payroll_admin_view",
    name: "Payroll admin(View)",
    description: "Payroll salary audit and statutory reconciliation view",
    isSystem: false,
    lastUpdatedOn: "05 Oct 2026 @ 20:25:34",
    permissions: {
      payroll: { view: true, write: false, approve: false },
      attendance: { view: true, write: false, approve: false },
      employees: { view: true, write: false, approve: false },
      leaves: { view: true, write: false, approve: false },
      claims: { view: true, write: false, approve: false },
      reports: { view: true, export: true },
      settings: { view: false, write: false },
    },
  },
  {
    roleKey: "payroll_admin_write",
    name: "Payroll admin(Write)",
    description:
      "Full salary processing, bonus distribution, and payout sign-off",
    isSystem: false,
    lastUpdatedOn: "05 Oct 2026 @ 20:25:34",
    permissions: {
      payroll: { view: true, write: true, approve: true },
      attendance: { view: true, write: true, approve: true },
      employees: { view: true, write: true, approve: true },
      leaves: { view: true, write: true, approve: true },
      claims: { view: true, write: true, approve: true },
      reports: { view: true, export: true },
      settings: { view: true, write: false },
    },
  },
];

async function getActiveWorkspace(
  ctx:
    | import("./_generated/server").QueryCtx
    | import("./_generated/server").MutationCtx,
): Promise<import("./_generated/dataModel").Doc<"workspaces"> | null> {
  const ws = await ctx.db.query("workspaces").first();
  if (ws) return ws;
  if ("insert" in ctx.db) {
    const wsId = await (ctx.db as any).insert("workspaces", {
      name: "Victor Chasex Pvt Ltd",
      slug: "victorchasex",
    });
    return (await ctx.db.get(wsId)) as import("./_generated/dataModel").Doc<"workspaces"> | null;
  }
  return null;
}

// -----------------------------------------------------------------------------
// 1. Roles Queries & Mutations
// -----------------------------------------------------------------------------

export const getRoles = query({
  args: {},
  handler: async (ctx) => {
    const ws = await getActiveWorkspace(ctx);
    if (!ws) return [];

    const roles = await ctx.db
      .query("userAdminRoles")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", ws._id))
      .collect();

    if (roles.length === 0) {
      return DEFAULT_USER_ROLES.map((r, i) => ({
        _id: `seed_role_${i}` as unknown as Id<"userAdminRoles">,
        workspaceId: ws._id,
        roleKey: r.roleKey,
        name: r.name,
        description: r.description,
        isSystem: r.isSystem,
        lastUpdatedOn: r.lastUpdatedOn,
        permissions: r.permissions,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }));
    }

    return roles;
  },
});

export const addRole = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    permissions: v.object({
      payroll: v.object({
        view: v.boolean(),
        write: v.boolean(),
        approve: v.boolean(),
      }),
      attendance: v.object({
        view: v.boolean(),
        write: v.boolean(),
        approve: v.boolean(),
      }),
      employees: v.object({
        view: v.boolean(),
        write: v.boolean(),
        approve: v.boolean(),
      }),
      leaves: v.object({
        view: v.boolean(),
        write: v.boolean(),
        approve: v.boolean(),
      }),
      claims: v.object({
        view: v.boolean(),
        write: v.boolean(),
        approve: v.boolean(),
      }),
      reports: v.object({ view: v.boolean(), export: v.boolean() }),
      settings: v.object({ view: v.boolean(), write: v.boolean() }),
    }),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const ws = await getActiveWorkspace(ctx);
    if (!ws) throw new Error("No active workspace");

    const cleanName = args.name.trim();
    if (!cleanName) throw new Error("Role name is required");

    const roleKey = cleanName.toLowerCase().replace(/[^a-z0-9]/g, "_");

    const existing = await ctx.db
      .query("userAdminRoles")
      .withIndex("by_workspace_roleKey", (q) =>
        q.eq("workspaceId", ws._id).eq("roleKey", roleKey),
      )
      .first();

    if (existing) {
      throw new Error(`A role with name "${cleanName}" already exists.`);
    }

    const now = Date.now();
    const dateFormatted = `${new Date(now).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })} @ ${new Date(now).toLocaleTimeString("en-GB")}`;

    const newId = await ctx.db.insert("userAdminRoles", {
      workspaceId: ws._id,
      roleKey,
      name: cleanName,
      description: args.description?.trim(),
      isSystem: false,
      lastUpdatedOn: dateFormatted,
      permissions: args.permissions,
      createdAt: now,
      updatedAt: now,
    });

    return { success: true, roleId: newId };
  },
});

export const editRole = mutation({
  args: {
    roleId: v.id("userAdminRoles"),
    name: v.string(),
    description: v.optional(v.string()),
    permissions: v.object({
      payroll: v.object({
        view: v.boolean(),
        write: v.boolean(),
        approve: v.boolean(),
      }),
      attendance: v.object({
        view: v.boolean(),
        write: v.boolean(),
        approve: v.boolean(),
      }),
      employees: v.object({
        view: v.boolean(),
        write: v.boolean(),
        approve: v.boolean(),
      }),
      leaves: v.object({
        view: v.boolean(),
        write: v.boolean(),
        approve: v.boolean(),
      }),
      claims: v.object({
        view: v.boolean(),
        write: v.boolean(),
        approve: v.boolean(),
      }),
      reports: v.object({ view: v.boolean(), export: v.boolean() }),
      settings: v.object({ view: v.boolean(), write: v.boolean() }),
    }),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const role = await ctx.db.get(args.roleId);
    if (!role) throw new Error("Role not found");

    const now = Date.now();
    const dateFormatted = `${new Date(now).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })} @ ${new Date(now).toLocaleTimeString("en-GB")}`;

    await ctx.db.patch(args.roleId, {
      name: args.name.trim(),
      description: args.description?.trim(),
      permissions: args.permissions,
      lastUpdatedOn: dateFormatted,
      updatedAt: now,
    });

    return { success: true };
  },
});

export const deleteRole = mutation({
  args: {
    roleId: v.id("userAdminRoles"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const role = await ctx.db.get(args.roleId);
    if (!role) throw new Error("Role not found");

    if (role.isSystem) {
      throw new Error(`Cannot delete protected system role "${role.name}".`);
    }

    await ctx.db.delete(args.roleId);
    return { success: true };
  },
});

// -----------------------------------------------------------------------------
// 2. Linked Employee Accounts Queries & Mutations
// -----------------------------------------------------------------------------

export const getLinkedEmployees = query({
  args: {
    employeeFilter: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const ws = await getActiveWorkspace(ctx);
    if (!ws) return [];

    let list = await ctx.db
      .query("linkedEmployeeAccounts")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", ws._id))
      .collect();

    if (args.employeeFilter && args.employeeFilter !== "All") {
      list = list.filter(
        (m) =>
          m.employeeNo === args.employeeFilter ||
          m.employeeName
            .toLowerCase()
            .includes(args.employeeFilter!.toLowerCase()),
      );
    }

    return list;
  },
});

export const addLinkedEmployee = mutation({
  args: {
    employeeId: v.id("employees"),
    userId: v.id("users"),
    fromDate: v.string(),
    toDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const authUserId = await getAuthUserId(ctx);
    if (!authUserId) throw new Error("Unauthorized");

    const ws = await getActiveWorkspace(ctx);
    if (!ws) throw new Error("No active workspace");

    const employee = await ctx.db.get(args.employeeId);
    if (!employee) throw new Error("Employee not found");

    const targetUser = await ctx.db.get(args.userId);
    if (!targetUser) throw new Error("User not found");

    // Check if already mapped actively
    const existing = await ctx.db
      .query("linkedEmployeeAccounts")
      .withIndex("by_workspace_employee", (q) =>
        q.eq("workspaceId", ws._id).eq("employeeId", args.employeeId),
      )
      .first();

    if (existing && existing.status === "active") {
      throw new Error(
        `Employee ${employee.firstName} ${employee.lastName} is already linked to user ${existing.userName}.`,
      );
    }

    const now = Date.now();
    const id = await ctx.db.insert("linkedEmployeeAccounts", {
      workspaceId: ws._id,
      employeeId: args.employeeId,
      employeeNo:
        (employee as unknown as { employeeNumber?: string }).employeeNumber ||
        "VC-EMP-001",
      employeeName: `${employee.firstName} ${employee.lastName}`.trim(),
      userId: args.userId,
      userName: targetUser.name || targetUser.username || "User",
      userEmail: targetUser.email || employee.email,
      fromDate: args.fromDate,
      toDate: args.toDate,
      status: "active",
      createdAt: now,
      updatedAt: now,
    });

    return { success: true, mappingId: id };
  },
});

export const removeLinkedEmployee = mutation({
  args: {
    mappingId: v.id("linkedEmployeeAccounts"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const mapping = await ctx.db.get(args.mappingId);
    if (!mapping) throw new Error("Mapping not found");

    await ctx.db.delete(args.mappingId);
    return { success: true };
  },
});

export const listUsersWithRoles = query({
  args: {
    search: v.optional(v.string()),
    roleFilter: v.optional(v.string()),
    statusFilter: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const ws = await getActiveWorkspace(ctx);
    if (!ws) return [];

    const users = await ctx.db.query("users").collect();
    const members = await ctx.db
      .query("members")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", ws._id))
      .collect();

    const memberMap = new Map<string, { role: string; status: string }>();
    for (const m of members) {
      memberMap.set(m.userId, {
        role: m.role,
        status: m.status || "active",
      });
    }

    const roles = await ctx.db
      .query("userAdminRoles")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", ws._id))
      .collect();

    const roleMap = new Map<string, string>();
    for (const r of roles) {
      roleMap.set(r.roleKey, r.name);
    }

    let userList = users.map((u) => {
      const explicitRole = (u as unknown as { role?: string }).role;
      const wsMember = memberMap.get(u._id);
      const userRole = wsMember?.role || explicitRole || "employee";
      const userStatus = wsMember?.status || (u as unknown as { status?: string }).status || "active";

      return {
        _id: u._id,
        name: u.name || u.username || "System User",
        email: u.email || "no-email@indiapay.com",
        role: userRole,
        roleName: roleMap.get(userRole) || userRole || "Employee",
        status: userStatus,
        createdAt: u._creationTime,
        lastLogin: "18 Nov 2026 @ 14:20:10",
      };
    });

    if (args.search) {
      const q = args.search.toLowerCase();
      userList = userList.filter(
        (u) =>
          u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
      );
    }

    if (args.roleFilter && args.roleFilter !== "All") {
      userList = userList.filter((u) => u.role === args.roleFilter);
    }

    if (args.statusFilter && args.statusFilter !== "All") {
      userList = userList.filter((u) => u.status === args.statusFilter);
    }

    return userList;
  },
});

export const updateUserRole = mutation({
  args: {
    targetUserId: v.id("users"),
    role: v.string(),
  },
  handler: async (ctx, args) => {
    const authUserId = await getAuthUserId(ctx);
    if (!authUserId) throw new Error("Unauthorized");

    const user = await ctx.db.get(args.targetUserId);
    if (!user) throw new Error("User not found");

    const ws = await getActiveWorkspace(ctx);
    if (ws) {
      const member = await ctx.db
        .query("members")
        .withIndex("by_user_workspace", (q) =>
          q.eq("userId", args.targetUserId).eq("workspaceId", ws._id),
        )
        .unique();

      if (member) {
        await ctx.db.patch(member._id, { role: args.role });
      } else {
        await ctx.db.insert("members", {
          workspaceId: ws._id,
          userId: args.targetUserId,
          role: args.role,
          createdAt: Date.now(),
        });
      }
    }

    return { success: true };
  },
});

export const toggleUserStatus = mutation({
  args: {
    targetUserId: v.id("users"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const authUserId = await getAuthUserId(ctx);
    if (!authUserId) throw new Error("Unauthorized");

    const user = await ctx.db.get(args.targetUserId);
    if (!user) throw new Error("User not found");

    const ws = await getActiveWorkspace(ctx);
    if (ws) {
      // Find the member record for this workspace
      const member = await ctx.db
        .query("members")
        .withIndex("by_user_workspace", (q) =>
          q.eq("userId", args.targetUserId).eq("workspaceId", ws._id),
        )
        .unique();

      const newStatus = args.status === "inactive" || args.status === "suspended" ? "suspended" : "active";

      if (member) {
        // Protect last active administrator: Cannot suspend the last admin in workspace
        const effectiveRole = member.role === "owner" ? "admin" : member.role;
        if (effectiveRole === "admin" && newStatus === "suspended") {
          const otherActiveAdmins = await ctx.db
            .query("members")
            .withIndex("by_workspace", (q) => q.eq("workspaceId", ws._id))
            .filter((q) =>
              q.and(
                q.neq(q.field("_id"), member._id),
                q.or(
                  q.eq(q.field("role"), "admin"),
                  q.eq(q.field("role"), "owner"),
                ),
                q.neq(q.field("status"), "suspended"),
              ),
            )
            .first();

          if (!otherActiveAdmins) {
            throw new Error("Cannot suspend the last active administrator in this workspace");
          }
        }

        await ctx.db.patch(member._id, { status: newStatus });
      } else {
        await ctx.db.insert("members", {
          workspaceId: ws._id,
          userId: args.targetUserId,
          role: "member",
          status: newStatus,
          createdAt: Date.now(),
        });
      }
    }

    // Keep top-level user doc backwards-compatible
    await ctx.db.patch(args.targetUserId, {
      status: args.status,
    } as Record<string, unknown>);

    return { success: true };
  },
});
