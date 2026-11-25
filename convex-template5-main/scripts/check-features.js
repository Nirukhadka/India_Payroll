const fs = require('fs');
const p1 = fs.readFileSync('apps/app/src/app/[locale]/(dashboard)/reports/page.tsx', 'utf8');
const p2 = fs.readFileSync('apps/app/src/app/[locale]/(admin)/admin/reports/page.tsx', 'utf8');

console.log('Does p1 have recordExecutionMutation?', p1.includes('recordExecutionMutation'));
console.log('Does p2 have recordExecutionMutation?', p2.includes('recordExecutionMutation'));
console.log('Does p1 have selectedState?', p1.includes('selectedState'));
console.log('Does p2 have selectedState?', p2.includes('selectedState'));
