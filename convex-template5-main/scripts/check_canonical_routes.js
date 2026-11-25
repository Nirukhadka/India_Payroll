const fs = require('fs');

const launcherPath = 'C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/apps/app/src/app/[locale]/(dashboard)/_components/quick-launcher-modal.tsx';
const headerPath = 'C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/apps/app/src/app/[locale]/(admin)/admin/employee/employee-header.tsx';

console.log('--- Quick Launcher Employee Item ---');
const launcherCode = fs.readFileSync(launcherPath, 'utf8');
const empMatch = launcherCode.match(/id:\s*["']employee["'][\s\S]*?href:\s*["']([^"']+)["']/);
if (empMatch) console.log('Launcher target:', empMatch[1]);

console.log('--- Employee Header Overview Route ---');
const headerCode = fs.readFileSync(headerPath, 'utf8');
const overviewMatch = headerCode.match(/name:\s*["']Overview["'][\s\S]*?href:\s*["']([^"']+)["']/);
if (overviewMatch) console.log('Header Overview href:', overviewMatch[1]);
