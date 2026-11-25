const fs = require('fs');
const content = fs.readFileSync('apps/app/src/app/[locale]/(admin)/admin/reports/reports-registry.ts', 'utf8');

const reportRegex = /id:\s*"([^"]+)",\s*name:\s*"([^"]+)"/g;
let match;
const items = [];
while ((match = reportRegex.exec(content)) !== null) {
  items.push({ id: match[1], name: match[2] });
}
console.log('Total report items extracted from registry:', items.length);
console.log('First 5:', items.slice(0, 5));
console.log('Last 5:', items.slice(-5));
