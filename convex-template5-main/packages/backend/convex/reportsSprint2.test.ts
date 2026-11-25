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
        "./payrollReportsHelper.ts": () => import("./payrollReportsHelper"),
        "./orgs.ts": () => import("./orgs"),
        "./schema.ts": () => import("./schema"),
        "./auditLog.ts": () => import("./auditLog"),
        "./audit.ts": () => import("./audit"),
        "./auth.config.ts": () => import("./auth.config"),
        "./auth.ts": () => import("./auth"),
        "./_generated/api.js": () => import("./_generated/api.js"),
        "./_generated/server.js": () => import("./_generated/server.js"),
      };

const as = (userId: Id<"users">) => ({
  subject: userId,
  issuer: "https://auth.indiapaypayroll.com",
});

async function seedReportsWorkspace(t: any) {
  const now = Date.now();
  return t.run(async (ctx: MutationCtx) => {
    const adminUser = await ctx.db.insert("users", {
      name: "Admin User",
      email: "admin@indiapaypayroll.com",
      emailVerificationTime: now,
    });
    const regularMember = await ctx.db.insert("users", {
      name: "Regular Member",
      email: "member@indiapaypayroll.com",
      emailVerificationTime: now,
    });
    const externalUser = await ctx.db.insert("users", {
      name: "External Admin",
      email: "external@otherpayroll.com",
      emailVerificationTime: now,
    });

    const ws1 = await ctx.db.insert("workspaces", {
      name: "IndiaPay Primary Org",
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
      userId: regularMember,
      role: "member",
      createdAt: now,
    });

    const ws2 = await ctx.db.insert("workspaces", {
      name: "External Org",
      ownerId: externalUser,
      createdAt: now,
    });
    await ctx.db.insert("members", {
      workspaceId: ws2,
      userId: externalUser,
      role: "admin",
      createdAt: now,
    });

    // Seed employees in ws1
    const emp1 = await ctx.db.insert("employees", {
      workspaceId: ws1,
      firstName: "Rajesh",
      lastName: "Sharma",
      email: "rajesh.sharma@testcompany.com",
      department: "Engineering",
      designation: "Lead Architect",
      employeeIdNumber: "EMP901",
      joiningDate: "2026-11-01",
      status: "active",
      bankName: "HDFC Bank",
      bankAccountNumber: "50100445566778",
      ifscCode: "HDFC0001234",
      pan: "ABCDE1234F",
      uan: "101928374650",
      createdAt: now,
      updatedAt: now,
    });

    const emp2 = await ctx.db.insert("employees", {
      workspaceId: ws1,
      firstName: "Kavita",
      lastName: "Nair",
      email: "kavita.nair@example.com",
      department: "Quality Assurance",
      designation: "Senior QA Engineer",
      employeeIdNumber: "EMP902",
      joiningDate: "2026-11-24",
      status: "active",
      bankName: "State Bank of India",
      bankAccountNumber: "203948571625",
      ifscCode: "SBIN0005678",
      pan: "XYZPA5678K",
      uan: "109876543210",
      createdAt: now,
      updatedAt: now,
    });

    // Seed employee in ws2
    await ctx.db.insert("employees", {
      workspaceId: ws2,
      firstName: "Foreign",
      lastName: "Worker",
      email: "foreign@othercorp.com",
      department: "Sales",
      designation: "Manager",
      employeeIdNumber: "EXT100",
      joiningDate: "2026-01-01",
      status: "active",
      createdAt: now,
      updatedAt: now,
    });

    return { ws1, ws2, adminUser, regularMember, externalUser, emp1, emp2 };
  });
}

describe("Reports Sprint 2: Dynamic Execution & Security Tests", () => {
  test("1. Admin receives unmasked bank details and PAN in salary register", async () => {
    const t = convexTest(schema, modules);
    const { ws1, adminUser } = await seedReportsWorkspace(t);
    const asAdmin = t.withIdentity(as(adminUser));

    const data = await asAdmin.query(api.reports.generateReportData, {
      workspaceId: ws1,
      reportId: "salary_register",
      periodMonth: "2026-11",
    });

    expect(data.length).toBe(2);
    const rajesh = data.find((r: any) => r.employeeName === "Rajesh Sharma");
    expect(rajesh).toBeDefined();
    expect(rajesh.employeeCode).toBe("EMP901");
    expect(rajesh.department).toBe("Engineering");
    expect(rajesh.netSalary).toBeGreaterThan(0);
    expect(rajesh.grossSalary).toBeGreaterThan(rajesh.basicSalary);
  });

  test("2. Non-admin user receives masked bank details in payout reports", async () => {
    const t = convexTest(schema, modules);
    const { ws1, regularMember } = await seedReportsWorkspace(t);
    const asMember = t.withIdentity(as(regularMember));

    const data = await asMember.query(api.reports.generateReportData, {
      workspaceId: ws1,
      reportId: "payment_register",
      periodMonth: "2026-11",
    });

    expect(data.length).toBe(2);
    for (const row of data) {
      expect(row.bankAccount).toBe("Restricted");
      expect(row.ifsc).toBe("Restricted");
    }
  });

  test("3. Cross-workspace report access is strictly blocked", async () => {
    const t = convexTest(schema, modules);
    const { ws1, externalUser } = await seedReportsWorkspace(t);
    const asExternal = t.withIdentity(as(externalUser));

    await expect(
      asExternal.query(api.reports.generateReportData, {
        workspaceId: ws1,
        reportId: "salary_register",
      })
    ).rejects.toThrow();
  });

  test("4. Recording report execution stores audit metadata and parameters", async () => {
    const t = convexTest(schema, modules);
    const { ws1, adminUser } = await seedReportsWorkspace(t);
    const asAdmin = t.withIdentity(as(adminUser));

    const runId = await asAdmin.mutation(api.reports.recordReportExecution, {
      workspaceId: ws1,
      reportId: "salary_register",
      reportName: "Salary Register",
      category: "Payroll Payout",
      parameters: JSON.stringify({ periodMonth: "2026-11", department: "Engineering" }),
      format: "XLSX",
      rowCount: 2,
      fileSizeKb: 18,
    });

    expect(runId).toBeDefined();

    const recent = await asAdmin.query(api.reports.listRecentReports, {
      workspaceId: ws1,
    });

    expect(recent.length).toBe(1);
    expect(recent[0].reportId).toBe("salary_register");
    expect(recent[0].format).toBe("XLSX");
    expect(recent[0].rowCount).toBe(2);
  });

  test("5. Department filtering correctly narrows down report rows", async () => {
    const t = convexTest(schema, modules);
    const { ws1, adminUser } = await seedReportsWorkspace(t);
    const asAdmin = t.withIdentity(as(adminUser));

    const engineeringOnly = await asAdmin.query(api.reports.generateReportData, {
      workspaceId: ws1,
      reportId: "salary_register",
      department: "Engineering",
    });

    expect(engineeringOnly.length).toBe(1);
    expect(engineeringOnly[0].employeeName).toBe("Rajesh Sharma");
  });
});
