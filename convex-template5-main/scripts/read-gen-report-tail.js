const fs = require('fs');
const content = fs.readFileSync('packages/backend/convex/reports.ts', 'utf8');
const lines = content.split('\n');
const genLine = lines.findIndex(l => l.includes('export const generateReportData'));
console.log(lines.slice(genLine + 115, genLine + 250).join('\n'));
