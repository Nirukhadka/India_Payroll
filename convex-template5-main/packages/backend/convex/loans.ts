import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { audit } from "./auditLog";
import { calculateEmiAndSchedule, recalculateAfterPrepayment } from "./loanEngine";
import { requireMember, requireRole } from "./orgs";

// ═════════════════════════════════════════════════════════════════════════════
// LOAN MANAGEMENT, AMORTIZATION & EMI ENGINE
// ═════════════════════════════════════════════════════════════════════════════

/**
 * 1. Calculate EMI & Amortization Preview (Decimal-Safe Engine)
 */
export const previewLoanSchedule = query({
  args: {
    principalAmount: v.number(),
    interestRatePercent: v.number(),
    tenureMonths: v.number(),
    startMonth: v.optional(v.string()),
  },
  handler: async (_ctx, args) => {
    return calculateEmiAndSchedule(
      args.principalAmount,
      args.interestRatePercent,
      args.tenureMonths,
      args.startMonth || "2026-12"
    );
  },
});

/**
 * 2. List Loans for a Workspace (with multi-tenant security)
 */
export const listWorkspaceLoans = query({
  args: {
    workspaceId: v.id("workspaces"),
    employeeId: v.optional(v.id("employees")),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");
    const m = await requireMember(ctx, userId, args.workspaceId);

    // If regular member, restrict strictly to their own employee record
    let targetEmployeeId = args.employeeId;
    if (m.role === "member") {
      const me = await ctx.db
        .query("employees")
        .withIndex("by_workspace_user", (q) =>
          q.eq("workspaceId", args.workspaceId).eq("userId", userId),
        )
        .first();
      if (!me) return [];
      targetEmployeeId = me._id;
    }

    let loans = await ctx.db
      .query("loans")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId))
      .order("desc")
      .collect();

    if (targetEmployeeId) {
      loans = loans.filter((l) => l.employeeId === targetEmployeeId);
    }
    if (args.status) {
      loans = loans.filter((l) => l.status === args.status);
    }

    // Enrich with employee names
    const enrichedLoans = await Promise.all(
      loans.map(async (loan) => {
        const emp = await ctx.db.get(loan.employeeId);
        return {
          ...loan,
          employeeName: emp ? `${emp.firstName} ${emp.lastName}` : "Unknown Employee",
          employeeCode: emp?.employeeIdNumber || "N/A",
          department: emp?.department || "General",
        };
      })
    );

    return enrichedLoans;
  },
});

/**
 * 2b. Get My Loans (Employee ESS)
 */
export const getMyLoans = query({
  args: {
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");
    await requireMember(ctx, userId, args.workspaceId);

    const employee = await ctx.db
      .query("employees")
      .withIndex("by_workspace_user", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId),
      )
      .first();

    if (!employee) return [];

    const loans = await ctx.db
      .query("loans")
      .withIndex("by_workspace_employee", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("employeeId", employee._id),
      )
      .order("desc")
      .collect();

    return loans;
  },
});

/**
 * 2c. Apply for Loan or Salary Advance (Employee ESS)
 */
export const applyForLoan = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    loanType: v.string(), // "SALARY_ADVANCE", "PERSONAL", "EMERGENCY"
    purpose: v.string(),
    principalAmount: v.number(),
    tenureMonths: v.number(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");
    await requireMember(ctx, userId, args.workspaceId);

    const employee = await ctx.db
      .query("employees")
      .withIndex("by_workspace_user", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId),
      )
      .first();

    if (!employee) {
      throw new ConvexError("No employee profile found linked to your account");
    }

    if (args.principalAmount <= 0) {
      throw new ConvexError("Principal amount must be greater than zero");
    }
    if (args.tenureMonths <= 0 || !Number.isInteger(args.tenureMonths)) {
      throw new ConvexError("Tenure must be a positive integer");
    }
    if (!args.purpose || !args.purpose.trim()) {
      throw new ConvexError("Purpose of loan or advance is required");
    }

    // Advances are typically interest-free (0%) or nominal
    const interestRatePercent = 0;
    const now = Date.now();
    const currentMonth = new Date().toISOString().slice(0, 7);

    const emiResult = calculateEmiAndSchedule(
      args.principalAmount,
      interestRatePercent,
      args.tenureMonths,
      currentMonth,
    );

    const lastInstallment = emiResult.schedule[emiResult.schedule.length - 1];
    const expectedCompletionDate = lastInstallment
      ? lastInstallment.repaymentMonth
      : currentMonth;

    const loanId = await ctx.db.insert("loans", {
      workspaceId: args.workspaceId,
      employeeId: employee._id,
      loanType: args.loanType,
      purpose: args.purpose.trim(),
      principalAmount: args.principalAmount,
      interestRatePercent,
      tenureMonths: args.tenureMonths,
      monthlyEmiAmount: emiResult.monthlyEmiAmount,
      startDate: currentMonth,
      expectedCompletionDate,
      approvalStatus: "PENDING",
      disbursementStatus: "PENDING",
      status: "PENDING",
      outstandingPrincipal: args.principalAmount,
      totalRepaid: 0,
      notes: args.notes?.trim() || undefined,
      createdAt: now,
      updatedAt: now,
    });

    await audit(ctx, args.workspaceId, userId, "loan.applied", {
      loanId,
      employeeId: employee._id,
      principalAmount: args.principalAmount,
      tenureMonths: args.tenureMonths,
      monthlyEmiAmount: emiResult.monthlyEmiAmount,
    });

    return loanId;
  },
});

/**
 * 3. Get Loan Details by ID (with full repayment schedule & ledger)
 */
export const getLoanDetails = query({
  args: {
    workspaceId: v.id("workspaces"),
    loanId: v.id("loans"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");
    await requireMember(ctx, userId, args.workspaceId);

    const loan = await ctx.db.get(args.loanId);
    if (!loan || loan.workspaceId !== args.workspaceId) {
      throw new ConvexError("Loan not found or cross-tenant violation");
    }

    const employee = await ctx.db.get(loan.employeeId);
    const repayments = await ctx.db
      .query("loanRepayments")
      .withIndex("by_loan", (q) => q.eq("loanId", args.loanId))
      .collect();

    // Generate full prospective schedule
    const scheduleResult = calculateEmiAndSchedule(
      loan.principalAmount,
      loan.interestRatePercent,
      loan.tenureMonths,
      loan.startDate || "2026-12"
    );

    return {
      loan,
      employee: employee
        ? {
            id: employee._id,
            name: `${employee.firstName} ${employee.lastName}`,
            code: employee.employeeIdNumber,
            department: employee.department,
            designation: employee.designation,
          }
        : null,
      repayments: repayments.sort((a, b) => a.installmentNumber - b.installmentNumber),
      amortizationSchedule: scheduleResult.schedule,
    };
  },
});

/**
 * 4. Create Employee Loan (Draft / Pending State)
 */
export const createLoanRecord = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    employeeId: v.id("employees"),
    loanType: v.string(), // "PERSONAL", "SALARY_ADVANCE", "EMERGENCY", "EQUIPMENT", "EDUCATION", "HOUSING"
    purpose: v.optional(v.string()),
    principalAmount: v.number(),
    interestRatePercent: v.number(),
    tenureMonths: v.number(),
    startDate: v.optional(v.string()), // "YYYY-MM"
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");
    await requireRole(ctx, userId, args.workspaceId, ["admin"]);

    // Verify employee belongs to same workspace
    const employee = await ctx.db.get(args.employeeId);
    if (!employee || employee.workspaceId !== args.workspaceId) {
      throw new ConvexError("Invalid employee reference or cross-tenant violation");
    }

    if (args.principalAmount <= 0) {
      throw new ConvexError("Principal amount must be greater than zero");
    }
    if (args.tenureMonths <= 0) {
      throw new ConvexError("Tenure must be at least 1 month");
    }

    const startMonth = args.startDate || "2026-12";
    const emiResult = calculateEmiAndSchedule(
      args.principalAmount,
      args.interestRatePercent,
      args.tenureMonths,
      startMonth
    );

    const now = Date.now();
    const lastInstallment = emiResult.schedule[emiResult.schedule.length - 1];
    const expectedCompletionDate = lastInstallment ? lastInstallment.repaymentMonth : startMonth;

    const loanId = await ctx.db.insert("loans", {
      workspaceId: args.workspaceId,
      employeeId: args.employeeId,
      loanType: args.loanType,
      purpose: args.purpose,
      principalAmount: args.principalAmount,
      interestRatePercent: args.interestRatePercent,
      tenureMonths: args.tenureMonths,
      monthlyEmiAmount: emiResult.monthlyEmiAmount,
      startDate: startMonth,
      expectedCompletionDate,
      approvalStatus: "PENDING",
      disbursementStatus: "PENDING",
      status: "PENDING",
      outstandingPrincipal: args.principalAmount,
      totalRepaid: 0,
      notes: args.notes,
      createdAt: now,
      updatedAt: now,
    });

    await audit(ctx, args.workspaceId, userId, "loan.created", {
      loanId,
      employeeId: args.employeeId,
      principalAmount: args.principalAmount,
      monthlyEmi: emiResult.monthlyEmiAmount,
    });

    return loanId;
  },
});

/**
 * 5. Approve or Reject Loan
 */
export const reviewLoanApplication = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    loanId: v.id("loans"),
    action: v.union(v.literal("APPROVE"), v.literal("REJECT")),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");
    await requireRole(ctx, userId, args.workspaceId, ["admin"]);

    const loan = await ctx.db.get(args.loanId);
    if (!loan || loan.workspaceId !== args.workspaceId) {
      throw new ConvexError("Loan not found or cross-tenant violation");
    }

    if (loan.approvalStatus !== "PENDING" && loan.status !== "PENDING") {
      throw new ConvexError(`Cannot review loan in status: ${loan.status}`);
    }

    const now = Date.now();

    if (args.action === "APPROVE") {
      await ctx.db.patch(args.loanId, {
        approvalStatus: "APPROVED",
        approvedBy: userId,
        approvedAt: now,
        status: "APPROVED",
        updatedAt: now,
      });

      await audit(ctx, args.workspaceId, userId, "loan.approved", {
        loanId: args.loanId,
        approvedBy: userId,
      });

      return { success: true, status: "APPROVED" };
    } else {
      if (!args.reason) {
        throw new ConvexError("Rejection reason is mandatory");
      }

      await ctx.db.patch(args.loanId, {
        approvalStatus: "REJECTED",
        rejectedBy: userId,
        rejectedAt: now,
        rejectionReason: args.reason,
        status: "REJECTED",
        updatedAt: now,
      });

      await audit(ctx, args.workspaceId, userId, "loan.rejected", {
        loanId: args.loanId,
        rejectedBy: userId,
        reason: args.reason,
      });

      return { success: true, status: "REJECTED" };
    }
  },
});

/**
 * 6. Disburse Loan (Activates Repayment Lifecycle)
 */
export const disburseLoan = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    loanId: v.id("loans"),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");
    await requireRole(ctx, userId, args.workspaceId, ["admin"]);

    const loan = await ctx.db.get(args.loanId);
    if (!loan || loan.workspaceId !== args.workspaceId) {
      throw new ConvexError("Loan not found or cross-tenant violation");
    }

    if (loan.approvalStatus !== "APPROVED") {
      throw new ConvexError("Loan must be approved before disbursement");
    }

    const now = Date.now();
    await ctx.db.patch(args.loanId, {
      disbursementStatus: "DISBURSED",
      disbursedAt: now,
      disbursedBy: userId,
      status: "ACTIVE",
      notes: args.notes ? `${loan.notes || ""}\n${args.notes}`.trim() : loan.notes,
      updatedAt: now,
    });

    await audit(ctx, args.workspaceId, userId, "loan.disbursed", {
      loanId: args.loanId,
      disbursedBy: userId,
    });

    return { success: true, status: "ACTIVE" };
  },
});

/**
 * 7. Early / Lump-sum Repayment
 */
export const recordEarlyRepayment = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    loanId: v.id("loans"),
    amount: v.number(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");
    await requireRole(ctx, userId, args.workspaceId, ["admin"]);

    const loan = await ctx.db.get(args.loanId);
    if (!loan || loan.workspaceId !== args.workspaceId) {
      throw new ConvexError("Loan not found or cross-tenant violation");
    }

    if (loan.status !== "ACTIVE") {
      throw new ConvexError("Cannot record repayment on non-active loan");
    }

    if (args.amount <= 0) {
      throw new ConvexError("Repayment amount must be positive");
    }

    const repaymentAmount = Math.min(args.amount, loan.outstandingPrincipal);
    const newOutstanding = loan.outstandingPrincipal - repaymentAmount;
    const newTotalRepaid = loan.totalRepaid + repaymentAmount;
    const isClosed = newOutstanding <= 0;

    const existingRepayments = await ctx.db
      .query("loanRepayments")
      .withIndex("by_loan", (q) => q.eq("loanId", args.loanId))
      .collect();

    const now = Date.now();
    const installmentNumber = existingRepayments.length + 1;
    const currentMonthStr = new Date().toISOString().slice(0, 7);

    // Insert repayment transaction record
    await ctx.db.insert("loanRepayments", {
      workspaceId: args.workspaceId,
      loanId: args.loanId,
      employeeId: loan.employeeId,
      repaymentMonth: currentMonthStr,
      installmentNumber,
      principalPaid: repaymentAmount,
      interestPaid: 0,
      totalDeducted: repaymentAmount,
      outstandingBalanceAfter: newOutstanding,
      repaymentType: isClosed ? "EARLY_REPAYMENT" : "PARTIAL_REPAYMENT",
      deductionStatus: "PROCESSED",
      notes: args.notes || "Lump-sum advance prepayment",
      paidAt: now,
      createdAt: now,
    });

    // Update loan state
    await ctx.db.patch(args.loanId, {
      outstandingPrincipal: newOutstanding,
      totalRepaid: newTotalRepaid,
      status: isClosed ? "CLOSED" : "ACTIVE",
      closedAt: isClosed ? now : undefined,
      closedBy: isClosed ? userId : undefined,
      closureReason: isClosed ? "Fully prepaid and settled" : undefined,
      updatedAt: now,
    });

    await audit(ctx, args.workspaceId, userId, "loan.repayment.early", {
      loanId: args.loanId,
      amount: repaymentAmount,
      newOutstanding,
      isClosed,
    });

    return {
      success: true,
      repaidAmount: repaymentAmount,
      remainingBalance: newOutstanding,
      isClosed,
    };
  },
});

/**
 * 8. Process Payroll Loan EMI Deduction (Payroll Inputs Integration)
 */
export const processPayrollLoanDeduction = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    loanId: v.id("loans"),
    payrollPeriod: v.string(), // "YYYY-MM"
    payrollRunId: v.optional(v.id("payrollRuns")),
    availableNetSalary: v.number(), // For insufficient salary check
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");
    await requireRole(ctx, userId, args.workspaceId, ["admin"]);

    const loan = await ctx.db.get(args.loanId);
    if (!loan || loan.workspaceId !== args.workspaceId) {
      throw new ConvexError("Loan not found or cross-tenant violation");
    }

    if (loan.status !== "ACTIVE") {
      throw new ConvexError("Only active loans can participate in payroll deductions");
    }

    // Check duplicate deduction for same period
    const existingForMonth = await ctx.db
      .query("loanRepayments")
      .withIndex("by_loan", (q) => q.eq("loanId", args.loanId))
      .filter((q) =>
        q.and(
          q.eq(q.field("repaymentMonth"), args.payrollPeriod),
          q.eq(q.field("deductionStatus"), "PROCESSED")
        )
      )
      .first();

    if (existingForMonth) {
      throw new ConvexError(
        `EMI deduction for loan ${args.loanId} already processed for month ${args.payrollPeriod}`
      );
    }

    // Determine target deduction
    const targetEmi = Math.min(loan.monthlyEmiAmount, loan.outstandingPrincipal);

    // Insufficient salary handling
    let actualDeduction = targetEmi;
    let isPartial = false;
    let isBounced = false;

    if (args.availableNetSalary < targetEmi) {
      if (args.availableNetSalary <= 0) {
        // Zero salary -> Bounce / Waive installment for this month
        isBounced = true;
        actualDeduction = 0;
      } else {
        // Partial deduction up to available net salary
        isPartial = true;
        actualDeduction = args.availableNetSalary;
      }
    }

    const monthlyInterestRate = loan.interestRatePercent / 12 / 100;
    const interestComponent = Math.min(
      Math.round(loan.outstandingPrincipal * monthlyInterestRate),
      actualDeduction
    );
    const principalComponent = actualDeduction - interestComponent;

    const newOutstanding = Math.max(0, loan.outstandingPrincipal - principalComponent);
    const newTotalRepaid = loan.totalRepaid + principalComponent;
    const isClosed = newOutstanding <= 0;

    const allRepayments = await ctx.db
      .query("loanRepayments")
      .withIndex("by_loan", (q) => q.eq("loanId", args.loanId))
      .collect();

    const now = Date.now();
    const installmentNumber = allRepayments.length + 1;

    const repaymentId = await ctx.db.insert("loanRepayments", {
      workspaceId: args.workspaceId,
      loanId: args.loanId,
      employeeId: loan.employeeId,
      repaymentMonth: args.payrollPeriod,
      installmentNumber,
      principalPaid: principalComponent,
      interestPaid: interestComponent,
      totalDeducted: actualDeduction,
      outstandingBalanceAfter: newOutstanding,
      repaymentType: "PAYROLL_DEDUCTION",
      payrollRunId: args.payrollRunId,
      deductionStatus: isBounced ? "BOUNCED" : "PROCESSED",
      notes: isBounced
        ? "Zero net salary available; installment bounced"
        : isPartial
        ? `Partial deduction due to salary constraint (Target: ${targetEmi})`
        : "Standard payroll EMI deduction",
      paidAt: isBounced ? undefined : now,
      createdAt: now,
    });

    if (!isBounced) {
      await ctx.db.patch(args.loanId, {
        outstandingPrincipal: newOutstanding,
        totalRepaid: newTotalRepaid,
        status: isClosed ? "CLOSED" : "ACTIVE",
        closedAt: isClosed ? now : undefined,
        closedBy: isClosed ? userId : undefined,
        closureReason: isClosed ? "Settled via scheduled payroll deduction" : undefined,
        updatedAt: now,
      });
    }

    await audit(ctx, args.workspaceId, userId, "payroll.loan.deduction", {
      loanId: args.loanId,
      repaymentId,
      payrollPeriod: args.payrollPeriod,
      actualDeduction,
      principalComponent,
      interestComponent,
      newOutstanding,
      isBounced,
    });

    return {
      repaymentId,
      deductedAmount: actualDeduction,
      principalComponent,
      interestComponent,
      remainingOutstanding: newOutstanding,
      isClosed,
      isPartial,
      isBounced,
    };
  },
});

/**
 * 9. Close Loan Manually with Justification
 */
export const closeLoanManually = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    loanId: v.id("loans"),
    reason: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");
    await requireRole(ctx, userId, args.workspaceId, ["admin"]);

    const loan = await ctx.db.get(args.loanId);
    if (!loan || loan.workspaceId !== args.workspaceId) {
      throw new ConvexError("Loan not found or cross-tenant violation");
    }

    const now = Date.now();
    await ctx.db.patch(args.loanId, {
      status: "CLOSED",
      outstandingPrincipal: 0,
      closedAt: now,
      closedBy: userId,
      closureReason: args.reason,
      updatedAt: now,
    });

    await audit(ctx, args.workspaceId, userId, "loan.closed.manual", {
      loanId: args.loanId,
      reason: args.reason,
    });

    return { success: true };
  },
});
