const fs = require('fs');

const files = [
  'C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/apps/app/src/app/[locale]/(admin)/admin/unite/book-demo-modal.tsx',
  'C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/apps/app/src/app/[locale]/(admin)/admin/unite/take-tour-modal.tsx',
  'C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/apps/app/src/app/[locale]/(admin)/admin/unite/app-details-modal.tsx',
  'C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/apps/app/src/app/[locale]/(admin)/admin/unite/unite-marketplace-view.tsx',
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/from "@\/convex\/_generated\/api"/g, 'from "@v1/backend/convex/_generated/api"');
  content = content.replace(/from "@\/convex\/_generated\/dataModel"/g, 'from "@v1/backend/convex/_generated/dataModel"');
  fs.writeFileSync(file, content, 'utf8');
  console.log('Fixed imports in:', file);
}
