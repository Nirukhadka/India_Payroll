/// <reference types="vite/client" />
import { convexTest } from "convex-test";
import { describe, expect, test } from "vitest";
import { api } from "./_generated/api";
import schema from "./schema";
import { requireMember, requireRole } from "./orgs";

const modules: Record<string, () => Promise<any>> =
  typeof (import.meta as any).glob === "function"
    ? (import.meta as any).glob(["./**/*.*s", "!./**/*.test.*"])
    : {
        "./ResendOTP.ts": () => import("./ResendOTP"),
        "./apiKeys.ts": () => import("./apiKeys"),
        "./auditLog.ts": () => import("./auditLog"),
        "./audit.ts": () => import("./audit"),
        "./auth.config.ts": () => import("./auth.config"),
        "./auth.ts": () => import("./auth"),
        "./backend.ts": () => import("./backend"),
        "./counters.ts": () => import("./counters"),
        "./dashboard.ts": () => import("./dashboard"),
        "./devAccounts.ts": () => import("./devAccounts"),
        "./devAccountsMutation.ts": () => import("./devAccountsMutation"),
        "./devGuard.ts": () => import("./devGuard"),
        "./email.ts": () => import("./email"),
        "./env.ts": () => import("./env"),
        "./files.ts": () => import("./files"),
        "./http.ts": () => import("./http"),
        "./init.ts": () => import("./init"),
        "./jobs.ts": () => import("./jobs"),
        "./notifications.ts": () => import("./notifications"),
        "./orgs.ts": () => import("./orgs"),
        "./passwordProviders.ts": () => import("./passwordProviders"),
        "./schema.ts": () => import("./schema"),
        "./seed.ts": () => import("./seed"),
        "./sessions.ts": () => import("./sessions"),
        "./subscriptions.ts": () => import("./subscriptions"),
        "./usage.ts": () => import("./usage"),
        "./users.ts": () => import("./users"),
        "./web.ts": () => import("./web"),
        "./attendance.ts": () => import("./attendance"),
        "./compliance.ts": () => import("./compliance"),
        "./employees.ts": () => import("./employees"),
        "./leaves.ts": () => import("./leaves"),
        "./lop.ts": () => import("./lop"),
        "./payroll.ts": () => import("./payroll"),
        "./salaries.ts": () => import("./salaries"),
        "./_generated/api.js": () => import("./_generated/api.js"),
        "./_generated/server.js": () => import("./_generated/server.js"),
      };

describe("IndiaPay Multi-Workspace RBAC Security Suite", () => {
  test("Scenario 1: User is Admin in Workspace A, Member in Workspace B -> Cross-workspace privilege isolation", async () => {
    const t = convexTest(schema, modules);

    // Setup Owner and User
    const ownerId = await t.run(async (ctx) => {
      return await ctx.db.insert("users", { name: "Owner", email: "owner@test.com" });
    });
    const userId = await t.run(async (ctx) => {
      return await ctx.db.insert("users", { name: "MultiUser", email: "multi@test.com" });
    });

    // Create Workspace A & Workspace B
    const wsA = await t.run(async (ctx) => {
      return await ctx.db.insert("workspaces", { name: "Workspace A", ownerId, createdAt: Date.now() });
    });
    const wsB = await t.run(async (ctx) => {
      return await ctx.db.insert("workspaces", { name: "Workspace B", ownerId, createdAt: Date.now() });
    });

    // Membership: Admin in WS-A, Member in WS-B
    await t.run(async (ctx) => {
      await ctx.db.insert("members", {
        workspaceId: wsA,
        userId,
        role: "admin",
        status: "active",
        createdAt: Date.now(),
      });
      await ctx.db.insert("members", {
        workspaceId: wsB,
        userId,
        role: "member",
        status: "active",
        createdAt: Date.now(),
      });
    });

    // Verify Backend requireRole for WS-A (Admin permitted)
    await t.run(async (ctx) => {
      const mA = await requireRole(ctx, userId, wsA, ["admin"]);
      expect(mA.role).toBe("admin");
    });

    // Verify Backend requireRole for WS-B (Admin Forbidden)
    await t.run(async (ctx) => {
      await expect(requireRole(ctx, userId, wsB, ["admin"])).rejects.toThrow("Forbidden");
    });

    // Verify myWorkspaces returns accurate per-workspace roles and statuses
    const asUser = t.withIdentity({ subject: userId });
    const userWorkspaces = await asUser.query(api.orgs.myWorkspaces, {});
    expect(userWorkspaces.length).toBe(2);
    const itemA = userWorkspaces.find((w: any) => w._id === wsA);
    const itemB = userWorkspaces.find((w: any) => w._id === wsB);
    expect(itemA.role).toBe("admin");
    expect(itemA.status).toBe("active");
    expect(itemB.role).toBe("member");
    expect(itemB.status).toBe("active");
  });

  test("Scenario 2: User is Member in Workspace A, Owner in Workspace B -> Owner only authorized in WS-B", async () => {
    const t = convexTest(schema, modules);

    const userId = await t.run(async (ctx) => {
      return await ctx.db.insert("users", { name: "User2", email: "user2@test.com" });
    });
    const ownerA = await t.run(async (ctx) => {
      return await ctx.db.insert("users", { name: "OwnerA", email: "ownera@test.com" });
    });

    const wsA = await t.run(async (ctx) => {
      return await ctx.db.insert("workspaces", { name: "Workspace A", ownerId: ownerA, createdAt: Date.now() });
    });
    const wsB = await t.run(async (ctx) => {
      return await ctx.db.insert("workspaces", { name: "Workspace B", ownerId: userId, createdAt: Date.now() });
    });

    await t.run(async (ctx) => {
      await ctx.db.insert("members", {
        workspaceId: wsA,
        userId,
        role: "member",
        status: "active",
        createdAt: Date.now(),
      });
      await ctx.db.insert("members", {
        workspaceId: wsB,
        userId,
        role: "owner",
        status: "active",
        createdAt: Date.now(),
      });
    });

    // Member in WS-A cannot perform admin operations
    await t.run(async (ctx) => {
      await expect(requireRole(ctx, userId, wsA, ["admin"])).rejects.toThrow("Forbidden");
    });

    // Owner in WS-B can perform admin operations
    await t.run(async (ctx) => {
      const mB = await requireRole(ctx, userId, wsB, ["admin"]);
      expect(mB.role).toBe("owner");
    });
  });

  test("Scenario 3: Suspended Admin membership is rejected even if Admin in another workspace", async () => {
    const t = convexTest(schema, modules);

    const userId = await t.run(async (ctx) => {
      return await ctx.db.insert("users", { name: "SuspendedUser", email: "suspended@test.com" });
    });
    const ownerId = await t.run(async (ctx) => {
      return await ctx.db.insert("users", { name: "Owner", email: "owner@test.com" });
    });

    const wsA = await t.run(async (ctx) => {
      return await ctx.db.insert("workspaces", { name: "Workspace A", ownerId, createdAt: Date.now() });
    });
    const wsB = await t.run(async (ctx) => {
      return await ctx.db.insert("workspaces", { name: "Workspace B", ownerId, createdAt: Date.now() });
    });

    await t.run(async (ctx) => {
      // Suspended in WS-A
      await ctx.db.insert("members", {
        workspaceId: wsA,
        userId,
        role: "admin",
        status: "suspended",
        createdAt: Date.now(),
      });
      // Active in WS-B
      await ctx.db.insert("members", {
        workspaceId: wsB,
        userId,
        role: "admin",
        status: "active",
        createdAt: Date.now(),
      });
    });

    // Suspended in WS-A -> Rejection
    await t.run(async (ctx) => {
      await expect(requireRole(ctx, userId, wsA, ["admin"])).rejects.toThrow("Forbidden: Member is suspended in this workspace");
      await expect(requireMember(ctx, userId, wsA)).rejects.toThrow("Forbidden: Member is suspended in this workspace");
    });

    // Active in WS-B -> Allowed
    await t.run(async (ctx) => {
      const mB = await requireRole(ctx, userId, wsB, ["admin"]);
      expect(mB.role).toBe("admin");
    });
  });

  test("Scenario 4: User has no active workspace -> safe empty result", async () => {
    const t = convexTest(schema, modules);

    const userId = await t.run(async (ctx) => {
      return await ctx.db.insert("users", { name: "OrphanUser", email: "orphan@test.com" });
    });

    const asUser = t.withIdentity({ subject: userId });
    const userWorkspaces = await asUser.query(api.orgs.myWorkspaces, {});
    expect(userWorkspaces).toEqual([]);
  });

  test("Scenario 5: Admin in active workspace has full admin privileges", async () => {
    const t = convexTest(schema, modules);

    const userId = await t.run(async (ctx) => {
      return await ctx.db.insert("users", { name: "AdminUser", email: "adminuser@test.com" });
    });
    const ws = await t.run(async (ctx) => {
      return await ctx.db.insert("workspaces", { name: "Active WS", ownerId: userId, createdAt: Date.now() });
    });
    await t.run(async (ctx) => {
      await ctx.db.insert("members", {
        workspaceId: ws,
        userId,
        role: "admin",
        status: "active",
        createdAt: Date.now(),
      });
    });

    await t.run(async (ctx) => {
      const m = await requireRole(ctx, userId, ws, ["admin"]);
      expect(m.role).toBe("admin");
    });
  });

  test("Scenario 6: Owner in active workspace has full admin privileges", async () => {
    const t = convexTest(schema, modules);

    const userId = await t.run(async (ctx) => {
      return await ctx.db.insert("users", { name: "OwnerUser", email: "owneruser@test.com" });
    });
    const ws = await t.run(async (ctx) => {
      return await ctx.db.insert("workspaces", { name: "Owner WS", ownerId: userId, createdAt: Date.now() });
    });
    await t.run(async (ctx) => {
      await ctx.db.insert("members", {
        workspaceId: ws,
        userId,
        role: "owner",
        status: "active",
        createdAt: Date.now(),
      });
    });

    await t.run(async (ctx) => {
      const m = await requireRole(ctx, userId, ws, ["admin"]);
      expect(m.role).toBe("owner");
    });
  });

  test("Scenario 7: Unauthorized workspace cookie (arbitrary or foreign workspace ID) fails safely", async () => {
    const t = convexTest(schema, modules);

    const user1 = await t.run(async (ctx) => ctx.db.insert("users", { name: "U1", email: "u1@test.com" }));
    const user2 = await t.run(async (ctx) => ctx.db.insert("users", { name: "U2", email: "u2@test.com" }));

    const ws1 = await t.run(async (ctx) => ctx.db.insert("workspaces", { name: "WS1", ownerId: user1, createdAt: Date.now() }));
    const ws2 = await t.run(async (ctx) => ctx.db.insert("workspaces", { name: "WS2", ownerId: user2, createdAt: Date.now() }));

    await t.run(async (ctx) => {
      await ctx.db.insert("members", { workspaceId: ws1, userId: user1, role: "admin", createdAt: Date.now() });
      await ctx.db.insert("members", { workspaceId: ws2, userId: user2, role: "admin", createdAt: Date.now() });
    });

    // User1 attempting to query or require role on WS2 throws Forbidden
    await t.run(async (ctx) => {
      await expect(requireRole(ctx, user1, ws2, ["admin"])).rejects.toThrow("Forbidden");
      await expect(requireMember(ctx, user1, ws2)).rejects.toThrow("Forbidden");
    });

    // Verify myWorkspaces for User1 only contains WS1 and NEVER WS2
    const asUser1 = t.withIdentity({ subject: user1 });
    const user1Workspaces = await asUser1.query(api.orgs.myWorkspaces, {});
    expect(user1Workspaces.map((w: any) => w._id)).toEqual([ws1]);
    expect(user1Workspaces.map((w: any) => w._id)).not.toContain(ws2);
  });

  test("Scenario 8: Workspace switching updates backend query scope correctly", async () => {
    const t = convexTest(schema, modules);

    const userId = await t.run(async (ctx) => ctx.db.insert("users", { name: "Switcher", email: "switch@test.com" }));

    const wsA = await t.run(async (ctx) => ctx.db.insert("workspaces", { name: "Company Alpha", ownerId: userId, createdAt: Date.now() }));
    const wsB = await t.run(async (ctx) => ctx.db.insert("workspaces", { name: "Company Beta", ownerId: userId, createdAt: Date.now() }));

    await t.run(async (ctx) => {
      await ctx.db.insert("members", { workspaceId: wsA, userId, role: "admin", status: "active", createdAt: Date.now() });
      await ctx.db.insert("members", { workspaceId: wsB, userId, role: "member", status: "active", createdAt: Date.now() });

      // Add employee in wsA
      await ctx.db.insert("employees", {
        workspaceId: wsA,
        firstName: "Alpha",
        lastName: "Worker",
        email: "alpha@corp.com",
        status: "active",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      // Add employee in wsB
      await ctx.db.insert("employees", {
        workspaceId: wsB,
        firstName: "Beta",
        lastName: "Worker",
        email: "beta@corp.com",
        status: "active",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    });

    const asUser = t.withIdentity({ subject: userId });

    // In WS-A, user is admin -> Can list employees
    const empsA = await asUser.query(api.employees.list, { workspaceId: wsA });
    expect(empsA.length).toBe(1);
    expect(empsA[0].firstName).toBe("Alpha");

    // In WS-B, user is member -> Cannot query adminOperations
    await expect(asUser.query(api.dashboard.adminOperations, { workspaceId: wsB })).rejects.toThrow("Forbidden");
  });

  test("Scenario 9 & 10: Cross-workspace employee and payroll data access is prevented (IDOR blocked)", async () => {
    const t = convexTest(schema, modules);

    const user1 = await t.run(async (ctx) => ctx.db.insert("users", { name: "U1", email: "u1@test.com" }));
    const user2 = await t.run(async (ctx) => ctx.db.insert("users", { name: "U2", email: "u2@test.com" }));

    const ws1 = await t.run(async (ctx) => ctx.db.insert("workspaces", { name: "Company Alpha", ownerId: user1, createdAt: Date.now() }));
    const ws2 = await t.run(async (ctx) => ctx.db.insert("workspaces", { name: "Company Beta", ownerId: user2, createdAt: Date.now() }));

    await t.run(async (ctx) => {
      await ctx.db.insert("members", { workspaceId: ws1, userId: user1, role: "admin", createdAt: Date.now() });
      await ctx.db.insert("members", { workspaceId: ws2, userId: user2, role: "admin", createdAt: Date.now() });

      // Insert employees in Company Beta
      await ctx.db.insert("employees", {
        workspaceId: ws2,
        firstName: "Secret",
        lastName: "Employee",
        email: "secret@beta.com",
        status: "active",
        bankAccountNumber: "998877665544",
        pan: "ABCDE1234F",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      // Insert payroll run in Company Beta
      await ctx.db.insert("payrollRuns", {
        workspaceId: ws2,
        periodMonth: "2026-11",
        startDate: "2026-11-01",
        endDate: "2026-11-30",
        status: "processed",
        totalEmployees: 1,
        totalGrossSalary: 5000000,
        totalNetSalary: 4500000,
        totalStatutoryDeductions: 500000,
        totalCustomDeductions: 0,
        totalLopDeduction: 0,
        createdById: user2,
        finalizedAt: Date.now(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    });

    const asUser1 = t.withIdentity({ subject: user1 });

    // User 1 cannot list employees of Company Beta (throws Forbidden)
    await expect(asUser1.query(api.employees.list, { workspaceId: ws2 })).rejects.toThrow("Forbidden");

    // User 1 cannot access admin dashboard operations of Company Beta (throws Forbidden)
    await expect(asUser1.query(api.dashboard.adminOperations, { workspaceId: ws2 })).rejects.toThrow("Forbidden");

    // User 1 cannot access payroll runs of Company Beta (throws Forbidden)
    await expect(asUser1.query(api.payroll.listRuns, { workspaceId: ws2 })).rejects.toThrow("Forbidden");
  });
});
