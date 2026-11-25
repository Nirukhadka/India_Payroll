import { convexTest } from "convex-test";
import { describe, expect, test } from "vitest";
import { api } from "./_generated/api";
import type { Id, MutationCtx } from "./_generated/dataModel";
import schema from "./schema";

// Discover function modules for convex-test (includes _generated, excludes *.test.ts).
const modules: Record<string, () => Promise<any>> =
  typeof (import.meta as any).glob === "function"
    ? (import.meta as any).glob(["./**/*.*s", "!./**/*.test.*"])
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
        "./employees.ts": () => import("./employees"),
        "./leaves.ts": () => import("./leaves"),
        "./lop.ts": () => import("./lop"),
        "./payroll.ts": () => import("./payroll"),
        "./salaries.ts": () => import("./salaries"),
        "./statutory.ts": () => import("./statutory"),
        "./devAccounts.ts": () => import("./devAccounts"),
        "./devAccountsMutation.ts": () => import("./devAccountsMutation"),
        "./statutoryReports.ts": () => import("./statutoryReports"),
        "./epfoEcr.ts": () => import("./epfoEcr"),
        "./form138Tds.ts": () => import("./form138Tds"),
        "./declarations.ts": () => import("./declarations"),
        "./professionalTax.ts": () => import("./professionalTax"),
        "./lwf.ts": () => import("./lwf"),
        "./statutoryTds.ts": () => import("./statutoryTds"),
        "./payrollLifecycle.ts": () => import("./payrollLifecycle"),
        "./_generated/api.js": () => import("./_generated/api.js"),
        "./_generated/server.js": () => import("./_generated/server.js"),
      };

const as = (userId: string) => ({ subject: `${userId}|sess_${userId}` });

describe("Full IndiaPay End-to-End Payroll Lifecycle & Immutability Audit", () => {
  test("Complete workflow: employee setup → salary → attendance → payroll calculation → approval/finalization → payslip → reports → immutability verification", async () => {
    const t = convexTest(schema, modules);

    // 1. Setup Workspace, Owner, Admin, and Employee users
    let ownerId!: Id<"users">;
    let adminId!: Id<"users">;
    let empUserId!: Id<"users">;
    let wsId!: Id<"workspaces">;

    await t.run(async (ctx: MutationCtx) => {
      ownerId = await ctx.db.insert("users", {
        name: "Corporate Owner",
        email: "owner@indiapay.com",
      });
      adminId = await ctx.db.insert("users", {
        name: "Payroll Admin",
        email: "admin@indiapay.com",
      });
      empUserId = await ctx.db.insert("users", {
        name: "Vikram Malhotra",
        email: "vikram@indiapay.com",
      });

      wsId = await ctx.db.insert("workspaces", {
        name: "IndiaPay Enterprises Pvt Ltd",
        ownerId,
        createdAt: Date.now(),
      });

      await ctx.db.insert("members", {
        workspaceId: wsId,
        userId: ownerId,
        role: "owner",
        createdAt: Date.now(),
      });

      await ctx.db.insert("members", {
        workspaceId: wsId,
        userId: adminId,
        role: "admin",
        createdAt: Date.now(),
      });

      await ctx.db.insert("members", {
        workspaceId: wsId,
        userId: empUserId,
        role: "member",
        createdAt: Date.now(),
      });

      // Configure comprehensive Workspace Compliance
      await ctx.db.insert("workspaceCompliance", {
        workspaceId: wsId,
        epfEnabled: true,
        epfWageCeiling: 15000,
        epfRestrictToCeiling: true,
        epsEnabled: true,
        epsWageCeiling: 15000,
        edliEnabled: true,
        adminChargesEnabled: true,
        esiEnabled: true,
        esiWageCeiling: 21000,
        ptEnabled: true,
        ptState: "Karnataka",
        lwfEnabled: true,
        lwfState: "Karnataka",
        tan: "BLRK12345A",
        employerPan: "AABCI1234F",
        deductorType: "company",
        responsiblePersonName: "Corporate Owner",
        responsiblePersonPan: "ABCDE1234F",
        responsiblePersonDesignation: "Managing Director",
        responsiblePersonEmail: "owner@indiapay.com",
        responsiblePersonMobile: "9876543210",
        responsiblePersonAddress: "Koramangala, Bengaluru",
        updatedAt: Date.now(),
      });
    });

    const asOwner = t.withIdentity(as(ownerId));
    const asAdmin = t.withIdentity(as(adminId));
    const asEmp = t.withIdentity(as(empUserId));

    // 2. Employee Setup: Create employee with banking & statutory details
    const empId = await asAdmin.mutation(api.employees.add, {
      workspaceId: wsId,
      firstName: "Vikram",
      lastName: "Malhotra",
      email: "vikram@indiapay.com",
      phone: "9876543211",
      department: "Engineering",
      designation: "Senior Software Engineer",
      bankAccountHolderName: "Vikram Malhotra",
      bankName: "HDFC Bank",
      bankAccountNumber: "50100234567890",
      ifscCode: "HDFC0001234",
      pan: "ABCDE1234F",
      uan: "100987654321",
      pfMemberId: "KN/BNG/0012345/000/0000101",
      esicIpNumber: "3123456789",
    });

    // Link user account to employee record
    await t.run(async (ctx: MutationCtx) => {
      await ctx.db.patch(empId, { userId: empUserId });
    });

    // 3. Salary Structure Setup
    await asAdmin.mutation(api.salaries.add, {
      workspaceId: wsId,
      employeeId: empId,
      basicSalary: 50000,
      allowances: [
        { name: "House Rent Allowance", amount: 20000 },
        { name: "Special Allowance", amount: 10000 },
      ],
      deductions: [],
      effectiveDate: Date.now(),
    });

    // 4. Configure Employee Compliance Profile (New Tax Regime, Voluntary EPF on actual basic)
    await asAdmin.mutation(api.compliance.updateEmployeeCompliance, {
      workspaceId: wsId,
      employeeId: empId,
      taxRegime: "new",
      epfOptOut: false,
      epfOnActualBasic: false, // restrict to statutory 15k ceiling
    });

    // 5. Attendance & Leave (1 day Unpaid Leave / LOP in April 2026)
    await asAdmin.mutation(api.attendance.mark, {
      workspaceId: wsId,
      employeeId: empId,
      date: "2026-04-15",
      status: "unpaid_leave",
      remarks: "Personal emergency",
    });

    // 6. Preview Payroll Run for 2026-04 (April has 30 days)
    const preview = await asAdmin.query(api.payroll.calculatePreview, {
      workspaceId: wsId,
      periodMonth: "2026-04",
    });

    expect(preview.totalEmployees).toBe(1);
    const pItem = preview.items[0]!;
    expect(pItem.grossSalary).toBe(80000); // 50k + 20k + 10k
    expect(pItem.lopDays).toBe(1);
    // LOP deduction: 80,000 / 30 * 1 = ₹2,666.67
    expect(Math.round(pItem.lopDeduction)).toBe(2667);

    // Statutory deductions:
    // EPF employee share: 12% of 15,000 ceiling = ₹1,800
    const epfDed = pItem.statutoryDeductions.find((d) =>
      d.name.includes("Provident Fund"),
    );
    expect(epfDed?.amount).toBe(1800);

    // ESI employee share: Gross > ₹21,000 ceiling -> ₹0 ESI
    const esiDed = pItem.statutoryDeductions.find((d) =>
      d.name.includes("ESI"),
    );
    expect(esiDed?.amount).toBe(0);

    // Professional Tax Karnataka: Gross >= ₹25,000 -> ₹200
    const ptDed = pItem.statutoryDeductions.find((d) =>
      d.name.includes("Professional Tax"),
    );
    expect(ptDed?.amount).toBe(200);

    // 7. Process Payroll Run (Status: "calculated")
    const payrollRunId = await asAdmin.mutation(api.payroll.createRun, {
      workspaceId: wsId,
      periodMonth: "2026-04",
    });

    const runDetails = await asAdmin.query(api.payroll.getRunDetails, {
      workspaceId: wsId,
      payrollRunId,
    });
    expect(runDetails.run.status).toBe("calculated");

    // 8. Maker-Checker Enforcement:
    // Admin submits for approval
    await asAdmin.mutation(api.payroll.submitForApproval, {
      workspaceId: wsId,
      payrollRunId,
    });

    // Submitter (Admin) CAN approve their own run with full admin access
    await asAdmin.mutation(api.payroll.approveRun, {
      workspaceId: wsId,
      payrollRunId,
    });

    // Finalize run
    await asOwner.mutation(api.payroll.finalizeRun, {
      workspaceId: wsId,
      payrollRunId,
    });

    const finalizedRun = await asAdmin.query(api.payroll.getRunDetails, {
      workspaceId: wsId,
      payrollRunId,
    });
    expect(finalizedRun.run.status).toBe("processed");
    const originalNetSalary = finalizedRun.run.totalNetSalary;
    const originalGrossSalary = finalizedRun.run.totalGrossSalary;

    // 9. Payslip Access Control:
    // Plain employee can query their own finalized payslip
    const myPayslip = await asEmp.query(api.payroll.getPayslip, {
      workspaceId: wsId,
      payrollRunId,
      employeeId: empId,
    });
    expect(myPayslip.employeeName).toBe("Vikram Malhotra");
    expect(myPayslip.maskedPan).toBe("••••••234F");
    expect(myPayslip.maskedBankAccountNumber).toBe("••••••••••7890");

    // Another plain employee cannot query Vikram's payslip (IDOR check)
    let outsiderUserId!: Id<"users">;
    await t.run(async (ctx: MutationCtx) => {
      outsiderUserId = await ctx.db.insert("users", {
        name: "Other Employee",
        email: "other@indiapay.com",
      });
      await ctx.db.insert("members", {
        workspaceId: wsId,
        userId: outsiderUserId,
        role: "member",
        createdAt: Date.now(),
      });
    });
    const asOutsider = t.withIdentity(as(outsiderUserId));

    await expect(
      asOutsider.query(api.payroll.getPayslip, {
        workspaceId: wsId,
        payrollRunId,
        employeeId: empId,
      }),
    ).rejects.toThrow("Forbidden: You can only view your own payslip");

    // 10. Statutory Reports Generation:
    // A. EPFO ECR Export
    const ecrPreview = await asAdmin.query(api.epfoEcr.previewEpfoEcrExport, {
      workspaceId: wsId,
      payrollRunId,
    });
    expect(ecrPreview.success).toBe(true);
    expect(ecrPreview.totalRecords).toBe(1);
    expect(ecrPreview.fileContent).toContain("100987654321#~#VIKRAM MALHOTRA");

    // B. TDS Form 138 Export & Challan Reconciliation
    // Add ITNS 281 Challan for April TDS
    await asAdmin.mutation(api.form138Tds.saveTdsChallan, {
      workspaceId: wsId,
      financialYear: "2026-27",
      quarter: "Q1",
      bsrCode: "0210001",
      depositDate: "2026-05-07",
      challanSerialNumber: "00050",
      minorHead: "200",
      taxAmount: 5000,
    });

    const tdsPreview = await asAdmin.query(api.form138Tds.previewQuarterlyTds, {
      workspaceId: wsId,
      financialYear: "2026-27",
      quarter: "Q1",
    });
    expect(tdsPreview.success).toBe(true);
    expect(tdsPreview.isForm138).toBe(true);
    expect(tdsPreview.fileContent).toContain("SL1");
    expect(tdsPreview.csvContent).toContain(
      "INTERNAL AUDIT RECONCILIATION REPORT",
    );

    // 11. Immutability Verification:
    // Change salary structure and add a new employee for future months
    await asAdmin.mutation(api.salaries.add, {
      workspaceId: wsId,
      employeeId: empId,
      basicSalary: 90000, // Massive hike from 50k to 90k
      allowances: [],
      deductions: [],
      effectiveDate: Date.now() + 10000,
    });

    await asAdmin.mutation(api.employees.add, {
      workspaceId: wsId,
      firstName: "New",
      lastName: "Joiner",
      email: "joiner@indiapay.com",
    });

    // Check that historical finalized 2026-04 payroll has NOT changed!
    const reCheckedRun = await asAdmin.query(api.payroll.getRunDetails, {
      workspaceId: wsId,
      payrollRunId,
    });
    expect(reCheckedRun.run.totalEmployees).toBe(1);
    expect(reCheckedRun.run.totalNetSalary).toBe(originalNetSalary);
    expect(reCheckedRun.run.totalGrossSalary).toBe(originalGrossSalary);

    const reCheckedItem = reCheckedRun.items[0]!;
    expect(reCheckedItem.basicSalary).toBe(50000); // Retained original 50,000, not hiked 90,000
    expect(reCheckedItem.grossSalary).toBe(80000);
  });

  test("Phase 4: Financial Integrity, Settlement Evidence, Partial Payments & Audit Trail", async () => {
    const t = convexTest(schema, modules);

    let ownerId!: Id<"users">;
    let adminId!: Id<"users">;
    let unauthorizedUserId!: Id<"users">;
    let wsId!: Id<"workspaces">;
    let otherWsId!: Id<"workspaces">;
    let emp1Id!: Id<"employees">;
    let emp2Id!: Id<"employees">;

    await t.run(async (ctx: MutationCtx) => {
      ownerId = await ctx.db.insert("users", {
        name: "Fin Owner",
        email: "finowner@indiapay.com",
      });
      adminId = await ctx.db.insert("users", {
        name: "Fin Admin",
        email: "finadmin@indiapay.com",
      });
      unauthorizedUserId = await ctx.db.insert("users", {
        name: "Sneaky User",
        email: "sneaky@other.com",
      });

      wsId = await ctx.db.insert("workspaces", {
        name: "Fintech Corp India",
        ownerId,
        createdAt: Date.now(),
      });

      otherWsId = await ctx.db.insert("workspaces", {
        name: "Competitor Corp",
        ownerId: unauthorizedUserId,
        createdAt: Date.now(),
      });

      await ctx.db.insert("members", {
        workspaceId: wsId,
        userId: ownerId,
        role: "owner",
        createdAt: Date.now(),
      });
      await ctx.db.insert("members", {
        workspaceId: wsId,
        userId: adminId,
        role: "admin",
        createdAt: Date.now(),
      });
      await ctx.db.insert("members", {
        workspaceId: otherWsId,
        userId: unauthorizedUserId,
        role: "owner",
        createdAt: Date.now(),
      });

      emp1Id = await ctx.db.insert("employees", {
        workspaceId: wsId,
        firstName: "Aarav",
        lastName: "Patel",
        email: "aarav@fintech.in",
        employeeIdNumber: "EMP-001",
        status: "active",
        bankAccountNumber: "987654321098",
        bankName: "HDFC Bank",
        ifscCode: "HDFC0000123",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      emp2Id = await ctx.db.insert("employees", {
        workspaceId: wsId,
        firstName: "Diya",
        lastName: "Sharma",
        email: "diya@fintech.in",
        employeeIdNumber: "EMP-002",
        status: "active",
        bankAccountNumber: "123456789012",
        bankName: "ICICI Bank",
        ifscCode: "ICIC0000456",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    });

    const asAdmin = t.withIdentity(as(adminId));
    const asUnauthorized = t.withIdentity(as(unauthorizedUserId));

    // Create an approved payroll run with 2 payroll items
    let payrollRunId!: Id<"payrollRuns">;
    let item1Id!: Id<"payrollItems">;
    let item2Id!: Id<"payrollItems">;

    await t.run(async (ctx: MutationCtx) => {
      payrollRunId = await ctx.db.insert("payrollRuns", {
        workspaceId: wsId,
        periodMonth: "2026-05",
        startDate: "2026-05-01",
        endDate: "2026-05-31",
        status: "approved",
        totalEmployees: 2,
        totalGrossSalary: 150000,
        totalLopDeduction: 0,
        totalCustomDeductions: 0,
        totalStatutoryDeductions: 10000,
        totalNetSalary: 140000,
        createdById: adminId,
        approvedAt: Date.now(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      item1Id = await ctx.db.insert("payrollItems", {
        workspaceId: wsId,
        payrollRunId,
        employeeId: emp1Id,
        basicSalary: 60000,
        allowances: [
          { name: "HRA", amount: 25000 },
          { name: "Special Allowance", amount: 15000 },
        ],
        grossSalary: 100000,
        lopDays: 0,
        lopDeduction: 0,
        customDeductions: [],
        totalCustomDeductions: 0,
        statutoryDeductions: [
          { name: "Provident Fund", amount: 1800, isConfigured: true },
          { name: "Professional Tax", amount: 200, isConfigured: true },
          { name: "TDS", amount: 5000, isConfigured: true },
        ],
        totalStatutoryDeductions: 7000,
        employerContributions: [],
        totalDeductions: 7000,
        netSalary: 93000,
        hasSalaryStructure: true,
        warnings: [],
        remainingBalance: 93000,
        amountPaid: 0,
        paymentStatus: "PENDING",
        paymentMode: "bank_transfer",
        createdAt: Date.now(),
      });

      item2Id = await ctx.db.insert("payrollItems", {
        workspaceId: wsId,
        payrollRunId,
        employeeId: emp2Id,
        basicSalary: 30000,
        allowances: [
          { name: "HRA", amount: 12000 },
          { name: "Special Allowance", amount: 8000 },
        ],
        grossSalary: 50000,
        lopDays: 0,
        lopDeduction: 0,
        customDeductions: [],
        totalCustomDeductions: 0,
        statutoryDeductions: [
          { name: "Provident Fund", amount: 1800, isConfigured: true },
          { name: "Professional Tax", amount: 200, isConfigured: true },
          { name: "TDS", amount: 1000, isConfigured: true },
        ],
        totalStatutoryDeductions: 3000,
        employerContributions: [],
        totalDeductions: 3000,
        netSalary: 47000,
        hasSalaryStructure: true,
        warnings: [],
        remainingBalance: 47000,
        amountPaid: 0,
        paymentStatus: "PENDING",
        paymentMode: "bank_transfer",
        createdAt: Date.now(),
      });
    });

    // 1. Mandatory Evidence Reference Requirement
    await expect(
      asAdmin.mutation(api.payrollLifecycle.recordPaymentSettlement, {
        workspaceId: wsId,
        payrollItemId: item1Id,
        targetStatus: "PAID",
        paymentAmount: 93000,
        paymentMode: "bank_transfer",
        evidenceReference: "", // Empty evidence rejected
      })
    ).rejects.toThrow("verified settlement evidence reference");

    // 2. Partial Payment Transition (PARTIALLY_PAID)
    const partResult = await asAdmin.mutation(api.payrollLifecycle.recordPaymentSettlement, {
      workspaceId: wsId,
      payrollItemId: item1Id,
      targetStatus: "PARTIALLY_PAID",
      paymentAmount: 50000,
      paymentMode: "bank_transfer",
      evidenceReference: "NEFT-PARTIAL-001",
    });
    expect(partResult.success).toBe(true);
    expect(partResult.status).toBe("PARTIALLY_PAID");
    expect(partResult.amountPaid).toBe(50000);
    expect(partResult.remainingBalance).toBe(43000);

    // 3. Complete Final Settlement with Bank UTR (PAID)
    const fullResult = await asAdmin.mutation(api.payrollLifecycle.recordPaymentSettlement, {
      workspaceId: wsId,
      payrollItemId: item1Id,
      targetStatus: "PAID",
      paymentAmount: 43000,
      paymentMode: "bank_transfer",
      evidenceReference: "HDFC-UTR-99887766",
    });
    expect(fullResult.success).toBe(true);
    expect(fullResult.status).toBe("PAID");
    expect(fullResult.amountPaid).toBe(93000);
    expect(fullResult.remainingBalance).toBe(0);

    // 4. Duplicate Payment Prevention on already PAID item
    await expect(
      asAdmin.mutation(api.payrollLifecycle.recordPaymentSettlement, {
        workspaceId: wsId,
        payrollItemId: item1Id,
        targetStatus: "PAID",
        paymentAmount: 1000,
        paymentMode: "bank_transfer",
        evidenceReference: "HDFC-UTR-NEW-000",
      })
    ).rejects.toThrow("already fully PAID");

    // 5. Duplicate Reference Protection across different employees
    await expect(
      asAdmin.mutation(api.payrollLifecycle.recordPaymentSettlement, {
        workspaceId: wsId,
        payrollItemId: item2Id,
        targetStatus: "PAID",
        paymentAmount: 47000,
        paymentMode: "bank_transfer",
        evidenceReference: "HDFC-UTR-99887766", // Already used for item1!
      })
    ).rejects.toThrow("Duplicate payment reference detected");

    // 6. Settle item 2 successfully with distinct UTR
    const emp2Result = await asAdmin.mutation(api.payrollLifecycle.recordPaymentSettlement, {
      workspaceId: wsId,
      payrollItemId: item2Id,
      targetStatus: "PAID",
      paymentAmount: 47000,
      paymentMode: "bank_transfer",
      evidenceReference: "ICIC-UTR-11223344",
    });
    expect(emp2Result.status).toBe("PAID");
    expect(emp2Result.remainingBalance).toBe(0);

    // 7. Settlement Audit History Verification
    await t.run(async (ctx: MutationCtx) => {
      const logs = await ctx.db
        .query("payrollSettlementAuditLogs")
        .withIndex("by_workspace", (q) => q.eq("workspaceId", wsId))
        .collect();
      // Should have 3 logs: 1 partial + 1 full for item1, 1 full for item2
      expect(logs.length).toBe(3);
      expect(logs.some((l) => l.evidenceReference === "NEFT-PARTIAL-001")).toBe(true);
      expect(logs.some((l) => l.evidenceReference === "HDFC-UTR-99887766")).toBe(true);
      expect(logs.some((l) => l.evidenceReference === "ICIC-UTR-11223344")).toBe(true);
    });

    // 8. Bank Payout Summary Aggregations & Account Number Masking
    const payoutSummary = await asAdmin.query(api.payrollLifecycle.getBankPayoutSummary, {
      workspaceId: wsId,
      periodMonth: "2026-05",
    });
    expect(payoutSummary.hasRun).toBe(true);
    expect(payoutSummary.totalNetPayout).toBe(140000);
    expect(payoutSummary.bankTransferTotal).toBe(140000);
    expect(payoutSummary.statusCounts.PAID).toBe(2);
    expect(payoutSummary.records.length).toBe(2);

    const record1 = payoutSummary.records.find((r) => r.employeeCode === "EMP-001");
    expect(record1).toBeDefined();
    expect(record1!.bankAccountNumberMasked).toBe("••••••••1098"); // Masked for privacy
    expect(record1!.bankAccountNumberRaw).toBe("987654321098");
    expect(record1!.ifscCode).toBe("HDFC0000123");

    // 9. Strict Authorization and Cross-Tenant Security Checks
    await expect(
      asUnauthorized.query(api.payrollLifecycle.getBankPayoutSummary, {
        workspaceId: wsId, // unauthorized user accessing other tenant
        periodMonth: "2026-05",
      })
    ).rejects.toThrow();

    await expect(
      asUnauthorized.mutation(api.payrollLifecycle.recordPaymentSettlement, {
        workspaceId: wsId,
        payrollItemId: item1Id,
        targetStatus: "PAID",
        paymentAmount: 5000,
        paymentMode: "bank_transfer",
        evidenceReference: "MALICIOUS-REF-001",
      })
    ).rejects.toThrow();
  });
});
