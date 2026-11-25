const fs = require('fs');
const file = 'apps/app/src/app/[locale]/(admin)/admin/payroll/payroll-header.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(
  '{ title: "Reimbursement", href: "/admin/payroll/inputs" }',
  '{ title: "Reimbursement", href: "/admin/payroll/reimbursements" }'
);
fs.writeFileSync(file, content, 'utf8');
console.log('Updated payroll-header.tsx');
