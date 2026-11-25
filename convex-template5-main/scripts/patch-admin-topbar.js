const fs = require('fs');

const p = 'C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/apps/app/src/app/[locale]/(admin)/admin/admin-topbar.tsx';
let c = fs.readFileSync(p, 'utf8');

c = c.replace(
  'onClick={() => setLauncherOpen(true)}',
  'onClick={() => setLauncherOpen((prev) => !prev)}'
);

c = c.replace(
  `<QuickLauncherModal
        isOpen={launcherOpen}
        onClose={() => setLauncherOpen(false)}
      />`,
  `<QuickLauncherModal
        open={launcherOpen}
        isOpen={launcherOpen}
        onOpenChange={setLauncherOpen}
        onClose={() => setLauncherOpen(false)}
      />`
);

fs.writeFileSync(p, c, 'utf8');
console.log('Successfully updated admin-topbar.tsx');
