const fs = require('fs');
const p1 = fs.readFileSync('apps/app/src/app/[locale]/(dashboard)/reports/page.tsx', 'utf8').split('\n');
console.log(p1.slice(100, 260).join('\n'));
