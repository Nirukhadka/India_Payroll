const fs = require('fs');
const schemaPath = 'packages/backend/convex/schema.ts';
let schema = fs.readFileSync(schemaPath, 'utf8');

// 1. In payrollItems, add reimbursement fields
const piTarget = 'totalLoanDeductions: v.optional(v.number()),';
const piReplacement = `totalLoanDeductions: v.optional(v.number()),
    reimbursementItems: v.optional(
      v.array(
        v.object({
          claimId: v.id("reimbursementClaims"),
          claimNumber: v.string(),
          categoryCode: v.string(),
          taxTreatment: v.string(),
          approvedAmount: v.number(),
          isTaxExempt: v.boolean(),
        })
      )
    ),
    totalReimbursements: v.optional(v.number()),`;

if (schema.includes(piTarget) && !schema.includes('totalReimbursements: v.optional(')) {
  schema = schema.replace(piTarget, piReplacement);
  console.log('Added reimbursementItems to payrollItems in schema');
}

// 2. In reimbursementClaims, replace the existing table with enhanced categories, claims, and audit timeline
const startClaimStr = '  // 3. Employee Reimbursement Claims & Taxable Expense Vouchers\n  reimbursementClaims: defineTable({';
const endClaimStr = '    .index("by_workspace_status", ["workspaceId", "status"]),';

const startIdx = schema.indexOf(startClaimStr);
const endIdx = schema.indexOf(endClaimStr, startIdx);

if (startIdx === -1 || endIdx === -1) {
  console.error("Could not find reimbursementClaims section in schema.ts");
  process.exit(1);
}

const replacementSection = `  // 3a. Configurable Reimbursement Categories
  reimbursementCategories: defineTable({
    workspaceId: v.id("workspaces"),
    categoryCode: v.string(), // "TRAVEL", "MEDICAL", "TELECOM", "FOOD", "HOTEL", "FUEL", "LEARNING", "BOOKS", "GENERAL"
    categoryName: v.string(),
    description: v.optional(v.string()),
    isActive: v.boolean(),
    maxClaimLimit: v.optional(v.number()), // Ceiling in INR (optional)
    receiptRequired: v.boolean(),
    taxTreatment: v.union(
      v.literal("TAXABLE"),
      v.literal("POTENTIALLY_EXEMPT"),
      v.literal("NON_TAXABLE_BUSINESS"),
      v.literal("REQUIRES_REVIEW")
    ),
    requiresManagerApproval: v.boolean(),
    requiresFinanceApproval: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_workspace_code", ["workspaceId", "categoryCode"]),

  // 3b. Employee Reimbursement Claims & Multi-stage Approval Workflow
  reimbursementClaims: defineTable({
    workspaceId: v.id("workspaces"),
    claimNumber: v.string(), // e.g. "CLM-202611-001"
    employeeId: v.id("employees"),
    categoryCode: v.string(), // Foreign key to category
    claimType: v.string(), // Category name or fallback type
    claimAmount: v.number(),
    approvedAmount: v.optional(v.number()),
    expenseDate: v.string(), // "YYYY-MM-DD"
    businessPurpose: v.string(),
    description: v.string(),
    paymentMethod: v.optional(v.string()), // "PAYROLL", "DIRECT_BANK_TRANSFER", "CORPORATE_CARD"
    referenceNumber: v.optional(v.string()),
    billAttachmentStorageId: v.optional(v.id("_storage")),
    billAttachmentUrl: v.optional(v.string()),
    taxTreatment: v.union(
      v.literal("TAXABLE"),
      v.literal("POTENTIALLY_EXEMPT"),
      v.literal("NON_TAXABLE_BUSINESS"),
      v.literal("REQUIRES_REVIEW")
    ),
    isTaxExempt: v.boolean(),
    status: v.union(
      v.literal("DRAFT"),
      v.literal("SUBMITTED"),
      v.literal("MANAGER_REVIEW"),
      v.literal("FINANCE_REVIEW"),
      v.literal("APPROVED"),
      v.literal("REJECTED"),
      v.literal("RETURNED_FOR_CORRECTION"),
      v.literal("ON_HOLD"),
      v.literal("PROCESSING"),
      v.literal("SETTLED"),
      v.literal("CANCELLED")
    ),
    managerReviewedBy: v.optional(v.id("users")),
    managerReviewedAt: v.optional(v.number()),
    managerComments: v.optional(v.string()),
    financeReviewedBy: v.optional(v.id("users")),
    financeReviewedAt: v.optional(v.number()),
    financeComments: v.optional(v.string()),
    rejectionReason: v.optional(v.string()),
    holdReason: v.optional(v.string()),
    reviewedBy: v.optional(v.id("users")),
    reviewedAt: v.optional(v.number()),
    reviewerComments: v.optional(v.string()),
    settledInPayrollMonth: v.optional(v.string()), // "YYYY-MM"
    settledInPayrollRunId: v.optional(v.id("payrollRuns")),
    settledAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_workspace_employee", ["workspaceId", "employeeId"])
    .index("by_workspace_status", ["workspaceId", "status"])
    .index("by_workspace_claim_number", ["workspaceId", "claimNumber"]),

  // 3c. Reimbursement Audit Timeline Ledger
  reimbursementAuditLogs: defineTable({
    workspaceId: v.id("workspaces"),
    claimId: v.id("reimbursementClaims"),
    action: v.string(), // "CREATED_DRAFT", "SUBMITTED", "MANAGER_APPROVED", "FINANCE_APPROVED", "REJECTED", "HELD", "SETTLED", etc.
    actorUserId: v.id("users"),
    fromStatus: v.string(),
    toStatus: v.string(),
    notes: v.optional(v.string()),
    timestamp: v.number(),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_claim", ["claimId"]),`;

schema = schema.slice(0, startIdx) + replacementSection + schema.slice(endIdx + endClaimStr.length);
fs.writeFileSync(schemaPath, schema, 'utf8');
console.log("Successfully updated schema.ts with complete Phase 24 Reimbursements model!");
