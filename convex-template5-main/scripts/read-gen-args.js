const fs = require('fs');
const content = fs.readFileSync('packages/backend/convex/reports.ts', 'utf8');

const queryArgsIdx = content.indexOf('export const generateReportData = query({');
console.log(content.slice(queryArgsIdx, queryArgsIdx + 600));
