const fs = require('fs');

const oldContent = fs.readFileSync(
  'C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/apps/app/src/app/[locale]/(dashboard)/reports/page.tsx',
  'utf8'
);

// Save backup as payroll-history/page.tsx
const targetDir = 'C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/apps/app/src/app/[locale]/(dashboard)/reports/payroll-history';
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Update the backup file
fs.writeFileSync(targetDir + '/page.tsx', oldContent, 'utf8');
console.log('Saved payroll-history/page.tsx backup');

// Now read the full admin gallery page to adapt for /reports
const adminGallery = fs.readFileSync(
  'C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/apps/app/src/app/[locale]/(admin)/admin/reports/page.tsx',
  'utf8'
);
console.log('Admin gallery size:', adminGallery.length);
