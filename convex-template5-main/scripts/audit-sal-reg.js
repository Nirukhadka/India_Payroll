const fs = require('fs');

const helper = fs.readFileSync('packages/backend/convex/payrollReportsHelper.ts', 'utf8');

console.log('--- Checking calculateSalaryRegister ---');
const salReg = helper.slice(helper.indexOf('export async function calculateSalaryRegister'), helper.indexOf('export async function calculatePaymentRegister'));
console.log(salReg);
