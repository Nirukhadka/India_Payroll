import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { audit } from "./auditLog";
import { requireMember, requireRole } from "./orgs";

// ═════════════════════════════════════════════════════════════════════════════
// 1. SECURE LOAN MANAGEMENT & EMI QUERIES / MUTATIONS
// ═════════════════════════════════════════════════════════════════════════════

export const listWorkspaceLoans = query({
  args: {
    workspaceId: v.id("workspaces"),
    employeeId: v.optional(v.id("employees")),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");
    await requireMember(ctx, userId, args.workspaceId);

    let loans = await ctx.db
      .query("loans")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId))
      .collect();

    if (args.employeeId) {
      loans = loans.filter((l) => l.employeeId === args.employeeId);
    }
    if (args.status) {
      loans = loans.filter((l) => l.status === args.status);
    }

    return loans;
  },
});

export const createLoanRecord = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    employeeId: v.id("employees"),
    loanType: v.string(),
    principalAmount: v.number(),
    interestRatePercent: v.number(),
    tenureMonths: v.number(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");
    await requireRole(ctx, userId, args.workspaceId, ["admin"]);

    // Verify employee belongs to the same workspace
    const employee = await ctx.db.get(args.employeeId);
    if (!employee || employee.workspaceId !== args.workspaceId) {
      throw new ConvexError("Invalid employee reference or cross-tenant violation");
    }

    const now = Date.now();
    // Calculate simple monthly EMI
    const monthlyInterest = (args.principalAmount * (args.interestRatePercent / 100)) / 12;
    const monthlyPrincipal = args.principalAmount / args.tenureMonths;
    const monthlyEmi = Math.round(monthlyPrincipal + monthlyInterest);

    const loanId = await ctx.db.insert("loans", {
      workspaceId: args.workspaceId,
      employeeId: args.employeeId,
      loanType: args.loanType,
      principalAmount: args.principalAmount,
      interestRatePercent: args.interestRatePercent,
      tenureMonths: args.tenureMonths,
      monthlyEmiAmount: monthlyEmi,
      disbursedAt: now,
      disbursedBy: userId,
      status: "ACTIVE",
      outstandingPrincipal: args.principalAmount,
      totalRepaid: 0,
      notes: args.notes,
      createdAt: now,
      updatedAt: now,
    });

    await audit(ctx, args.workspaceId, userId, "loan.created", {
      loanId,
      employeeId: args.employeeId,
      principal: args.principalAmount,
    });

    return loanId;
  },
});

// ═════════════════════════════════════════════════════════════════════════════
// 2. REIMBURSEMENT CLAIMS QUERIES & MUTATIONS
// ═════════════════════════════════════════════════════════════════════════════

export const listReimbursementClaims = query({
  args: {
    workspaceId: v.id("workspaces"),
    employeeId: v.optional(v.id("employees")),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");
    await requireMember(ctx, userId, args.workspaceId);

    let claims = await ctx.db
      .query("reimbursementClaims")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId))
      .collect();

    if (args.employeeId) {
      claims = claims.filter((c) => c.employeeId === args.employeeId);
    }
    if (args.status) {
      claims = claims.filter((c) => c.status === args.status);
    }

    return claims;
  },
});

export const submitReimbursementClaim = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    employeeId: v.id("employees"),
    claimType: v.string(),
    claimAmount: v.number(),
    expenseDate: v.string(),
    description: v.string(),
    isTaxExempt: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");
    await requireMember(ctx, userId, args.workspaceId);

    const employee = await ctx.db.get(args.employeeId);
    if (!employee || employee.workspaceId !== args.workspaceId) {
      throw new ConvexError("Invalid employee reference or cross-tenant violation");
    }

    const now = Date.now();
    const claimNumber = `CLM-${new Date().toISOString().slice(0, 7).replace("-", "")}-${Math.floor(1000 + Math.random() * 9000)}`;
    const claimId = await ctx.db.insert("reimbursementClaims", {
      workspaceId: args.workspaceId,
      claimNumber,
      employeeId: args.employeeId,
      categoryCode: "MISC",
      claimType: args.claimType,
      claimAmount: args.claimAmount,
      expenseDate: args.expenseDate,
      businessPurpose: args.description || "General business reimbursement",
      description: args.description,
      taxTreatment: "REQUIRES_REVIEW",
      isTaxExempt: args.isTaxExempt,
      status: "SUBMITTED",
      createdAt: now,
      updatedAt: now,
    });

    await audit(ctx, args.workspaceId, userId, "reimbursement.submitted", {
      claimId,
      amount: args.claimAmount,
    });

    return claimId;
  },
});

// ═════════════════════════════════════════════════════════════════════════════
// 3. FULL & FINAL (F&F) SETTLEMENT QUERIES & MUTATIONS
// ═════════════════════════════════════════════════════════════════════════════

export const listFnfSettlements = query({
  args: {
    workspaceId: v.id("workspaces"),
    employeeId: v.optional(v.id("employees")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");
    await requireRole(ctx, userId, args.workspaceId, ["admin"]);

    let settlements = await ctx.db
      .query("fnfSettlements")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId))
      .collect();

    if (args.employeeId) {
      settlements = settlements.filter((s) => s.employeeId === args.employeeId);
    }

    return settlements;
  },
});

export const calculateFnfSettlement = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    employeeId: v.id("employees"),
    leavingDate: v.string(),
    reasonForLeaving: v.string(),
    noticePeriodShortfallDays: v.number(),
    outstandingLoanRecovery: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");
    await requireRole(ctx, userId, args.workspaceId, ["admin"]);

    const employee = await ctx.db.get(args.employeeId);
    if (!employee || employee.workspaceId !== args.workspaceId) {
      throw new ConvexError("Invalid employee reference or cross-tenant violation");
    }

    // Retrieve employee salary
    const salary = await ctx.db
      .query("salaries")
      .withIndex("by_employee", (q) => q.eq("employeeId", args.employeeId))
      .first();

    const basicSalary = salary?.basicSalary || 35000;

    // Calculate tenure in years from joiningDate
    const joinYear = employee.joiningDate ? parseInt(employee.joiningDate.slice(0, 4), 10) : 2023;
    const exitYear = parseInt(args.leavingDate.slice(0, 4), 10);
    const serviceTenureYears = Math.max(1, exitYear - joinYear);

    // Gratuity calculation: (15 * Last basic * Tenure) / 26 (eligible if tenure >= 5 years)
    const isGratuityEligible = serviceTenureYears >= 5;
    const gratuityAmount = isGratuityEligible
      ? Math.round((15 * basicSalary * serviceTenureYears) / 26)
      : 0;

    // Earned leave encashment (simulate 15 days balance)
    const earnedLeaveDaysBalance = 15;
    const leaveEncashmentAmount = Math.round((earnedLeaveDaysBalance * basicSalary) / 30);

    // Notice pay deduction
    const perDaySalary = basicSalary / 30;
    const noticePayDeduction = Math.round(args.noticePeriodShortfallDays * perDaySalary);

    const exitMonthSalaryPayable = Math.round(basicSalary * 1.6);
    const grossPayable = exitMonthSalaryPayable + leaveEncashmentAmount + gratuityAmount;
    const totalDeductions = noticePayDeduction + args.outstandingLoanRecovery;
    const netSettlementPayable = Math.max(0, grossPayable - totalDeductions);

    const now = Date.now();
    const settlementId = await ctx.db.insert("fnfSettlements", {
      workspaceId: args.workspaceId,
      employeeId: args.employeeId,
      leavingDate: args.leavingDate,
      reasonForLeaving: args.reasonForLeaving,
      serviceTenureYears,
      lastDrawnBasicSalary: basicSalary,
      exitMonthSalaryPayable,
      earnedLeaveDaysBalance,
      leaveEncashmentAmount,
      isGratuityEligible,
      gratuityAmount,
      bonusOrExGratia: 0,
      grossPayable,
      noticePeriodShortfallDays: args.noticePeriodShortfallDays,
      noticePayDeduction,
      outstandingLoanRecovery: args.outstandingLoanRecovery,
      otherDeductions: 0,
      totalDeductions,
      netSettlementPayable,
      clearanceStatus: "DRAFT",
      calculatedBy: userId,
      createdAt: now,
      updatedAt: now,
    });

    await audit(ctx, args.workspaceId, userId, "fnf.calculated", {
      settlementId,
      employeeId: args.employeeId,
      netPayable: netSettlementPayable,
    });

    return settlementId;
  },
});

// ═════════════════════════════════════════════════════════════════════════════
// 4. SYSTEM EMAIL LOGS QUERIES & MUTATIONS
// ═════════════════════════════════════════════════════════════════════════════

export const listEmailLogs = query({
  args: {
    workspaceId: v.id("workspaces"),
    dispatchStatus: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");
    await requireRole(ctx, userId, args.workspaceId, ["admin"]);

    let logs = await ctx.db
      .query("emailLogs")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId))
      .order("desc")
      .take(100);

    if (args.dispatchStatus) {
      logs = logs.filter((l) => l.dispatchStatus === args.dispatchStatus);
    }

    return logs;
  },
});

export const recordEmailLog = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    recipientEmail: v.string(),
    recipientEmployeeId: v.optional(v.id("employees")),
    subject: v.string(),
    templateName: v.string(),
    dispatchStatus: v.union(
      v.literal("QUEUED"),
      v.literal("SENT"),
      v.literal("FAILED"),
      v.literal("BOUNCED"),
      v.literal("NOT_CONFIGURED")
    ),
    providerMessageId: v.optional(v.string()),
    errorMessage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");
    await requireRole(ctx, userId, args.workspaceId, ["admin"]);

    const now = Date.now();
    return await ctx.db.insert("emailLogs", {
      workspaceId: args.workspaceId,
      recipientEmail: args.recipientEmail,
      recipientEmployeeId: args.recipientEmployeeId,
      subject: args.subject,
      templateName: args.templateName,
      dispatchStatus: args.dispatchStatus,
      providerMessageId: args.providerMessageId,
      errorMessage: args.errorMessage,
      sentAt: args.dispatchStatus === "SENT" ? now : undefined,
      createdAt: now,
    });
  },
});

// ═════════════════════════════════════════════════════════════════════════════
// 5. SECURITY RESTRICTED USER IMPERSONATION SESSION AUDIT
// ═════════════════════════════════════════════════════════════════════════════

export const createImpersonationSession = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    targetUserId: v.id("users"),
    businessReason: v.string(),
  },
  handler: async (ctx, args) => {
    const adminUserId = await getAuthUserId(ctx);
    if (!adminUserId) throw new ConvexError("Not authenticated");
    
    // Strict super-admin privilege check
    await requireRole(ctx, adminUserId, args.workspaceId, ["admin"]);

    // Disallow self-impersonation
    if (adminUserId === args.targetUserId) {
      throw new ConvexError("Cannot initiate impersonation session on your own account");
    }

    // Verify target user belongs to the same workspace
    const targetMember = await ctx.db
      .query("members")
      .withIndex("by_user_workspace", (q) =>
        q.eq("userId", args.targetUserId).eq("workspaceId", args.workspaceId)
      )
      .unique();

    if (!targetMember) {
      throw new ConvexError("Target user does not belong to this workspace");
    }

    const now = Date.now();
    const expiresAt = now + 30 * 60 * 1000; // 30-minute maximum session lease

    const sessionId = await ctx.db.insert("userImpersonationSessions", {
      workspaceId: args.workspaceId,
      adminUserId,
      targetUserId: args.targetUserId,
      businessReason: args.businessReason,
      startedAt: now,
      expiresAt,
      status: "ACTIVE",
    });

    await audit(ctx, args.workspaceId, adminUserId, "security.impersonation.started", {
      sessionId,
      targetUserId: args.targetUserId,
      reason: args.businessReason,
      expiresAt,
    });

    return { sessionId, expiresAt };
  },
});

export const revokeImpersonationSession = mutation({
  args: {
    sessionId: v.id("userImpersonationSessions"),
  },
  handler: async (ctx, args) => {
    const adminUserId = await getAuthUserId(ctx);
    if (!adminUserId) throw new ConvexError("Not authenticated");

    const session = await ctx.db.get(args.sessionId);
    if (!session) throw new ConvexError("Session not found");

    await requireRole(ctx, adminUserId, session.workspaceId, ["admin"]);

    const now = Date.now();
    await ctx.db.patch(args.sessionId, {
      status: "REVOKED",
      endedAt: now,
    });

    await audit(ctx, session.workspaceId, adminUserId, "security.impersonation.revoked", {
      sessionId: args.sessionId,
      targetUserId: session.targetUserId,
    });

    return { success: true };
  },
});
