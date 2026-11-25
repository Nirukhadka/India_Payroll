const fs = require('fs');

const p1 = fs.readFileSync('apps/app/src/app/[locale]/(dashboard)/reports/page.tsx', 'utf8');
const modalStart = p1.indexOf('{selectedReport && (');
const modalSlice = p1.slice(modalStart, modalStart + 4000);
console.log(modalSlice);
