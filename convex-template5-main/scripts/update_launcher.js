const fs = require('fs');
const file = 'C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/apps/app/src/app/[locale]/(dashboard)/_components/quick-launcher-modal.tsx';
let content = fs.readFileSync(file, 'utf8');

const target = `    {
      id: "unite",
      name: "Unite Marketplace",
      href: "/settings",
      isComingSoon: true,`;

const replacement = `    {
      id: "unite",
      name: "Unite Marketplace",
      href: "/admin/unite",
      isComingSoon: false,`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync(file, content, 'utf8');
  console.log('Successfully updated quick-launcher-modal.tsx to /admin/unite');
} else {
  console.log('Target string not found in quick-launcher-modal.tsx');
}
