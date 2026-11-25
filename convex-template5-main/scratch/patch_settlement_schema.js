const fs = require('fs');
const file = 'C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/packages/backend/convex/schema.ts';
let content = fs.readFileSync(file, 'utf8');

// 1. Add fields to payrollItems if not exists
if (!content.includes('amountPaid: v.optional(v.number())')) {
  content = content.replace(
    'paymentReference: v.optional(v.string()),',
    `paymentReference: v.optional(v.string()),
    amountPaid: v.optional(v.number()),
    remainingBalance: v.optional(v.number()),
    settlementEvidenceReference: v.optional(v.string()),
    settlementVerifiedAt: v.optional(v.number()),
    settlementVerifiedById: v.optional(v.id("users")),`
  );
}

// 2. Add payrollSettlementAuditLogs table if not exists
if (!content.includes('payrollSettlementAuditLogs: defineTable')) {
  const target = 'systemPayrollPreferences: defineTable({';
  const newTable = `payrollSettlementAuditLogs: defineTable({
    workspaceId: v.id("workspaces"),
    payrollRunId: v.id("payrollRuns"),
    payrollItemId: v.id("payrollItems"),
    employeeId: v.id("employees"),
    action: v.string(), // "STATUS_CHANGE" | "PAYMENT_RECORDED" | "DUPLICATE_ATTEMPT_BLOCKED"
    previousStatus: v.optional(v.string()),
    newStatus: v.string(),
    amount: v.number(),
    remainingBalance: v.number(),
    paymentMode: v.string(),
    evidenceReference: v.string(),
    performedById: v.id("users"),
    timestamp: v.number(),
  })
    .index("by_workspace", ["workspaceId"])
    .index("by_item", ["payrollItemId"])
    .index("by_run", ["payrollRunId"]),

  `;
  content = content.replace(target, newTable + target);
}

fs.writeFileSync(file, content, 'utf8');
console.log("Successfully updated schema.ts with settlement audit logs and balance tracking!");
