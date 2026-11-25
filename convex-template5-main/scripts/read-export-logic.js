const fs = require('fs');
const p1 = fs.readFileSync('apps/app/src/app/[locale]/(dashboard)/reports/page.tsx', 'utf8');

const exportIdx = p1.indexOf('handleExecuteExport');
console.log(p1.slice(exportIdx, exportIdx + 1200));
