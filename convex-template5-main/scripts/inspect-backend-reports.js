const fs = require('fs');
const content = fs.readFileSync('packages/backend/convex/reports.ts', 'utf8');
console.log('reports.ts size:', content.length, 'bytes');
const funcs = content.match(/export const \w+ = (query|mutation)/g);
console.log('Exported functions in reports.ts:', funcs);
