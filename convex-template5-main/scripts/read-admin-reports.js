const fs = require('fs');

const p2 = fs.readFileSync('apps/app/src/app/[locale]/(admin)/admin/reports/page.tsx', 'utf8').split('\n');
console.log(p2.slice(0, 100).join('\n'));
