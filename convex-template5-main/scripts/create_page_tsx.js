const fs = require('fs');
const content = `import { UniteMarketplaceView } from "./unite-marketplace-view";

export default function UnitePage() {
  return <UniteMarketplaceView />;
}
`;
fs.writeFileSync('C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/apps/app/src/app/[locale]/(admin)/admin/unite/page.tsx', content, 'utf8');
console.log('Created page.tsx successfully');
