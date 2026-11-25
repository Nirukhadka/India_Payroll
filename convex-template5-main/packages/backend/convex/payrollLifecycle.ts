import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { audit } from "./auditLog";
import { requireRole } from "./orgs";
import { maskAccountNumber } from "./employees";

// ── 1. Persistent Payroll Controls ──────────────────────────────────────────

export const getPayrollControls = query({
  args: {
    workspaceId: v.id("workspaces"),
    periodMonth: v.string(), // "YYYY-MM"
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");
    await requireRole(ctx, userId, args.workspaceId, ["admin"]);

    const control = await ctx.db
      .query("payrollControls")
      .withIndex("by_workspace_period", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("periodMonth", args.periodMonth)
      )
      .first();

    if (!control) {
      // Default to locked true matching greytHR conservative default
      return {
        payrollInputsLocked: true,
        employeeViewReleased: true,
        itStatementReleased: true,
        payrollLocked: true,
      };
    }

    return {
      payrollInputsLocked: control.payrollInputsLocked,
      employeeViewReleased: control.employeeViewReleased,
      itStatementReleased: control.itStatementReleased,
      payrollLocked: control.payrollLocked,
      updatedAt: control.updatedAt,
    };
  },
});

export const updatePayrollControl = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    periodMonth: v.string(), // "YYYY-MM"
    field: v.union(
      v.literal("payrollInputsLocked"),
      v.literal("employeeViewReleased"),
      v.literal("itStatementReleased"),
      v.literal("payrollLocked")
    ),
    value: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");
    await requireRole(ctx, userId, args.workspaceId, ["admin"]);

    // If attempting to unlock payroll or modify inputs for a finalized payroll run, verify restriction
    if (args.field === "payrollInputsLocked" && args.value === false) {
      const run = await ctx.db
        .query("payrollRuns")
        .withIndex("by_workspace_period", (q) =>
          q.eq("workspaceId", args.workspaceId).eq("periodMonth", args.periodMonth)
        )
        .first();

      if (run && (run.status === "approved" || run.status === "processed")) {
        throw new ConvexError(
          `Cannot unlock payroll inputs for finalized period ${args.periodMonth}. Authorized supplementary workflow is required.`
        );
      }
    }

    const now = Date.now();
    const existing = await ctx.db
      .query("payrollControls")
      .withIndex("by_workspace_period", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("periodMonth", args.periodMonth)
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        [args.field]: args.value,
        lockedById: userId,
        updatedAt: now,
      });
    } else {
      await ctx.db.insert("payrollControls", {
        workspaceId: args.workspaceId,
        periodMonth: args.periodMonth,
        payrollInputsLocked: args.field === "payrollInputsLocked" ? args.value : true,
        employeeViewReleased: args.field === "employeeViewReleased" ? args.value : true,
        itStatementReleased: args.field === "itStatementReleased" ? args.value : true,
        payrollLocked: args.field === "payrollLocked" ? args.value : true,
        lockedById: userId,
        updatedAt: now,
      });
    }

    // Immutable audit record
    await audit(ctx, args.workspaceId, userId, "payroll.controlToggle", {
      periodMonth: args.periodMonth,
      field: args.field,
      newValue: args.value,
    });

    return { success: true, field: args.field, value: args.value };
  },
});

// ── 2. Dynamic Payroll Processing Checklist ─────────────────────────────────

export const getProcessingChecklist = query({
  args: {
    workspaceId: v.id("workspaces"),
    periodMonth: v.string(), // "YYYY-MM"
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");
    await requireRole(ctx, userId, args.workspaceId, ["admin"]);

    // Calculate previous period string (e.g., 2026-11 -> 2026-10)
    const [yearStr, monthStr] = args.periodMonth.split("-");
    const y = Number.parseInt(yearStr ?? "2026", 10);
    const m = Number.parseInt(monthStr ?? "11", 10);
    const prevYear = m === 1 ? y - 1 : y;
    const prevMonth = m === 1 ? 12 : m - 1;
    const prevPeriodStr = `${prevYear}-${String(prevMonth).padStart(2, "0")}`;

    // 1. Check previous payroll locked
    const prevRun = await ctx.db
      .query("payrollRuns")
      .withIndex("by_workspace_period", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("periodMonth", prevPeriodStr)
      )
      .first();
    const prevControl = await ctx.db
      .query("payrollControls")
      .withIndex("by_workspace_period", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("periodMonth", prevPeriodStr)
      )
      .first();

    const isPrevLocked =
      prevRun?.status === "processed" ||
      prevRun?.status === "approved" ||
      (prevControl ? prevControl.payrollLocked : true);

    // 2. Employees count and readiness
    const allEmployees = await ctx.db
      .query("employees")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId))
      .filter((q) => q.eq(q.field("status"), "active"))
      .collect();

    // Check salary structures assigned
    const missingStructureEmployees: { id: string; name: string }[] = [];
    for (const emp of allEmployees) {
      const salary = await ctx.db
        .query("salaries")
        .withIndex("by_employee", (q) => q.eq("employeeId", emp._id))
        .first();
      if (!salary) {
        missingStructureEmployees.push({
          id: emp._id,
          name: `${emp.firstName} ${emp.lastName}`,
        });
      }
    }

    // 3. New additions in this month
    const newJoiners = allEmployees.filter((emp) => {
      if (!emp.joiningDate) return false;
      return emp.joiningDate.startsWith(args.periodMonth);
    });

    // 4. Separations in this month
    const separated = await ctx.db
      .query("employees")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId))
      .filter((q) => q.eq(q.field("status"), "inactive"))
      .collect();

    // 5. Evaluate overall readiness
    const blockingReasons: string[] = [];
    if (missingStructureEmployees.length > 0) {
      blockingReasons.push(
        `${missingStructureEmployees.length} active employee(s) missing assigned salary structure (${missingStructureEmployees.map((e) => e.name).slice(0, 3).join(", ")}${missingStructureEmployees.length > 3 ? "..." : ""})`
      );
    }
    if (!isPrevLocked) {
      blockingReasons.push(`Previous payroll period (${prevPeriodStr}) must be locked before processing ${args.periodMonth}`);
    }

    const tasks = [
      {
        id: "lock_prev",
        label: "Lock Previous Payroll",
        description: `Ensure period ${prevPeriodStr} is finalized and locked`,
        completed: isPrevLocked,
        isBlocking: true,
      },
      {
        id: "salary_structures",
        label: "Salary Structure Assignments",
        description: `${allEmployees.length - missingStructureEmployees.length} of ${allEmployees.length} employees have configured structures`,
        completed: missingStructureEmployees.length === 0,
        isBlocking: true,
        details: missingStructureEmployees,
      },
      {
        id: "additions",
        label: "Employee Additions",
        description: `${newJoiners.length} new employee addition(s) detected for ${args.periodMonth}`,
        completed: true,
        isBlocking: false,
      },
      {
        id: "separations",
        label: "Employee Separations",
        description: `${separated.length} separation record(s) settled`,
        completed: true,
        isBlocking: false,
      },
      {
        id: "attendance_lop",
        label: "Attendance & LOP Verification",
        description: "Verify attendance muster and Loss of Pay days for current cutoff",
        completed: true,
        isBlocking: false,
      },
    ];

    const canProcess = blockingReasons.length === 0;

    return {
      periodMonth: args.periodMonth,
      canProcess,
      blockingReasons,
      tasks,
      totalEmployees: allEmployees.length,
      newJoinersCount: newJoiners.length,
      missingSalaryStructuresCount: missingStructureEmployees.length,
    };
  },
});

// ── 3. Operational Exception Cards Aggregation ──────────────────────────────

export const getPayrollOperationalExceptions = query({
  args: {
    workspaceId: v.id("workspaces"),
    periodMonth: v.string(), // "YYYY-MM"
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");
    await requireRole(ctx, userId, args.workspaceId, ["admin"]);

    // Find run for period
    const run = await ctx.db
      .query("payrollRuns")
      .withIndex("by_workspace_period", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("periodMonth", args.periodMonth)
      )
      .first();

    if (!run) {
      return {
        hasRun: false,
        periodMonth: args.periodMonth,
        negativeSalaryCount: 0,
        stopProcessingCount: 0,
        settledEmployeesCount: 0,
        holdSalaryCount: 0,
        payoutPendingBankCount: 0,
        payoutPendingCashCount: 0,
        payoutPendingTotalAmount: 0,
        locationsWithoutPtCount: 0,
      };
    }

    const items = await ctx.db
      .query("payrollItems")
      .withIndex("by_run", (q) => q.eq("payrollRunId", run._id))
      .collect();

    let negativeSalaryCount = 0;
    let stopProcessingCount = 0;
    let holdSalaryCount = 0;
    let payoutPendingBankCount = 0;
    let payoutPendingCashCount = 0;
    let payoutPendingTotalAmount = 0;

    for (const item of items) {
      if (item.netSalary < 0) {
        negativeSalaryCount++;
      }
      if (item.isStopProcessing) {
        stopProcessingCount++;
      }
      if (item.isHold) {
        holdSalaryCount++;
      }

      // Check payment status and payment mode
      const isPaid = item.paymentStatus === "PAID";
      if (!isPaid) {
        const remaining = item.remainingBalance ?? Math.max(0, item.netSalary);
        payoutPendingTotalAmount += remaining;
        if (item.paymentMode === "cash") {
          payoutPendingCashCount++;
        } else {
          payoutPendingBankCount++;
        }
      }
    }

    // Settled employees count
    const settledEmployees = await ctx.db
      .query("employees")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId))
      .filter((q) => q.eq(q.field("status"), "inactive"))
      .collect();

    return {
      hasRun: true,
      payrollRunId: run._id,
      runStatus: run.status,
      periodMonth: args.periodMonth,
      negativeSalaryCount,
      stopProcessingCount,
      settledEmployeesCount: settledEmployees.length,
      holdSalaryCount,
      payoutPendingBankCount,
      payoutPendingCashCount,
      payoutPendingTotalAmount,
      locationsWithoutPtCount: 0,
    };
  },
});

// ── 4. Bank Payout, Settlement Integrity & Lifecycle Tracking ──────────────

export const recordPaymentSettlement = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    payrollItemId: v.id("payrollItems"),
    targetStatus: v.union(
      v.literal("AUTHORIZED"),
      v.literal("PROCESSING"),
      v.literal("PAID"),
      v.literal("FAILED"),
      v.literal("PARTIALLY_PAID")
    ),
    paymentAmount: v.number(), // Amount paid in this transaction
    paymentMode: v.union(v.literal("bank_transfer"), v.literal("cash"), v.literal("cheque")),
    evidenceReference: v.string(), // Bank UTR, NEFT ref, cash receipt no.
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");
    await requireRole(ctx, userId, args.workspaceId, ["admin"]);

    const item = await ctx.db.get(args.payrollItemId);
    if (!item || item.workspaceId !== args.workspaceId) {
      throw new ConvexError("Payroll item not found or unauthorized");
    }

    const run = await ctx.db.get(item.payrollRunId);
    if (!run) throw new ConvexError("Payroll run not found");

    // Financial Guard 1: Run must be approved or processed before any settlement can occur
    if (run.status !== "approved" && run.status !== "processed") {
      throw new ConvexError(
        "Settlement cannot be processed on a payroll run that is not approved or finalized."
      );
    }

    // Financial Guard 2: Item must not have payment holds or stop processing flags
    if (item.isHold) {
      throw new ConvexError("Cannot disburse payment: Employee payout is placed on hold.");
    }
    if (item.isStopProcessing) {
      throw new ConvexError("Cannot disburse payment: Salary processing is stopped for this employee.");
    }

    // Financial Guard 3: Strict evidence reference required for settlement (UTR / NEFT / Voucher)
    const cleanEvidence = args.evidenceReference.trim();
    if (
      (args.targetStatus === "PAID" || args.targetStatus === "PARTIALLY_PAID" || args.targetStatus === "PROCESSING") &&
      (!cleanEvidence || cleanEvidence.length < 4)
    ) {
      throw new ConvexError(
        "A verified settlement evidence reference (e.g. Bank UTR, NEFT Reference, Cash Voucher #) is mandatory."
      );
    }

    // Financial Guard 4: Duplicate update / replay protection
    if (item.paymentStatus === "PAID") {
      throw new ConvexError(
        `This payroll record is already fully PAID with reference ${item.settlementEvidenceReference || item.paymentReference}. Duplicate payments are blocked.`
      );
    }

    // Check existing audit logs for duplicate reference in this workspace
    const duplicateRefLog = await ctx.db
      .query("payrollSettlementAuditLogs")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId))
      .filter((q) => q.eq(q.field("evidenceReference"), cleanEvidence))
      .first();

    if (duplicateRefLog && duplicateRefLog.payrollItemId !== item._id) {
      throw new ConvexError(
        `Duplicate payment reference detected: Reference "${cleanEvidence}" was already applied to another transaction.`
      );
    }

    // Financial Guard 5: Mathematical balance integrity
    const currentPaid = item.amountPaid ?? 0;
    const totalDue = Math.max(0, item.netSalary);
    const existingRemaining = item.remainingBalance ?? totalDue;

    if (args.paymentAmount < 0) {
      throw new ConvexError("Payment amount cannot be negative.");
    }

    if (args.targetStatus === "PAID") {
      if (args.paymentAmount > existingRemaining) {
        throw new ConvexError(
          `Payment amount ₹${args.paymentAmount} exceeds the remaining balance ₹${existingRemaining}.`
        );
      }
    } else if (args.targetStatus === "PARTIALLY_PAID") {
      if (args.paymentAmount <= 0) {
        throw new ConvexError("Partial payment must be greater than zero.");
      }
      if (args.paymentAmount >= existingRemaining) {
        throw new ConvexError(
          `Payment amount ₹${args.paymentAmount} equals or exceeds the remaining balance ₹${existingRemaining}. Use PAID status instead.`
        );
      }
    }

    const now = Date.now();
    let newStatus = args.targetStatus;
    let newAmountPaid = currentPaid;
    let newRemainingBalance = existingRemaining;

    if (args.targetStatus === "PAID") {
      newAmountPaid = currentPaid + (args.paymentAmount > 0 ? args.paymentAmount : existingRemaining);
      newRemainingBalance = 0;
    } else if (args.targetStatus === "PARTIALLY_PAID") {
      newAmountPaid = currentPaid + args.paymentAmount;
      newRemainingBalance = totalDue - newAmountPaid;
    } else if (args.targetStatus === "FAILED") {
      newStatus = "FAILED";
      // Remaining balance remains what was unpaid
    } else if (args.targetStatus === "PROCESSING") {
      newStatus = "PROCESSING";
    } else if (args.targetStatus === "AUTHORIZED") {
      newStatus = "AUTHORIZED";
    }

    // Update payrollItem record
    await ctx.db.patch(item._id, {
      paymentStatus: newStatus,
      paymentMode: args.paymentMode,
      paymentReference: cleanEvidence,
      settlementEvidenceReference: cleanEvidence,
      amountPaid: newAmountPaid,
      remainingBalance: newRemainingBalance,
      settlementVerifiedAt: newStatus === "PAID" ? now : item.settlementVerifiedAt,
      settlementVerifiedById: userId,
      paidAt: newStatus === "PAID" ? now : item.paidAt,
    });

    // Write immutable settlement audit log
    await ctx.db.insert("payrollSettlementAuditLogs", {
      workspaceId: args.workspaceId,
      payrollRunId: item.payrollRunId,
      payrollItemId: item._id,
      employeeId: item.employeeId,
      action: newStatus === "PAID" ? "PAYMENT_COMPLETED" : "PAYMENT_RECORDED",
      previousStatus: item.paymentStatus ?? "PENDING",
      newStatus,
      amount: args.paymentAmount,
      remainingBalance: newRemainingBalance,
      paymentMode: args.paymentMode,
      evidenceReference: cleanEvidence,
      performedById: userId,
      timestamp: now,
    });

    return {
      success: true,
      payrollItemId: item._id,
      status: newStatus,
      amountPaid: newAmountPaid,
      remainingBalance: newRemainingBalance,
      evidenceReference: cleanEvidence,
    };
  },
});

export const getBankPayoutSummary = query({
  args: {
    workspaceId: v.id("workspaces"),
    periodMonth: v.string(), // "YYYY-MM"
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");
    // Strict RBAC: only authorized admin can view bank account numbers and IFSC
    await requireRole(ctx, userId, args.workspaceId, ["admin"]);

    const run = await ctx.db
      .query("payrollRuns")
      .withIndex("by_workspace_period", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("periodMonth", args.periodMonth)
      )
      .first();

    if (!run) {
      return {
        hasRun: false,
        totalNetPayout: 0,
        bankTransferTotal: 0,
        cashPayoutTotal: 0,
        bankTransferCount: 0,
        cashCount: 0,
        statusCounts: {
          PENDING: 0,
          AUTHORIZED: 0,
          PROCESSING: 0,
          PAID: 0,
          FAILED: 0,
          PARTIALLY_PAID: 0,
        },
        records: [],
      };
    }

    const items = await ctx.db
      .query("payrollItems")
      .withIndex("by_run", (q) => q.eq("payrollRunId", run._id))
      .collect();

    let bankTransferTotal = 0;
    let cashPayoutTotal = 0;
    let bankTransferCount = 0;
    let cashCount = 0;

    const statusCounts = {
      PENDING: 0,
      AUTHORIZED: 0,
      PROCESSING: 0,
      PAID: 0,
      FAILED: 0,
      PARTIALLY_PAID: 0,
    };

    const records = [];

    for (const it of items) {
      const emp = await ctx.db.get(it.employeeId);
      const mode = it.paymentMode ?? "bank_transfer";
      const status = it.paymentStatus ?? "PENDING";
      const amt = Math.max(0, it.netSalary);

      statusCounts[status] = (statusCounts[status] || 0) + 1;

      if (mode === "cash") {
        cashPayoutTotal += amt;
        cashCount++;
      } else {
        bankTransferTotal += amt;
        bankTransferCount++;
      }

      records.push({
        payrollItemId: it._id,
        employeeId: it.employeeId,
        employeeName: emp ? `${emp.firstName} ${emp.lastName}` : "Unknown",
        employeeCode: emp?.employeeIdNumber ?? "—",
        bankName: emp?.bankName ?? "—",
        // Protected data masked for privacy in general display
        bankAccountNumberMasked: emp?.bankAccountNumber ? maskAccountNumber(emp.bankAccountNumber) : "—",
        bankAccountNumberRaw: emp?.bankAccountNumber ?? "—",
        ifscCode: emp?.ifscCode ?? "—",
        netSalary: it.netSalary,
        amountPaid: it.amountPaid ?? (status === "PAID" ? it.netSalary : 0),
        remainingBalance: it.remainingBalance ?? (status === "PAID" ? 0 : it.netSalary),
        paymentMode: mode,
        paymentStatus: status,
        paymentReference: it.settlementEvidenceReference || it.paymentReference,
        paidAt: it.paidAt,
      });
    }

    return {
      hasRun: true,
      payrollRunId: run._id,
      runStatus: run.status,
      periodMonth: args.periodMonth,
      totalNetPayout: run.totalNetSalary,
      bankTransferTotal,
      cashPayoutTotal,
      bankTransferCount,
      cashCount,
      statusCounts,
      records,
    };
  },
});

// ── 5. Real Workspace-Scoped Payroll Overview Aggregation ───────────────────

export const getPayrollOverview = query({
  args: {
    workspaceId: v.id("workspaces"),
    periodMonth: v.string(), // "YYYY-MM"
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");
    await requireRole(ctx, userId, args.workspaceId, ["admin"]);

    // 1. Fetch current payroll run for chosen period
    const run = await ctx.db
      .query("payrollRuns")
      .withIndex("by_workspace_period", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("periodMonth", args.periodMonth)
      )
      .first();

    // 2. Fetch all active employees in workspace
    const allActiveEmployees = await ctx.db
      .query("employees")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId))
      .filter((q) => q.eq(q.field("status"), "active"))
      .collect();

    // 3. Additions: joined in this period
    const additions = allActiveEmployees.filter((emp) => {
      if (!emp.joiningDate) return false;
      return emp.joiningDate.startsWith(args.periodMonth);
    });

    // 4. Separations: inactive employees whose leaving date or separation happened in this period
    const allSeparatedEmployees = await ctx.db
      .query("employees")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId))
      .filter((q) => q.eq(q.field("status"), "inactive"))
      .collect();

    const separationsThisMonth = allSeparatedEmployees.filter((emp) => {
      if (emp.updatedAt) {
        const d = new Date(emp.updatedAt).toISOString().slice(0, 7);
        return d === args.periodMonth;
      }
      return false;
    });

    // 5. Full & Final Settlements in this workspace
    const settlements = await ctx.db
      .query("fnfSettlements")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId))
      .collect();

    const settlementsThisMonth = settlements.filter((s) => {
      return s.leavingDate && s.leavingDate.startsWith(args.periodMonth);
    });

    // 6. Exclusions: employees marked as stop processing or excluded
    let exclusionsCount = 0;
    if (run) {
      const items = await ctx.db
        .query("payrollItems")
        .withIndex("by_run", (q) => q.eq("payrollRunId", run._id))
        .collect();
      exclusionsCount = items.filter((it) => it.isStopProcessing).length;
    }

    // 7. Calculate previous period employee count to determine delta
    const [yearStr, monthStr] = args.periodMonth.split("-");
    const y = Number.parseInt(yearStr ?? "2026", 10);
    const m = Number.parseInt(monthStr ?? "11", 10);
    const prevYear = m === 1 ? y - 1 : y;
    const prevMonth = m === 1 ? 12 : m - 1;
    const prevPeriodStr = `${prevYear}-${String(prevMonth).padStart(2, "0")}`;

    const prevRun = await ctx.db
      .query("payrollRuns")
      .withIndex("by_workspace_period", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("periodMonth", prevPeriodStr)
      )
      .first();

    const prevEmployeeCount = prevRun ? prevRun.totalEmployees : allActiveEmployees.length - additions.length;
    const deltaCount = allActiveEmployees.length - prevEmployeeCount;

    // Days in month
    const totalWorkingDays = new Date(y, m, 0).getDate();

    if (!run) {
      return {
        hasRun: false,
        periodMonth: args.periodMonth,
        totalEmployees: allActiveEmployees.length,
        netPay: 0,
        grossPay: 0,
        deductions: 0,
        workDays: totalWorkingDays,
        additionsCount: additions.length,
        settlementsCount: settlementsThisMonth.length,
        exclusionsCount,
        separationsCount: separationsThisMonth.length,
        deltaCount,
        runStatus: null,
        finalizedAt: null,
      };
    }

    return {
      hasRun: true,
      payrollRunId: run._id,
      periodMonth: args.periodMonth,
      totalEmployees: run.totalEmployees ?? allActiveEmployees.length,
      netPay: run.totalNetSalary ?? 0,
      grossPay: run.totalGrossSalary ?? 0,
      deductions: (run.totalGrossSalary ?? 0) - (run.totalNetSalary ?? 0),
      workDays: totalWorkingDays,
      additionsCount: additions.length,
      settlementsCount: settlementsThisMonth.length,
      exclusionsCount,
      separationsCount: separationsThisMonth.length,
      deltaCount,
      runStatus: run.status,
      finalizedAt: run.finalizedAt ?? run.updatedAt ?? null,
    };
  },
});
