const fs = require('fs');

const p1 = fs.readFileSync('apps/app/src/app/[locale]/(dashboard)/reports/page.tsx', 'utf8');
const p2 = fs.readFileSync('apps/app/src/app/[locale]/(admin)/admin/reports/page.tsx', 'utf8');

console.log('(dashboard)/reports/page.tsx length:', p1.length);
console.log('(admin)/admin/reports/page.tsx length:', p2.length);

// Compare imports and component signature
console.log('p1 lines:', p1.split('\n').length);
console.log('p2 lines:', p2.split('\n').length);
