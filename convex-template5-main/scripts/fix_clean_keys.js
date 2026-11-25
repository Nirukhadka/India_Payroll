const fs = require('fs');

// 1. take-tour-modal.tsx: Use step.title as key
let tour = fs.readFileSync('C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/apps/app/src/app/[locale]/(admin)/admin/unite/take-tour-modal.tsx', 'utf8');
tour = tour.replace(/key=\{`tour_step_\$\{idx\}`\}/g, 'key={steps[idx].title}');
fs.writeFileSync('C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/apps/app/src/app/[locale]/(admin)/admin/unite/take-tour-modal.tsx', tour, 'utf8');

// 2. app-details-modal.tsx: Use item values as key
let modal = fs.readFileSync('C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/apps/app/src/app/[locale]/(admin)/admin/unite/app-details-modal.tsx', 'utf8');
modal = modal.replace(/key=\{`item_\$\{i\}`\}/g, 'key={d}');
modal = modal.replace(/\{app\.securityCompliance\.map\(\(s, i\) => \(\s*<li\s*key=\{d\}/g, '{app.securityCompliance.map((s) => (\n                      <li\n                        key={s}');
fs.writeFileSync('C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/apps/app/src/app/[locale]/(admin)/admin/unite/app-details-modal.tsx', modal, 'utf8');

// 3. unite-marketplace-view.tsx: Use feat value as key
let view = fs.readFileSync('C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/apps/app/src/app/[locale]/(admin)/admin/unite/unite-marketplace-view.tsx', 'utf8');
view = view.replace(/key=\{`feat_\$\{i\}`\}/g, 'key={feat}');
fs.writeFileSync('C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/apps/app/src/app/[locale]/(admin)/admin/unite/unite-marketplace-view.tsx', view, 'utf8');

console.log('Replaced all array index keys with stable identifiers.');
