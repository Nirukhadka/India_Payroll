import { convexTest } from "convex-test";
import { describe, expect, test } from "vitest";
import { api } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import type { MutationCtx } from "./_generated/server";
import schema from "./schema";

const modules: Record<string, () => Promise<any>> =
  typeof (import.meta as any).glob === "function"
    ? (import.meta as any).glob(["./**/*.*s", "!./**/*.test.*"])
    : {
        "./reports.ts": () => import("./reports"),
        "./orgs.ts": () => import("./orgs"),
        "./schema.ts": () => import("./schema"),
      };

const as = (userId: Id<"users">) => ({
  subject: userId,
  issuer: "https://auth.indiapaypayroll.com",
});

async function seedTestWorkspaceWithUsers(t: any) {
  const now = Date.now();
  return t.run(async (ctx: MutationCtx) => {
    const adminUser = await ctx.db.insert("users", {
      name: "Admin User",
      email: "admin@indiapaypayroll.com",
      emailVerificationTime: now,
    });
    const memberUser = await ctx.db.insert("users", {
      name: "Member User",
      email: "member@indiapaypayroll.com",
      emailVerificationTime: now,
    });
    const externalUser = await ctx.db.insert("users", {
      name: "External User",
      email: "external@otherpayroll.com",
      emailVerificationTime: now,
    });

    const ws1 = await ctx.db.insert("workspaces", {
      name: "Primary Test Workspace",
      ownerId: adminUser,
      createdAt: now,
    });
    await ctx.db.insert("members", {
      workspaceId: ws1,
      userId: adminUser,
      role: "admin",
      createdAt: now,
    });
    await ctx.db.insert("members", {
      workspaceId: ws1,
      userId: memberUser,
      role: "member",
      createdAt: now,
    });

    const ws2 = await ctx.db.insert("workspaces", {
      name: "Secondary Isolated Workspace",
      ownerId: externalUser,
      createdAt: now,
    });
    await ctx.db.insert("members", {
      workspaceId: ws2,
      userId: externalUser,
      role: "admin",
      createdAt: now,
    });

    return { ws1, ws2, adminUser, memberUser, externalUser };
  });
}

describe("Reports Sprint 1 — Favorites & Workspace Isolation", () => {
  test("1. User can add and remove favorite reports (toggleFavorite)", async () => {
    const t = convexTest(schema, modules);
    const { ws1, adminUser } = await seedTestWorkspaceWithUsers(t);
    const asAdmin = t.withIdentity(as(adminUser));

    // Initially empty favorites
    const initialFavs = await asAdmin.query(api.reports.listUserFavorites, {
      workspaceId: ws1,
    });
    expect(initialFavs).toEqual([]);

    // Add favorite
    const res1 = await asAdmin.mutation(api.reports.toggleFavorite, {
      workspaceId: ws1,
      reportId: "rep_salary_statement",
    });
    expect(res1.isFavorite).toBe(true);

    const afterAdd = await asAdmin.query(api.reports.listUserFavorites, {
      workspaceId: ws1,
    });
    expect(afterAdd).toContain("rep_salary_statement");

    // Add another favorite
    await asAdmin.mutation(api.reports.toggleFavorite, {
      workspaceId: ws1,
      reportId: "rep_form16",
    });
    const twoFavs = await asAdmin.query(api.reports.listUserFavorites, {
      workspaceId: ws1,
    });
    expect(twoFavs.length).toBe(2);
    expect(twoFavs).toContain("rep_salary_statement");
    expect(twoFavs).toContain("rep_form16");

    // Remove first favorite
    const res2 = await asAdmin.mutation(api.reports.toggleFavorite, {
      workspaceId: ws1,
      reportId: "rep_salary_statement",
    });
    expect(res2.isFavorite).toBe(false);

    const afterRemove = await asAdmin.query(api.reports.listUserFavorites, {
      workspaceId: ws1,
    });
    expect(afterRemove).toEqual(["rep_form16"]);
  });

  test("2. User favorites are strictly isolated per user and per workspace", async () => {
    const t = convexTest(schema, modules);
    const { ws1, ws2, adminUser, memberUser, externalUser } =
      await seedTestWorkspaceWithUsers(t);

    const asAdmin = t.withIdentity(as(adminUser));
    const asMember = t.withIdentity(as(memberUser));
    const asExternal = t.withIdentity(as(externalUser));

    // Admin favorites report A in ws1
    await asAdmin.mutation(api.reports.toggleFavorite, {
      workspaceId: ws1,
      reportId: "rep_epf_ecr",
    });

    // Member in ws1 checks favorites -> should be empty (isolated per user)
    const memberFavs = await asMember.query(api.reports.listUserFavorites, {
      workspaceId: ws1,
    });
    expect(memberFavs).toEqual([]);

    // Member favorites report B in ws1
    await asMember.mutation(api.reports.toggleFavorite, {
      workspaceId: ws1,
      reportId: "rep_pt_monthly",
    });

    const memberFavsAfter = await asMember.query(api.reports.listUserFavorites, {
      workspaceId: ws1,
    });
    expect(memberFavsAfter).toEqual(["rep_pt_monthly"]);

    const adminFavs = await asAdmin.query(api.reports.listUserFavorites, {
      workspaceId: ws1,
    });
    expect(adminFavs).toEqual(["rep_epf_ecr"]);

    // External user in ws2 checks favorites -> should be empty
    const extFavs = await asExternal.query(api.reports.listUserFavorites, {
      workspaceId: ws2,
    });
    expect(extFavs).toEqual([]);
  });

  test("3. Cross-workspace IDOR protection: User cannot query or toggle favorites in unjoined workspace", async () => {
    const t = convexTest(schema, modules);
    const { ws1, ws2, externalUser, adminUser } =
      await seedTestWorkspaceWithUsers(t);

    const asExternal = t.withIdentity(as(externalUser));
    const asAdmin = t.withIdentity(as(adminUser));

    // External user attempting to access ws1 favorites must throw Forbidden
    await expect(
      asExternal.query(api.reports.listUserFavorites, {
        workspaceId: ws1,
      }),
    ).rejects.toThrow();

    await expect(
      asExternal.mutation(api.reports.toggleFavorite, {
        workspaceId: ws1,
        reportId: "rep_epf_ecr",
      }),
    ).rejects.toThrow();

    // Admin user attempting to access ws2 favorites must throw Forbidden
    await expect(
      asAdmin.query(api.reports.listUserFavorites, {
        workspaceId: ws2,
      }),
    ).rejects.toThrow();

    await expect(
      asAdmin.mutation(api.reports.toggleFavorite, {
        workspaceId: ws2,
        reportId: "rep_epf_ecr",
      }),
    ).rejects.toThrow();
  });

  test("4. Report execution history logging and listing", async () => {
    const t = convexTest(schema, modules);
    const { ws1, adminUser } = await seedTestWorkspaceWithUsers(t);
    const asAdmin = t.withIdentity(as(adminUser));

    // Record report execution
    await asAdmin.mutation(api.reports.recordReportExecution, {
      workspaceId: ws1,
      reportId: "rep_salary_statement",
      reportName: "Salary Statement for a Month",
      category: "Payroll",
      parameters: JSON.stringify({ periodMonth: "2026-11" }),
      format: "PDF",
      rowCount: 42,
      fileSizeKb: 128,
    });

    const recent = await asAdmin.query(api.reports.listRecentReports, {
      workspaceId: ws1,
    });
    expect(recent.length).toBe(1);
    expect(recent[0].reportId).toBe("rep_salary_statement");
    expect(recent[0].reportName).toBe("Salary Statement for a Month");
    expect(recent[0].rowCount).toBe(42);
    expect(recent[0].format).toBe("PDF");
  });
});
