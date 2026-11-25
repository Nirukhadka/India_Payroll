const fs = require('fs');
const schema = fs.readFileSync('packages/backend/convex/schema.ts', 'utf8');

const updatedLoans = `loans: defineTable({
    workspaceId: v.id("workspaces"),
    employeeId: v.id("employees"),
    loanType: v.string(), // "PERSONAL", "SALARY_ADVANCE", "EMERGENCY", "EQUIPMENT", "EDUCATION", "HOUSING"
    purpose: v.optional(v.string()),
    principalAmount: v.number(),
    interestRatePercent: v.number(), // Annual rate e.g. 8.5 (or 0 for interest-free)
    tenureMonths: v.number(),
    monthlyEmiAmount: v.number(),
    startDate: v.optional(v.string()), // "YYYY-MM"
    expectedCompletionDate: v.optional(v.string()), // "YYYY-MM"
    approvalStatus: v.optional(
      v.union(v.literal("PENDING"), v.literal("APPROVED"), v.literal("REJECTED"))
    ),
    approvedBy: v.optional(v.id("users")),
    approvedAt: v.optional(v.number()),
    rejectedBy: v.optional(v.id("users")),
    rejectedAt: v.optional(v.number()),
    rejectionReason: v.optional(v.string()),
    disbursementStatus: v.optional(
      v.union(v.literal("PENDING"), v.literal("DISBURSED"), v.literal("CANCELLED"))
    ),
    disbursedAt: v.optional(v.number()),
    disbursedBy: v.optional(v.id("users")),
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
    closedAt: v.optional(v.number()),
    closedBy: v.optional(v.id("users")),
    closureReason: v.optional(v.string()),
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
    outstandingBalanceAfter: v.optional(v.number()),
    repaymentType: v.optional(
      v.union(v.literal("PAYROLL_DEDUCTION"), v.literal("EARLY_REPAYMENT"), v.literal("PARTIAL_REPAYMENT"), v.literal("MANUAL_ADJUSTMENT"))
    ),
    payrollRunId: v.optional(v.id("payrollRuns")),
    deductionStatus: v.union(
      v.literal("SCHEDULED"),
      v.literal("PROCESSED"),
      v.literal("WAIVED"),
      v.literal("BOUNCED")
    ),
    notes: v.optional(v.string()),
    paidAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_loan", ["loanId"])
    .index("by_workspace_employee", ["workspaceId", "employeeId"])
    .index("by_workspace_month", ["workspaceId", "repaymentMonth"]),`;

const startStr = 'loans: defineTable({';
const endStr = '.index("by_workspace_month", ["workspaceId", "repaymentMonth"]),';

const startIndex = schema.indexOf(startStr);
const endIndex = schema.indexOf(endStr);

if (startIndex === -1 || endIndex === -1) {
  console.error("Could not find start or end block in schema.ts");
  process.exit(1);
}

const newSchema = schema.slice(0, startIndex) + updatedLoans + schema.slice(endIndex + endStr.length);
fs.writeFileSync('packages/backend/convex/schema.ts', newSchema, 'utf8');
console.log("Successfully updated schema.ts with enhanced loan definitions!");
