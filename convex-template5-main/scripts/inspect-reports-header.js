const fs = require('fs');

console.log('--- apps/app/src/app/[locale]/(dashboard)/reports/page.tsx (lines 1 - 100) ---');
const p1 = fs.readFileSync('apps/app/src/app/[locale]/(dashboard)/reports/page.tsx', 'utf8').split('\n');
console.log(p1.slice(0, 100).join('\n'));

console.log('\n--- apps/app/src/app/[locale]/(admin)/admin/reports/reports-header.tsx ---');
const p2 = fs.readFileSync('apps/app/src/app/[locale]/(admin)/admin/reports/reports-header.tsx', 'utf8');
console.log(p2);
