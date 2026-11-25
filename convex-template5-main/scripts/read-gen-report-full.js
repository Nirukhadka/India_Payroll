const fs = require('fs');
const content = fs.readFileSync('packages/backend/convex/reports.ts', 'utf8');
const lines = content.split('\n');
console.log('Total lines in reports.ts:', lines.length);
const genLine = lines.findIndex(l => l.includes('export const generateReportData'));
console.log(lines.slice(genLine, genLine + 120).join('\n'));
