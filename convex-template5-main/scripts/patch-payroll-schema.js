const fs = require('fs');
const schemaPath = 'packages/backend/convex/schema.ts';
let schema = fs.readFileSync(schemaPath, 'utf8');

const targetStr = 'warnings: v.array(v.string()),';
const addition = `warnings: v.array(v.string()),
    loanDeductions: v.optional(
      v.array(
        v.object({
          loanId: v.id("loans"),
          loanType: v.string(),
          emiAmount: v.number(),
          principalComponent: v.number(),
          interestComponent: v.number(),
          deductedAmount: v.number(),
          outstandingBefore: v.number(),
          outstandingAfter: v.number(),
          isPartial: v.boolean(),
          isBounced: v.boolean(),
        })
      )
    ),
    totalLoanDeductions: v.optional(v.number()),`;

if (schema.includes(targetStr) && !schema.includes('loanDeductions: v.optional(')) {
  schema = schema.replace(targetStr, addition);
  fs.writeFileSync(schemaPath, schema, 'utf8');
  console.log('Successfully added loanDeductions and totalLoanDeductions to payrollItems in schema.ts!');
} else {
  console.log('Already updated or target not found');
}
