const fs = require('fs');
const content = fs.readFileSync('packages/backend/convex/reports.ts', 'utf8');
const genIdx = content.indexOf('export const generateReportData');
console.log(content.slice(genIdx, genIdx + 3000));
