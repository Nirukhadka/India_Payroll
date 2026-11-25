const fs = require('fs');

const files = [
  'apps/app/src/app/[locale]/(admin)/admin/system-settings/general/lov/page.tsx',
  'apps/app/src/app/[locale]/(admin)/admin/system-settings/general/bank-branch/page.tsx',
  'apps/app/src/app/[locale]/(admin)/admin/system-settings/employee/emp-no-series/page.tsx',
  'apps/app/src/app/[locale]/(admin)/admin/system-settings/general/company-bank/page.tsx',
  'apps/app/src/app/[locale]/(admin)/admin/system-settings/general/state/page.tsx'
];

files.forEach(f => {
  const full = 'C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/' + f;
  let c = fs.readFileSync(full, 'utf8');
  c = c.replace(/const (save\w+|delete\w+) = useMutation\((.*?)\);/g, 'let $1: any = null;\n  try { $1 = useMutation($2); } catch (e) { $1 = null; }');
  fs.writeFileSync(full, c, 'utf8');
  console.log('Wrapped mutations in:', f);
});
