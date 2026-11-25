const fs = require('fs');
const content = fs.readFileSync('apps/app/src/app/[locale]/(dashboard)/reports/page.tsx', 'utf8');
const lines = content.split('\n');
console.log(lines.slice(440, 560).join('\n'));
