const fs = require('fs');

const p1 = fs.readFileSync('apps/app/src/app/[locale]/(dashboard)/reports/page.tsx', 'utf8');
const lines = p1.split('\n');

const modalOpenIdx = lines.findIndex(l => l.includes('{selectedReport && ('));
const modalCloseIdx = lines.findIndex((l, i) => i > modalOpenIdx && l.includes('/* Data Preview Table */'));

console.log('Modal parameter section lines:');
console.log(lines.slice(modalOpenIdx, modalOpenIdx + 85).join('\n'));
