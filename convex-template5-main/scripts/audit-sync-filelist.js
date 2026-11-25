const fs = require('fs');
const path = require('path');

function getFiles(dir, baseDir = '') {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const relPath = path.join(baseDir, file);
    const stat = fs.statSync(fullPath);

    // Exclusion rules
    if (file === '.git' || file === 'node_modules' || file === '.next' || file === '.turbo') return;
    if (file.startsWith('.env') && !file.endsWith('.example')) return; // exclude secret envs, keep .env.example
    if (file.endsWith('.bak') || file.endsWith('.bak2') || file.endsWith('.log')) return;
    if (baseDir === 'scripts' && !['provisionDevAccounts.ts', 'patch-node-windows.js'].includes(file)) return; // exclude diagnostic scripts

    if (stat.isDirectory()) {
      results = results.concat(getFiles(fullPath, relPath));
    } else {
      results.push(relPath);
    }
  });
  return results;
}

const allAppFiles = getFiles('.');
console.log('Total production files to transfer:', allAppFiles.length);

// Check presence of key features
const keyChecks = [
  'packages/backend/convex/loans.ts',
  'packages/backend/convex/loanEngine.ts',
  'packages/backend/convex/reimbursements.ts',
  'packages/backend/convex/payrollReportsHelper.ts',
  'apps/app/src/app/[locale]/(admin)/admin/payroll/loans/page.tsx',
  'apps/app/src/app/[locale]/(admin)/admin/payroll/reimbursements/page.tsx',
  'apps/app/src/app/[locale]/(admin)/admin/reports/report-parameter-schemas.ts',
  'tests/reports-gallery-r3-payroll.test.js'
];

console.log('\nKey feature checks:');
keyChecks.forEach(k => {
  const norm = k.replace(/\//g, path.sep);
  const found = allAppFiles.includes(norm);
  console.log(`- ${k}: ${found ? 'INCLUDED' : 'MISSING'}`);
});
