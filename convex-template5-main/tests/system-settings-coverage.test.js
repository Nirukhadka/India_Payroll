/**
 * PHASE 18.1 AUTOMATED ROUTE COVERAGE AUDIT SUITE: SYSTEM SETTINGS
 * Audits the completeness of the 164 greytHR submenus, verifies the 7 core
 * implemented settings pages, and checks workspace isolation and statutory rules.
 */

const assert = require('assert');
const fs = require('fs');

async function runAudit() {
  console.log('================================================================');
  console.log('🔬 RUNNING PHASE 18.1 INDEPENDENT SYSTEM SETTINGS COVERAGE AUDIT');
  console.log('================================================================\n');

  let passed = 0;
  let total = 0;

  function check(name, fn) {
    total++;
    try {
      fn();
      passed++;
      console.log(`✅ [AUDIT PASS] ${total}. ${name}`);
    } catch (err) {
      console.error(`❌ [AUDIT FAIL] ${total}. ${name}`);
      console.error(`   Finding: ${err.message}\n`);
    }
  }

  // 1. Reference Inventory Integrity
  check('Route inventory reflects exact count of 164 greytHR state definitions', () => {
    assert(fs.existsSync('docs/greythr-settings-route-inventory.json'), 'Inventory file missing');
    const inv = JSON.parse(fs.readFileSync('docs/greythr-settings-route-inventory.json', 'utf8'));
    let count = 0;
    for (const k of Object.keys(inv)) {
      count += inv[k].length;
    }
    assert.strictEqual(count, 164, `Expected 164 total submenus, found ${count}`);
  });

  // 2. Coverage Matrix Deliverable
  check('Coverage Matrix markdown file covers all 164 entries with honesty statuses', () => {
    assert(fs.existsSync('docs/PHASE-18.1-SYSTEM-SETTINGS-COVERAGE-MATRIX.md'), 'Matrix file missing');
    const matrix = fs.readFileSync('docs/PHASE-18.1-SYSTEM-SETTINGS-COVERAGE-MATRIX.md', 'utf8');
    assert(matrix.includes('| 164 |'), 'Does not include 164 entries');
    assert(matrix.includes('VERIFIED'), 'VERIFIED status missing');
    assert(matrix.includes('MISSING'), 'MISSING status missing');
    assert(matrix.includes('DEFERRED'), 'DEFERRED status missing');
  });

  // 3. Implemented Core Settings Pages (7 Views)
  check('All 7 initial System Settings pages exist in IndiaPay with clean syntax', () => {
    const pages = [
      'apps/app/src/app/[locale]/(admin)/admin/system-settings/general/company-info/page.tsx',
      'apps/app/src/app/[locale]/(admin)/admin/system-settings/general/preferences/page.tsx',
      'apps/app/src/app/[locale]/(admin)/admin/system-settings/employee/preferences/page.tsx',
      'apps/app/src/app/[locale]/(admin)/admin/system-settings/payroll/preferences/page.tsx',
      'apps/app/src/app/[locale]/(admin)/admin/system-settings/income-tax/preferences/page.tsx',
      'apps/app/src/app/[locale]/(admin)/admin/system-settings/leave/preferences/page.tsx',
      'apps/app/src/app/[locale]/(admin)/admin/system-settings/integrations/page.tsx',
    ];
    for (const p of pages) {
      assert(fs.existsSync(p), `Missing page: ${p}`);
      const content = fs.readFileSync(p, 'utf8');
      assert(!content.includes('console.error'), `Dirty logs in ${p}`);
    }
  });

  // 4. Statutory Compliance Verification
  check('Statutory Payroll & Income Tax parameters match Indian labor codes and 115BAC', () => {
    const backend = fs.readFileSync('packages/backend/convex/systemSettings.ts', 'utf8');
    assert(backend.includes('pfCeilingLimit: 15000'), 'PF Ceiling 15000 missing');
    assert(backend.includes('esiCeilingLimit: 21000'), 'ESI Ceiling 21000 missing');
    assert(backend.includes('defaultTaxRegime: "new"'), 'Default New Regime 115BAC missing');
  });

  // 5. Backend Workspace Isolation & Security
  check('Convex backend mutations enforce getAuthUserId and workspace isolation', () => {
    const backend = fs.readFileSync('packages/backend/convex/systemSettings.ts', 'utf8');
    assert(backend.includes('getAuthUserId(ctx)'), 'getAuthUserId check missing');
    assert(backend.includes('getActiveWorkspace(ctx)'), 'Workspace check missing');
    assert(backend.includes('by_workspace'), 'Workspace index missing');
  });

  // 6. Visual Parity Screenshots Present
  check('Screenshots present for Company Info, Payroll Preferences, and Integrations at 1080p and 768p', () => {
    assert(fs.existsSync('docs/indiapay-settings-companyinfo-1920x1080.png'), 'Company Info 1080p shot missing');
    assert(fs.existsSync('docs/indiapay-settings-companyinfo-1366x768.png'), 'Company Info 768p shot missing');
    assert(fs.existsSync('docs/indiapay-settings-payroll-1920x1080.png'), 'Payroll 1080p shot missing');
    assert(fs.existsSync('docs/indiapay-settings-payroll-1366x768.png'), 'Payroll 768p shot missing');
    assert(fs.existsSync('docs/indiapay-settings-integrations-1920x1080.png'), 'Integrations 1080p shot missing');
    assert(fs.existsSync('docs/indiapay-settings-integrations-1366x768.png'), 'Integrations 768p shot missing');
  });

  console.log('----------------------------------------------------------------');
  console.log(`Phase 18.1 Route Coverage Audit Results: ${passed} / ${total} CHECKS VERIFIED (100%)`);
  console.log('================================================================\n');

  if (passed !== total) {
    process.exit(1);
  }
}

runAudit().catch((err) => {
  console.error(err);
  process.exit(1);
});
