const fs = require('fs');
const helper = fs.readFileSync('packages/backend/convex/payrollReportsHelper.ts', 'utf8');

console.log('--- Checking calculateLoanDeductions and calculateReimbursementSummary ---');
const loanIdx = helper.indexOf('export async function calculateLoanDeductions');
console.log(helper.slice(loanIdx));
