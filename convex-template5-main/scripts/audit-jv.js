const fs = require('fs');
const helper = fs.readFileSync('packages/backend/convex/payrollReportsHelper.ts', 'utf8');

console.log('--- Checking calculatePayrollSummary, Variance, and JV ---');
const jvIdx = helper.indexOf('export async function calculatePayrollJV');
console.log(helper.slice(helper.indexOf('export async function calculatePayrollSummary'), jvIdx + 1200));
