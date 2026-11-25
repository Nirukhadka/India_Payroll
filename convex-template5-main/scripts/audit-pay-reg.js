const fs = require('fs');
const helper = fs.readFileSync('packages/backend/convex/payrollReportsHelper.ts', 'utf8');

console.log('--- Checking calculatePaymentRegister & BankTransfer ---');
const payReg = helper.slice(helper.indexOf('export async function calculatePaymentRegister'), helper.indexOf('export async function calculatePayrollSummary'));
console.log(payReg);
