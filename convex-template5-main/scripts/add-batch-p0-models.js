const fs = require('fs');
const path = 'C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/packages/backend/convex/schema.ts';
let schema = fs.readFileSync(path, 'utf8');

const p0Models = `
  // ─────────────────────────────────────────────────────────────────────────────
  // BATCH P0 SECURE BACKEND FOUNDATION MODELS
  // ─────────────────────────────────────────────────────────────────────────────

  // 1. Employee Loans Master
  loans: defineTable({
    workspaceId: v.id("workspaces"),
    employeeId: v.id("employees"),
    loanType: v.string(), // "PERSONAL", "SALARY_ADVANCE", "EMERGENCY", "EQUIPMENT"
    principalAmount: v.number(),
    interestRatePercent: v.number(), // Annual rate e.g. 8.5 (or 0 for interest-free)
    tenureMonths: v.number(),
    monthlyEmiAmount: v.number(),
    disbursedAt: v.number(),
    disbursedBy: v.id("users"),
    status: v.union(
      v.literal("PENDING"),
      v.literal("APPROVED"),
      v.literal("DISBURSED"),
      v.literal("ACTIVE"),
      v.literal("CLOSED"),
      v.literal("REJECTED")
    ),
    outstandingPrincipal: v.number(),
    totalRepaid: v.number(),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_workspace_employee", ["workspaceId", "employeeId"])
    .index("by_workspace_status", ["workspaceId", "status"]),

  // 2. Loan Repayments & Payroll Deductions
  loanRepayments: defineTable({
    workspaceId: v.id("workspaces"),
    loanId: v.id("loans"),
    employeeId: v.id("employees"),
    repaymentMonth: v.string(), // "YYYY-MM"
    installmentNumber: v.number(),
    principalPaid: v.number(),
    interestPaid: v.number(),
    totalDeducted: v.number(),
    payrollRunId: v.optional(v.id("payrollRuns")),
    deductionStatus: v.union(
      v.literal("SCHEDULED"),
      v.literal("PROCESSED"),
      v.literal("WAIVED"),
      v.literal("BOUNCED")
    ),
    paidAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_loan", ["loanId"])
    .index("by_workspace_employee", ["workspaceId", "employeeId"])
    .index("by_workspace_month", ["workspaceId", "repaymentMonth"]),

  // 3. Employee Reimbursement Claims & Taxable Expense Vouchers
  reimbursementClaims: defineTable({
    workspaceId: v.id("workspaces"),
    employeeId: v.id("employees"),
    claimType: v.string(), // "TRAVEL", "MEDICAL", "TELECOM", "FOOD", "LTA"
    claimAmount: v.number(),
    approvedAmount: v.optional(v.number()),
    expenseDate: v.string(), // "YYYY-MM-DD"
    description: v.string(),
    billAttachmentStorageId: v.optional(v.id("_storage")),
    isTaxExempt: v.boolean(),
    status: v.union(
      v.literal("SUBMITTED"),
      v.literal("UNDER_REVIEW"),
      v.literal("APPROVED"),
      v.literal("REJECTED"),
      v.literal("SETTLED")
    ),
    reviewedBy: v.optional(v.id("users")),
    reviewedAt: v.optional(v.number()),
    reviewerComments: v.optional(v.string()),
    settledInPayrollMonth: v.optional(v.string()), // "YYYY-MM"
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_workspace_employee", ["workspaceId", "employeeId"])
    .index("by_workspace_status", ["workspaceId", "status"]),

  // 4. Full & Final Settlement (F&F) Calculation & Clearance Ledger
  fnfSettlements: defineTable({
    workspaceId: v.id("workspaces"),
    employeeId: v.id("employees"),
    leavingDate: v.string(), // "YYYY-MM-DD"
    reasonForLeaving: v.string(),
    serviceTenureYears: v.number(),
    lastDrawnBasicSalary: v.number(),
    exitMonthSalaryPayable: v.number(),
    earnedLeaveDaysBalance: v.number(),
    leaveEncashmentAmount: v.number(),
    isGratuityEligible: v.boolean(),
    gratuityAmount: v.number(),
    bonusOrExGratia: v.number(),
    grossPayable: v.number(),
    noticePeriodShortfallDays: v.number(),
    noticePayDeduction: v.number(),
    outstandingLoanRecovery: v.number(),
    otherDeductions: v.number(),
    totalDeductions: v.number(),
    netSettlementPayable: v.number(),
    clearanceStatus: v.union(
      v.literal("DRAFT"),
      v.literal("DEPT_CLEARANCE_PENDING"),
      v.literal("APPROVED"),
      v.literal("PAID"),
      v.literal("CANCELLED")
    ),
    calculatedBy: v.id("users"),
    approvedBy: v.optional(v.id("users")),
    paidAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_workspace_employee", ["workspaceId", "employeeId"])
    .index("by_workspace_status", ["workspaceId", "clearanceStatus"]),

  // 5. Outbound System Email Delivery Diagnostic Log (Non-credential)
  emailLogs: defineTable({
    workspaceId: v.id("workspaces"),
    recipientEmail: v.string(),
    recipientEmployeeId: v.optional(v.id("employees")),
    subject: v.string(),
    templateName: v.string(), // "PAYSLIP_DISPATCH", "OTP_VERIFY", "ONBOARDING_INVITE", "LEAVE_APPROVAL"
    dispatchStatus: v.union(
      v.literal("QUEUED"),
      v.literal("SENT"),
      v.literal("FAILED"),
      v.literal("BOUNCED"),
      v.literal("NOT_CONFIGURED")
    ),
    providerMessageId: v.optional(v.string()),
    errorMessage: v.optional(v.string()),
    sentAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_workspace_status", ["workspaceId", "dispatchStatus"])
    .index("by_workspace_created", ["workspaceId", "createdAt"]),

  // 6. Security-Restricted User Impersonation Session Audit Ledger
  userImpersonationSessions: defineTable({
    workspaceId: v.id("workspaces"),
    adminUserId: v.id("users"), // Must be authenticated Super Admin
    targetUserId: v.id("users"), // Target user being previewed
    targetEmployeeId: v.optional(v.id("employees")),
    businessReason: v.string(), // Mandatory audit justification
    startedAt: v.number(),
    expiresAt: v.number(), // Strict time-based expiry (e.g. max 30 mins)
    endedAt: v.optional(v.number()),
    status: v.union(
      v.literal("ACTIVE"),
      v.literal("EXPIRED"),
      v.literal("REVOKED")
    ),
    ipAddressMasked: v.optional(v.string()),
    userAgent: v.optional(v.string()),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_admin", ["adminUserId"])
    .index("by_target", ["targetUserId"])
    .index("by_workspace_status", ["workspaceId", "status"]),
`;

// Insert p0Models right before the closing "});"
const lastBraceIdx = schema.lastIndexOf('});');
if (lastBraceIdx !== -1) {
  schema = schema.slice(0, lastBraceIdx) + p0Models + schema.slice(lastBraceIdx);
  fs.writeFileSync(path, schema, 'utf8');
  console.log('Successfully added Batch P0 models to packages/backend/convex/schema.ts!');
} else {
  console.error('Could not find closing }); in schema.ts');
}
