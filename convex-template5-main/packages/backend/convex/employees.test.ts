import { convexTest } from "convex-test";
import { describe, expect, test } from "vitest";
import { api } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import type { MutationCtx } from "./_generated/server";
import {
  maskAccountNumber,
  maskPan,
  maskUan,
  validateAccountHolderName,
  validateBankAccountNumber,
  validateBankName,
  validateEsicIpNumber,
  validateIfsc,
  validatePan,
  validatePfMemberId,
  validateUan,
} from "./employees";
import schema from "./schema";

// biome-ignore lint/suspicious/noExplicitAny: convexTest modules map
const modules: Record<string, () => Promise<any>> =
  // biome-ignore lint/suspicious/noExplicitAny: glob import
  typeof (import.meta as any).glob === "function"
    ? // biome-ignore lint/suspicious/noExplicitAny: glob import
      (import.meta as any).glob(["./**/*.*s", "!./**/*.test.*"])
    : {
        "./ResendOTP.ts": () => import("./ResendOTP"),
        "./apiKeys.ts": () => import("./apiKeys"),
        "./audit.ts": () => import("./audit"),
        "./auditLog.ts": () => import("./auditLog"),
        "./auth.config.ts": () => import("./auth.config"),
        "./auth.ts": () => import("./auth"),
        "./backend.ts": () => import("./backend"),
        "./counters.ts": () => import("./counters"),
        "./dashboard.ts": () => import("./dashboard"),
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
        "./declarations.ts": () => import("./declarations"),
        "./employees.ts": () => import("./employees"),
        "./leaves.ts": () => import("./leaves"),
        "./lop.ts": () => import("./lop"),
        "./payroll.ts": () => import("./payroll"),
        "./salaries.ts": () => import("./salaries"),
        "./statutory.ts": () => import("./statutory"),
        "./statutoryTds.ts": () => import("./statutoryTds"),
        "./professionalTax.ts": () => import("./professionalTax"),
        "./lwf.ts": () => import("./lwf"),
        "./devAccounts.ts": () => import("./devAccounts"),
        "./devAccountsMutation.ts": () => import("./devAccountsMutation"),
        "./_generated/api.js": () => import("./_generated/api.js"),
        "./_generated/server.js": () => import("./_generated/server.js"),
      };

const as = (userId: string) => ({ subject: `${userId}|sess_${userId}` });

// biome-ignore lint/suspicious/noExplicitAny: convexTest runner instance
async function seedEmployeeTestWorkspace(t: any) {
  let ws!: Id<"workspaces">;
  let owner!: Id<"users">;
  let admin!: Id<"users">;
  let member1!: Id<"users">;
  let member2!: Id<"users">;

  await t.run(async (ctx: MutationCtx) => {
    owner = await ctx.db.insert("users", {
      name: "Owner User",
      email: "owner@indiapay.com",
      emailVerificationTime: Date.now(),
    });
    admin = await ctx.db.insert("users", {
      name: "Admin User",
      email: "admin@indiapay.com",
      emailVerificationTime: Date.now(),
    });
    member1 = await ctx.db.insert("users", {
      name: "Member One",
      email: "member1@indiapay.com",
      emailVerificationTime: Date.now(),
    });
    member2 = await ctx.db.insert("users", {
      name: "Member Two",
      email: "member2@indiapay.com",
      emailVerificationTime: Date.now(),
    });

    ws = await ctx.db.insert("workspaces", {
      name: "IndiaPay Banking Test Workspace",
      ownerId: owner,
      createdAt: Date.now(),
    });

    await ctx.db.insert("members", {
      workspaceId: ws,
      userId: owner,
      role: "owner",
      createdAt: Date.now(),
    });
    await ctx.db.insert("members", {
      workspaceId: ws,
      userId: admin,
      role: "admin",
      createdAt: Date.now(),
    });
    await ctx.db.insert("members", {
      workspaceId: ws,
      userId: member1,
      role: "member",
      createdAt: Date.now(),
    });
    await ctx.db.insert("members", {
      workspaceId: ws,
      userId: member2,
      role: "member",
      createdAt: Date.now(),
    });
  });

  return { ws, owner, admin, member1, member2 };
}

describe("Employee Banking & Statutory Master Data — Validation & Masking Suite", () => {
  test("PAN validation accepts valid formats and rejects invalid formats", () => {
    expect(validatePan("ABCDE1234F")).toBe("ABCDE1234F");
    expect(validatePan("abcde1234f")).toBe("ABCDE1234F"); // Normalizes to uppercase
    expect(validatePan("  XYZPA9876Z  ")).toBe("XYZPA9876Z");

    // Invalid PAN formats
    expect(() => validatePan("ABCDE12345")).toThrow("Invalid PAN format");
    expect(() => validatePan("12345ABCDE")).toThrow("Invalid PAN format");
    expect(() => validatePan("ABCD1234F")).toThrow("Invalid PAN format");
    expect(() => validatePan("ABCDEF1234F")).toThrow("Invalid PAN format");
  });

  test("IFSC validation accepts valid RBI format and rejects invalid codes", () => {
    expect(validateIfsc("HDFC0001234")).toBe("HDFC0001234");
    expect(validateIfsc("sbin0000123")).toBe("SBIN0000123");
    expect(validateIfsc("ICIC0000001")).toBe("ICIC0000001");

    // Invalid IFSC formats
    expect(() => validateIfsc("HDFC1001234")).toThrow(
      "Invalid IFSC code format",
    ); // 5th char must be 0
    expect(() => validateIfsc("HDF0001234")).toThrow(
      "Invalid IFSC code format",
    ); // Too short
    expect(() => validateIfsc("12340001234")).toThrow(
      "Invalid IFSC code format",
    ); // First 4 must be letters
  });

  test("Bank Account Number validation enforces 9-18 digit length", () => {
    expect(validateBankAccountNumber("123456789")).toBe("123456789");
    expect(validateBankAccountNumber("123456789012345678")).toBe(
      "123456789012345678",
    );

    // Invalid accounts
    expect(() => validateBankAccountNumber("12345678")).toThrow(
      "Invalid bank account number",
    ); // Too short (< 9)
    expect(() => validateBankAccountNumber("1234567890123456789")).toThrow(
      "Invalid bank account number",
    ); // Too long (> 18)
    expect(() => validateBankAccountNumber("12345ABC6789")).toThrow(
      "Invalid bank account number",
    ); // Non-numeric
  });

  test("UAN and ESIC IP validation enforce statutory numeric digit constraints", () => {
    expect(validateUan("100123456789")).toBe("100123456789");
    expect(() => validateUan("10012345678")).toThrow("Invalid UAN format"); // 11 digits
    expect(() => validateUan("1001234567890")).toThrow("Invalid UAN format"); // 13 digits
    expect(() => validateUan("10012345678A")).toThrow("Invalid UAN format");

    expect(validateEsicIpNumber("1122334455")).toBe("1122334455"); // 10 digits
    expect(() => validateEsicIpNumber("112233445")).toThrow(
      "Invalid ESIC IP Number format",
    );
  });

  test("PF Member ID validation enforces alphanumeric pattern", () => {
    expect(validatePfMemberId("KNBLR00123450000001234")).toBe(
      "KNBLR00123450000001234",
    );
    expect(validatePfMemberId("MH/BAN/0012345/000/0000123")).toBe(
      "MH/BAN/0012345/000/0000123",
    );
    expect(() => validatePfMemberId("SHORT")).toThrow(
      "Invalid PF Member ID format",
    );
  });

  test("Bank Account Holder and Bank Name enforce minimum length", () => {
    expect(validateAccountHolderName("Arun Kumar")).toBe("Arun Kumar");
    expect(validateBankName("HDFC Bank")).toBe("HDFC Bank");
    expect(() => validateAccountHolderName("A")).toThrow(
      "between 2 and 100 characters",
    );
    expect(() => validateBankName(" ")).toThrow("between 2 and 100 characters");
  });

  test("Masking utilities obscure sensitive numbers leaving only non-identifying suffixes", () => {
    expect(maskAccountNumber("123456789012")).toBe("••••••••9012");
    expect(maskAccountNumber("987654321")).toBe("•••••4321");
    expect(maskAccountNumber(undefined)).toBeUndefined();

    expect(maskPan("ABCDE1234F")).toBe("••••••234F");
    expect(maskPan(undefined)).toBeUndefined();

    expect(maskUan("100123456789")).toBe("••••••••6789");
    expect(maskUan(undefined)).toBeUndefined();
  });
});

describe("Employee Banking & Statutory Master Data — Convex Workflow & RBAC Suite", () => {
  test("Existing records without banking/statutory fields return cleanly without error", async () => {
    const t = convexTest(schema, modules);
    const { ws, admin } = await seedEmployeeTestWorkspace(t);
    const asAdmin = t.withIdentity(as(admin));

    // Insert legacy record directly in DB (simulating existing data before migration)
    let legacyEmpId!: Id<"employees">;
    await t.run(async (ctx: MutationCtx) => {
      legacyEmpId = await ctx.db.insert("employees", {
        workspaceId: ws,
        firstName: "Legacy",
        lastName: "Employee",
        email: "legacy@indiapay.com",
        status: "active",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    });

    // Query list as admin
    const list = await asAdmin.query(api.employees.list, { workspaceId: ws });
    expect(list.length).toBe(1);
    expect(list[0].firstName).toBe("Legacy");
    expect(list[0].bankAccountNumber).toBeUndefined();
    expect(list[0].pan).toBeUndefined();
    expect(list[0].maskedBankAccountNumber).toBeUndefined();
    expect(list[0].maskedPan).toBeUndefined();

    // Query single record by ID
    const single = await asAdmin.query(api.employees.getById, {
      workspaceId: ws,
      employeeId: legacyEmpId,
    });
    expect(single.firstName).toBe("Legacy");
    expect(single.bankAccountNumber).toBeUndefined();
  });

  test("Admin can add employee with complete banking and statutory master data", async () => {
    const t = convexTest(schema, modules);
    const { ws, admin } = await seedEmployeeTestWorkspace(t);
    const asAdmin = t.withIdentity(as(admin));

    const empId = await asAdmin.mutation(api.employees.add, {
      workspaceId: ws,
      firstName: "Rahul",
      lastName: "Sharma",
      email: "rahul.sharma@indiapay.com",
      department: "Engineering",
      designation: "Staff Engineer",
      bankAccountHolderName: "Rahul Sharma",
      bankName: "HDFC Bank",
      bankAccountNumber: "50100123456789",
      ifscCode: "HDFC0001234",
      pan: "ABCDE1234F",
      uan: "100123456789",
      esicIpNumber: "3100123456",
      pfMemberId: "KNBLR00123450000001234",
    });

    expect(empId).toBeDefined();

    // Retrieve and verify data
    const emp = await asAdmin.query(api.employees.getById, {
      workspaceId: ws,
      employeeId: empId,
    });

    expect(emp.bankAccountHolderName).toBe("Rahul Sharma");
    expect(emp.bankName).toBe("HDFC Bank");
    expect(emp.bankAccountNumber).toBe("50100123456789");
    expect(emp.ifscCode).toBe("HDFC0001234");
    expect(emp.pan).toBe("ABCDE1234F");
    expect(emp.uan).toBe("100123456789");
    expect(emp.esicIpNumber).toBe("3100123456");
    expect(emp.pfMemberId).toBe("KNBLR00123450000001234");

    // Masked properties available for ordinary view
    expect(emp.maskedBankAccountNumber).toBe("••••••••••6789");
    expect(emp.maskedPan).toBe("••••••234F");
    expect(emp.maskedUan).toBe("••••••••6789");
  });

  test("Input validation rejects malformed banking/statutory values during add and update", async () => {
    const t = convexTest(schema, modules);
    const { ws, admin } = await seedEmployeeTestWorkspace(t);
    const asAdmin = t.withIdentity(as(admin));

    // Reject invalid PAN
    await expect(
      asAdmin.mutation(api.employees.add, {
        workspaceId: ws,
        firstName: "Test",
        lastName: "User",
        email: "test.user@indiapay.com",
        pan: "MALFORMED_PAN",
      }),
    ).rejects.toThrow("Invalid PAN format");

    // Reject invalid IFSC
    await expect(
      asAdmin.mutation(api.employees.add, {
        workspaceId: ws,
        firstName: "Test",
        lastName: "User",
        email: "test.user@indiapay.com",
        ifscCode: "INVALID_IFSC",
      }),
    ).rejects.toThrow("Invalid IFSC code format");

    // Reject invalid Bank Account Number
    await expect(
      asAdmin.mutation(api.employees.add, {
        workspaceId: ws,
        firstName: "Test",
        lastName: "User",
        email: "test.user@indiapay.com",
        bankAccountNumber: "12345", // too short
      }),
    ).rejects.toThrow("Invalid bank account number");
  });

  test("Admin can incrementally update banking and statutory details", async () => {
    const t = convexTest(schema, modules);
    const { ws, admin } = await seedEmployeeTestWorkspace(t);
    const asAdmin = t.withIdentity(as(admin));

    // Create employee without banking
    const empId = await asAdmin.mutation(api.employees.add, {
      workspaceId: ws,
      firstName: "Priya",
      lastName: "Patel",
      email: "priya.patel@indiapay.com",
    });

    // Update with banking and PAN
    await asAdmin.mutation(api.employees.update, {
      workspaceId: ws,
      employeeId: empId,
      bankAccountHolderName: "Priya Patel",
      bankName: "ICICI Bank",
      bankAccountNumber: "000123456789",
      ifscCode: "ICIC0000001",
      pan: "BCDEA5678K",
    });

    const updated = await asAdmin.query(api.employees.getById, {
      workspaceId: ws,
      employeeId: empId,
    });
    expect(updated.bankName).toBe("ICICI Bank");
    expect(updated.bankAccountNumber).toBe("000123456789");
    expect(updated.pan).toBe("BCDEA5678K");
    expect(updated.maskedBankAccountNumber).toBe("••••••••6789");
    expect(updated.maskedPan).toBe("••••••678K");
  });

  test("RBAC: Regular workspace members cannot view other employees' sensitive banking data", async () => {
    const t = convexTest(schema, modules);
    const { ws, admin, member1, member2 } = await seedEmployeeTestWorkspace(t);
    const asAdmin = t.withIdentity(as(admin));
    const asMember1 = t.withIdentity(as(member1));

    // Admin creates employee for Member 2 with confidential banking & statutory data
    const emp2Id = await asAdmin.mutation(api.employees.add, {
      workspaceId: ws,
      firstName: "Member",
      lastName: "Two",
      email: "member2@indiapay.com",
      bankAccountHolderName: "Member Two",
      bankName: "Axis Bank",
      bankAccountNumber: "912010012345678",
      ifscCode: "UTIB0000123",
      pan: "XYZPA1234M",
      uan: "100987654321",
    });

    // Link Member 2's user account to this employee
    await t.run(async (ctx: MutationCtx) => {
      await ctx.db.patch(emp2Id, { userId: member2 });
    });

    // Member 1 calls list
    const listSeenByMember1 = await asMember1.query(api.employees.list, {
      workspaceId: ws,
    });
    const recordForEmp2 = listSeenByMember1.find((e) => e._id === emp2Id);
    expect(recordForEmp2).toBeDefined();

    // SENSITIVE FIELDS MUST BE STRIPPED FOR MEMBER 1:
    expect(recordForEmp2?.bankAccountNumber).toBeUndefined();
    expect(recordForEmp2?.bankAccountHolderName).toBeUndefined();
    expect(recordForEmp2?.bankName).toBeUndefined();
    expect(recordForEmp2?.ifscCode).toBeUndefined();
    expect(recordForEmp2?.pan).toBeUndefined();
    expect(recordForEmp2?.uan).toBeUndefined();
    expect(recordForEmp2?.maskedBankAccountNumber).toBeUndefined();
    expect(recordForEmp2?.maskedPan).toBeUndefined();

    // Non-sensitive fields remain accessible
    expect(recordForEmp2?.firstName).toBe("Member");
    expect(recordForEmp2?.lastName).toBe("Two");
    expect(recordForEmp2?.email).toBe("member2@indiapay.com");

    // Member 1 attempts IDOR direct query on emp2Id -> Must be rejected with Forbidden
    await expect(
      asMember1.query(api.employees.getById, {
        workspaceId: ws,
        employeeId: emp2Id,
      }),
    ).rejects.toThrow("Forbidden");

    // Member 1 attempts unauthorized mutation to change emp2's bank account -> Must be rejected
    await expect(
      asMember1.mutation(api.employees.update, {
        workspaceId: ws,
        employeeId: emp2Id,
        bankAccountNumber: "111122223333",
      }),
    ).rejects.toThrow("Forbidden");
  });

  test("Self-Access: Employee can securely view their own banking & statutory details via getMyProfile", async () => {
    const t = convexTest(schema, modules);
    const { ws, admin, member1 } = await seedEmployeeTestWorkspace(t);
    const asAdmin = t.withIdentity(as(admin));
    const asMember1 = t.withIdentity(as(member1));

    // Admin creates employee for Member 1
    const emp1Id = await asAdmin.mutation(api.employees.add, {
      workspaceId: ws,
      firstName: "Member",
      lastName: "One",
      email: "member1@indiapay.com",
      bankAccountHolderName: "Member One",
      bankName: "State Bank of India",
      bankAccountNumber: "30012345678",
      ifscCode: "SBIN0001234",
      pan: "ABCDE9876Z",
      uan: "100111222333",
    });

    await t.run(async (ctx: MutationCtx) => {
      await ctx.db.patch(emp1Id, { userId: member1 });
    });

    // Member 1 queries their own profile
    const myProfile = await asMember1.query(api.employees.getMyProfile, {
      workspaceId: ws,
    });
    expect(myProfile).toBeDefined();
    expect(myProfile?._id).toBe(emp1Id);
    expect(myProfile?.bankAccountHolderName).toBe("Member One");
    expect(myProfile?.bankName).toBe("State Bank of India");
    expect(myProfile?.ifscCode).toBe("SBIN0001234");
    expect(myProfile?.bankAccountNumber).toBe("30012345678");
    expect(myProfile?.pan).toBe("ABCDE9876Z");
    expect(myProfile?.maskedBankAccountNumber).toBe("•••••••5678");
    expect(myProfile?.maskedPan).toBe("••••••876Z");
  });

  test("Security & Audit: Sensitive values are NEVER stored in audit logs", async () => {
    const t = convexTest(schema, modules);
    const { ws, admin } = await seedEmployeeTestWorkspace(t);
    const asAdmin = t.withIdentity(as(admin));

    const testAccNum = "987654321012";
    const testPan = "PQRST1234K";

    const empId = await asAdmin.mutation(api.employees.add, {
      workspaceId: ws,
      firstName: "Audit",
      lastName: "Check",
      email: "audit.check@indiapay.com",
      bankAccountNumber: testAccNum,
      pan: testPan,
    });

    await asAdmin.mutation(api.employees.update, {
      workspaceId: ws,
      employeeId: empId,
      ifscCode: "HDFC0009999",
    });

    // Inspect audit logs directly from database
    const logs = await t.run(async (ctx: MutationCtx) => {
      return await ctx.db
        .query("auditLogs")
        .withIndex("by_workspace", (q) => q.eq("workspaceId", ws))
        .collect();
    });

    expect(logs.length).toBeGreaterThanOrEqual(2);

    // Verify neither testAccNum nor testPan appears anywhere in audit log payloads
    for (const log of logs) {
      const serialized = JSON.stringify(log);
      expect(serialized.includes(testAccNum)).toBe(false);
      expect(serialized.includes(testPan)).toBe(false);
    }
  });

  test("Regression: Admin can clear an optional banking/statutory field by passing empty string", async () => {
    const t = convexTest(schema, modules);
    const { ws, admin } = await seedEmployeeTestWorkspace(t);
    const asAdmin = t.withIdentity(as(admin));

    const empId = await asAdmin.mutation(api.employees.add, {
      workspaceId: ws,
      firstName: "Rohan",
      lastName: "Sharma",
      email: "rohan.sharma@indiapay.com",
      pan: "ABCDE1234F",
      bankAccountNumber: "987654321012",
    });

    const beforeClear = await asAdmin.query(api.employees.getById, {
      workspaceId: ws,
      employeeId: empId,
    });
    expect(beforeClear.pan).toBe("ABCDE1234F");
    expect(beforeClear.bankAccountNumber).toBe("987654321012");

    // Clear fields by submitting empty strings
    await asAdmin.mutation(api.employees.update, {
      workspaceId: ws,
      employeeId: empId,
      pan: "",
      bankAccountNumber: "",
    });

    const afterClear = await asAdmin.query(api.employees.getById, {
      workspaceId: ws,
      employeeId: empId,
    });
    expect(afterClear.pan).toBeUndefined();
    expect(afterClear.bankAccountNumber).toBeUndefined();
    expect(afterClear.maskedPan).toBeUndefined();
    expect(afterClear.maskedBankAccountNumber).toBeUndefined();
  });

  test("Regression: Payslip generation securely attaches masked banking & statutory info for authorized recipients", async () => {
    const t = convexTest(schema, modules);
    const { ws, admin, member1 } = await seedEmployeeTestWorkspace(t);
    const asAdmin = t.withIdentity(as(admin));
    const asMember1 = t.withIdentity(as(member1));

    const emp1Id = await asAdmin.mutation(api.employees.add, {
      workspaceId: ws,
      firstName: "Anjali",
      lastName: "Verma",
      email: "anjali.verma@indiapay.com",
      bankName: "HDFC Bank",
      bankAccountNumber: "123456789012",
      ifscCode: "HDFC0001234",
      pan: "ABCDE1234F",
      uan: "100123456789",
      pfMemberId: "MHBAN00123450000000123",
    });

    await t.run(async (ctx: MutationCtx) => {
      await ctx.db.patch(emp1Id, { userId: member1 });
    });

    let runId!: Id<"payrollRuns">;
    await t.run(async (ctx: MutationCtx) => {
      runId = await ctx.db.insert("payrollRuns", {
        workspaceId: ws,
        periodMonth: "2026-10",
        startDate: "2026-10-01",
        endDate: "2026-10-31",
        status: "processed",
        totalEmployees: 1,
        totalGrossSalary: 80000,
        totalLopDeduction: 0,
        totalCustomDeductions: 0,
        totalStatutoryDeductions: 8000,
        totalEmployerContributions: 4000,
        totalNetSalary: 72000,
        createdById: admin,
        submittedBy: admin,
        finalizedAt: Date.now(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      await ctx.db.insert("payrollItems", {
        workspaceId: ws,
        payrollRunId: runId,
        employeeId: emp1Id,
        basicSalary: 50000,
        allowances: [],
        grossSalary: 80000,
        lopDays: 0,
        lopDeduction: 0,
        customDeductions: [],
        totalCustomDeductions: 0,
        statutoryDeductions: [
          { name: "PF", amount: 6000, isConfigured: true },
          { name: "PT", amount: 200, isConfigured: true },
          { name: "TDS", amount: 1800, isConfigured: true },
        ],
        totalStatutoryDeductions: 8000,
        employerContributions: [
          { name: "Employer PF", amount: 4000, isConfigured: true },
        ],
        totalEmployerContributions: 4000,
        totalDeductions: 8000,
        netSalary: 72000,
        hasSalaryStructure: true,
        warnings: [],
        createdAt: Date.now(),
      });
    });

    // Employee queries their own finalized payslip
    const payslip = await asMember1.query(api.payroll.getPayslip, {
      workspaceId: ws,
      payrollRunId: runId,
      employeeId: emp1Id,
    });

    expect(payslip).toBeDefined();
    expect(payslip.bankName).toBe("HDFC Bank");
    expect(payslip.maskedBankAccountNumber).toBe("••••••••9012");
    expect(payslip.ifscCode).toBe("HDFC0001234");
    expect(payslip.maskedPan).toBe("••••••234F");
    expect(payslip.maskedUan).toBe("••••••••6789");
    expect(payslip.pfMemberId).toBe("MHBAN00123450000000123");
    expect(payslip.netSalary).toBe(72000);
  });

  test("Phase 1: Admin can set and update isPfMember flag which synchronizes with employeeCompliance", async () => {
    const t = convexTest(schema, modules);
    const { ws, admin } = await seedEmployeeTestWorkspace(t);
    const asAdmin = t.withIdentity(as(admin));

    // 1. Add employee with isPfMember: true
    const empPfYesId = await asAdmin.mutation(api.employees.add, {
      workspaceId: ws,
      firstName: "Rohan",
      lastName: "Sharma",
      email: "rohan@indiapay.com",
      isPfMember: true,
      uan: "100904567812",
      pfMemberId: "KNBLR00123450000000001",
    });

    const empPfYes = await asAdmin.query(api.employees.getById, {
      workspaceId: ws,
      employeeId: empPfYesId,
    });
    expect(empPfYes.isPfMember).toBe(true);

    // Check compliance table
    await t.run(async (ctx: MutationCtx) => {
      const comp = await ctx.db
        .query("employeeCompliance")
        .withIndex("by_employee", (q) => q.eq("employeeId", empPfYesId))
        .first();
      expect(comp).toBeDefined();
      expect(comp?.epfOptOut).toBe(false);
    });

    // 2. Add employee with isPfMember: false
    const empPfNoId = await asAdmin.mutation(api.employees.add, {
      workspaceId: ws,
      firstName: "Sneha",
      lastName: "Patel",
      email: "sneha@indiapay.com",
      isPfMember: false,
    });

    const empPfNo = await asAdmin.query(api.employees.getById, {
      workspaceId: ws,
      employeeId: empPfNoId,
    });
    expect(empPfNo.isPfMember).toBe(false);

    await t.run(async (ctx: MutationCtx) => {
      const comp = await ctx.db
        .query("employeeCompliance")
        .withIndex("by_employee", (q) => q.eq("employeeId", empPfNoId))
        .first();
      expect(comp).toBeDefined();
      expect(comp?.epfOptOut).toBe(true);
    });

    // 3. Update employee: toggle isPfMember to false
    await asAdmin.mutation(api.employees.update, {
      workspaceId: ws,
      employeeId: empPfYesId,
      isPfMember: false,
    });

    const empUpdated = await asAdmin.query(api.employees.getById, {
      workspaceId: ws,
      employeeId: empPfYesId,
    });
    expect(empUpdated.isPfMember).toBe(false);

    await t.run(async (ctx: MutationCtx) => {
      const comp = await ctx.db
        .query("employeeCompliance")
        .withIndex("by_employee", (q) => q.eq("employeeId", empPfYesId))
        .first();
      expect(comp?.epfOptOut).toBe(true);
    });
  });

  test("Admin can safely soft-remove an employee, preserving historical records and audit logs", async () => {
    const t = convexTest(schema, modules);
    const { ws, admin, member1 } = await seedEmployeeTestWorkspace(t);
    const asAdmin = t.withIdentity(as(admin));
    const asMember = t.withIdentity(as(member1));

    const empId = await asAdmin.mutation(api.employees.add, {
      workspaceId: ws,
      firstName: "Test",
      lastName: "RemoveMe",
      email: "removeme@example.com",
    });

    // Add a salary and attendance record for this employee
    await t.run(async (ctx: MutationCtx) => {
      await ctx.db.insert("salaries", {
        workspaceId: ws,
        employeeId: empId,
        basicSalary: 40000,
        allowances: [],
        deductions: [],
        grossSalary: 40000,
        effectiveDate: Date.now(),
        createdAt: Date.now(),
      });
      await ctx.db.insert("attendance", {
        workspaceId: ws,
        employeeId: empId,
        date: "2026-10-01",
        status: "present",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    });

    // Verify employee is in directory before removal
    const beforeList = await asAdmin.query(api.employees.list, { workspaceId: ws });
    expect(beforeList.some((e) => e._id === empId)).toBe(true);

    // Non-admin cannot remove employee
    await expect(
      asMember.mutation(api.employees.remove, {
        workspaceId: ws,
        employeeId: empId,
      }),
    ).rejects.toThrow();

    // Admin executes safe soft removal
    await asAdmin.mutation(api.employees.remove, {
      workspaceId: ws,
      employeeId: empId,
    });

    // Verify employee is removed from directory listing
    const afterList = await asAdmin.query(api.employees.list, { workspaceId: ws });
    expect(afterList.some((e) => e._id === empId)).toBe(false);

    // Verify database record has safe soft-removal flags and historical data is preserved
    await t.run(async (ctx: MutationCtx) => {
      const emp = await ctx.db.get(empId);
      expect(emp).not.toBeNull();
      expect(emp?.isRemoved).toBe(true);
      expect(emp?.status).toBe("inactive");
      expect(typeof emp?.removedAt).toBe("number");

      // Verify historical salary and attendance records are strictly preserved
      const sals = await ctx.db
        .query("salaries")
        .withIndex("by_employee", (q) => q.eq("employeeId", empId))
        .collect();
      expect(sals.length).toBe(1);

      const atts = await ctx.db
        .query("attendance")
        .withIndex("by_employee", (q) => q.eq("employeeId", empId))
        .collect();
      expect(atts.length).toBe(1);

      // Verify audit log entry exists
      const logs = await ctx.db
        .query("auditLogs")
        .withIndex("by_workspace", (q) => q.eq("workspaceId", ws))
        .collect();
      const removalLog = logs.find((l) => l.action === "employee.remove");
      expect(removalLog).toBeDefined();
      expect((removalLog?.meta as any)?.softRemoval).toBe(true);
    });
  });

  test("Defect 1 & 2: Employee number and joining date persistence", async () => {
    const t = convexTest(schema, modules);
    const { ws, admin } = await seedEmployeeTestWorkspace(t);
    const asAdmin = t.withIdentity(as(admin));

    const empId = await asAdmin.mutation(api.employees.add, {
      workspaceId: ws,
      firstName: "Rajesh",
      lastName: "Sharma",
      email: "rajesh.sharma@testcompany.com",
      employeeIdNumber: "EMP901",
      joiningDate: "2026-11-01",
      department: "Engineering",
      designation: "Lead Architect",
    });

    const emp = await asAdmin.query(api.employees.getById, {
      workspaceId: ws,
      employeeId: empId,
    });

    expect(emp.employeeIdNumber).toBe("EMP901");
    expect(emp.joiningDate).toBe("2026-11-01");

    // Verify in directory list query
    const list = await asAdmin.query(api.employees.list, { workspaceId: ws });
    const found = list.find((e) => e._id === empId);
    expect(found?.employeeIdNumber).toBe("EMP901");
    expect(found?.joiningDate).toBe("2026-11-01");
  });

  test("Defect 3: Duplicate employee number rejected within same workspace", async () => {
    const t = convexTest(schema, modules);
    const { ws, admin } = await seedEmployeeTestWorkspace(t);
    const asAdmin = t.withIdentity(as(admin));

    await asAdmin.mutation(api.employees.add, {
      workspaceId: ws,
      firstName: "Rajesh",
      lastName: "Sharma",
      email: "rajesh.sharma@testcompany.com",
      employeeIdNumber: "EMP901",
      joiningDate: "2026-11-01",
    });

    // Attempting same employee number with different casing/whitespace must fail
    await expect(
      asAdmin.mutation(api.employees.add, {
        workspaceId: ws,
        firstName: "Duplicate",
        lastName: "Person",
        email: "duplicate@testcompany.com",
        employeeIdNumber: "  emp901  ",
        joiningDate: "2026-11-02",
      }),
    ).rejects.toThrow(/already assigned to another employee/);
  });

  test("Defect 3: Same employee number is allowed in different workspaces", async () => {
    const t = convexTest(schema, modules);
    const { ws: ws1, admin } = await seedEmployeeTestWorkspace(t);
    const asAdmin = t.withIdentity(as(admin));

    // Create second workspace
    const now = Date.now();
    const ws2 = await t.run(async (ctx: MutationCtx) => {
      const wId = await ctx.db.insert("workspaces", {
        name: "Second Workspace",
        ownerId: admin,
        createdAt: now,
      });
      await ctx.db.insert("members", {
        workspaceId: wId,
        userId: admin,
        role: "admin",
        createdAt: now,
      });
      return wId;
    });

    const emp1Id = await asAdmin.mutation(api.employees.add, {
      workspaceId: ws1,
      firstName: "Rajesh",
      lastName: "Sharma",
      email: "rajesh.sharma@testcompany.com",
      employeeIdNumber: "EMP901",
      joiningDate: "2026-11-01",
    });

    const emp2Id = await asAdmin.mutation(api.employees.add, {
      workspaceId: ws2,
      firstName: "Other",
      lastName: "Employee",
      email: "other@othercompany.com",
      employeeIdNumber: "EMP901",
      joiningDate: "2026-11-01",
    });

    expect(emp1Id).toBeDefined();
    expect(emp2Id).toBeDefined();

    const emp1 = await asAdmin.query(api.employees.getById, {
      workspaceId: ws1,
      employeeId: emp1Id,
    });
    const emp2 = await asAdmin.query(api.employees.getById, {
      workspaceId: ws2,
      employeeId: emp2Id,
    });

    expect(emp1.employeeIdNumber).toBe("EMP901");
    expect(emp2.employeeIdNumber).toBe("EMP901");
  });

  test("Defect 3: Update mutation also enforces employee number uniqueness", async () => {
    const t = convexTest(schema, modules);
    const { ws, admin } = await seedEmployeeTestWorkspace(t);
    const asAdmin = t.withIdentity(as(admin));

    const emp1Id = await asAdmin.mutation(api.employees.add, {
      workspaceId: ws,
      firstName: "Emp1",
      lastName: "User",
      email: "emp1@testcompany.com",
      employeeIdNumber: "EMP001",
    });

    const emp2Id = await asAdmin.mutation(api.employees.add, {
      workspaceId: ws,
      firstName: "Emp2",
      lastName: "User",
      email: "emp2@testcompany.com",
      employeeIdNumber: "EMP002",
    });

    // Updating emp2 to emp1's employee number should fail
    await expect(
      asAdmin.mutation(api.employees.update, {
        workspaceId: ws,
        employeeId: emp2Id,
        employeeIdNumber: "EMP001",
      }),
    ).rejects.toThrow(/already assigned to another employee/);

    // Updating emp1 with its own employee number should succeed
    await asAdmin.mutation(api.employees.update, {
      workspaceId: ws,
      employeeId: emp1Id,
      employeeIdNumber: "EMP001",
      firstName: "UpdatedEmp1",
    });

    const emp1 = await asAdmin.query(api.employees.getById, {
      workspaceId: ws,
      employeeId: emp1Id,
    });
    expect(emp1.firstName).toBe("UpdatedEmp1");
    expect(emp1.employeeIdNumber).toBe("EMP001");
  });

  test("Defect 4: Legacy records with missing fields return undefined gracefully", async () => {
    const t = convexTest(schema, modules);
    const { ws, admin } = await seedEmployeeTestWorkspace(t);
    const asAdmin = t.withIdentity(as(admin));

    // Legacy employee record with no employeeIdNumber or joiningDate
    const legacyEmpId = await t.run(async (ctx: MutationCtx) => {
      return ctx.db.insert("employees", {
        workspaceId: ws,
        firstName: "Old",
        lastName: "Legacy",
        email: "legacy.user@testcompany.com",
        status: "active",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    });

    const emp = await asAdmin.query(api.employees.getById, {
      workspaceId: ws,
      employeeId: legacyEmpId,
    });

    expect(emp.employeeIdNumber).toBeUndefined();
    expect(emp.joiningDate).toBeUndefined();

    const list = await asAdmin.query(api.employees.list, { workspaceId: ws });
    const legacyInList = list.find((e) => e._id === legacyEmpId);
    expect(legacyInList?.employeeIdNumber).toBeUndefined();
    expect(legacyInList?.joiningDate).toBeUndefined();
  });
});

