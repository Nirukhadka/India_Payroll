const fs = require('fs');
const content = fs.readFileSync('packages/backend/convex/reports.ts', 'utf8');

const genIdx = content.indexOf('export const generateReportData = query({');
const genEnd = content.indexOf('export const listSavedQueries', genIdx);
console.log(content.slice(genIdx, genEnd));
