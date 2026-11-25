const fs = require('fs');

console.log('--- Inspecting packages/backend/convex/payrollReportsHelper.ts ---');
const helperCode = fs.readFileSync('packages/backend/convex/payrollReportsHelper.ts', 'utf8');
console.log('Helper size:', helperCode.length, 'bytes');

const funcs = helperCode.match(/export async function \w+/g);
console.log('Exported functions in payrollReportsHelper.ts:', funcs);
