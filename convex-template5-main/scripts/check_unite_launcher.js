const fs = require('fs');
const file = 'C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/apps/app/src/app/[locale]/(dashboard)/_components/quick-launcher-modal.tsx';
let content = fs.readFileSync(file, 'utf8');

const uniteIdx = content.indexOf('id: "unite"');
console.log('uniteIdx:', uniteIdx);
if (uniteIdx !== -1) {
  console.log(content.slice(uniteIdx - 20, uniteIdx + 200));
}
