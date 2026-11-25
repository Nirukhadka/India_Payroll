const fs = require('fs');
const file = 'C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/apps/app/src/app/[locale]/(dashboard)/_components/quick-launcher-modal.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'id: "unite",\n    name: "Unite Marketplace",\n    href: "/settings",\n    isComingSoon: true,',
  'id: "unite",\n    name: "Unite Marketplace",\n    href: "/admin/unite",\n    isComingSoon: false,'
);

// Also handle CRLF if present
content = content.replace(
  'id: "unite",\r\n    name: "Unite Marketplace",\r\n    href: "/settings",\r\n    isComingSoon: true,',
  'id: "unite",\r\n    name: "Unite Marketplace",\r\n    href: "/admin/unite",\r\n    isComingSoon: false,'
);

fs.writeFileSync(file, content, 'utf8');
console.log('Successfully updated launcher modal to /admin/unite!');
