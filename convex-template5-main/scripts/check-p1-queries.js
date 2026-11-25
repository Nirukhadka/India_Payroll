const fs = require('fs');

const p1 = fs.readFileSync('apps/app/src/app/[locale]/(dashboard)/reports/page.tsx', 'utf8');

const employeesMatch = p1.match(/api\.employees\.list/);
console.log('Employees query in p1:', !!employeesMatch);

const deptsMatch = p1.match(/departments/i);
console.log('Departments match in p1:', !!deptsMatch);
