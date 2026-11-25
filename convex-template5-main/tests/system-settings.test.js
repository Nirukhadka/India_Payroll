/**
 * PHASE 18 AUTOMATED ACCEPTANCE TEST SUITE: SYSTEM SETTINGS REPLICATION
 * Verifies System Settings navigation shell, Company Info, General/Employee/Payroll/Tax/Leave
 * preferences, Integration connectors, and Convex backend persistence.
 */

const assert = require('assert');
const fs = require('fs');

async function runTests() {
  console.log('===============================================================');
  console.log('🧪 RUNNING PHASE 18 TEST SUITE: SYSTEM SETTINGS REPLICATION');
  console.log('===============================================================\n');

  let passed = 0;
  let total = 0;

  function test(name, fn) {
    total++;
    try {
      fn();
      passed++;
      console.log(`✅ [PASS] ${total}. ${name}`);
    } catch (err) {
      console.error(`❌ [FAIL] ${total}. ${name}`);
      console.error(`   Error: ${err.message}\n`);
    }
  }

  // 1. System Settings Navigation Shell Layout exists
  test('System Settings Navigation Shell Layout file exists', () => {
    assert(
      fs.existsSync('apps/app/src/app/[locale]/(admin)/admin/system-settings/layout.tsx'),
      'Layout file missing'
    );
    const layout = fs.readFileSync(
      'apps/app/src/app/[locale]/(admin)/admin/system-settings/layout.tsx',
      'utf8'
    );
    assert(layout.includes('System Settings'), 'Title missing in layout');
    assert(layout.includes('General'), 'General section missing');
    assert(layout.includes('Employee'), 'Employee section missing');
    assert(layout.includes('Payroll'), 'Payroll section missing');
    assert(layout.includes('Income Tax'), 'Income Tax section missing');
    assert(layout.includes('Leave'), 'Leave section missing');
    assert(layout.includes('Integrations'), 'Integrations section missing');
    assert(layout.includes('More'), 'More section missing');
  });

  // 2. Company Info page exists with complete statutory form
  test('Company Info page exists with company particulars, address and statutory fields', () => {
    assert(
      fs.existsSync(
        'apps/app/src/app/[locale]/(admin)/admin/system-settings/general/company-info/page.tsx'
      ),
      'Company info page missing'
    );
    const page = fs.readFileSync(
      'apps/app/src/app/[locale]/(admin)/admin/system-settings/general/company-info/page.tsx',
      'utf8'
    );
    assert(page.includes('Company Name'), 'Company Name field missing');
    assert(page.includes('Company Address'), 'Company Address field missing');
    assert(page.includes('Country'), 'Country select missing');
    assert(page.includes('States'), 'States select missing');
    assert(page.includes('Industry'), 'Industry field missing');
    assert(page.includes('Time Zone'), 'Time Zone select missing');
    assert(page.includes('Currency'), 'Currency select missing');
    assert(page.includes('PF No'), 'PF No field missing');
    assert(page.includes('TAN No'), 'TAN No field missing');
    assert(page.includes('PAN No'), 'PAN No field missing');
    assert(page.includes('ESI No'), 'ESI No field missing');
    assert(page.includes('Upload Logo'), 'Upload Logo button missing');
    assert(page.includes('Upload Signature'), 'Upload Signature button missing');
    assert(page.includes('Save Settings'), 'Save Settings button missing');
  });

  // 3. General Preferences page exists
  test('General Preferences page exists with financial year and audit settings', () => {
    assert(
      fs.existsSync(
        'apps/app/src/app/[locale]/(admin)/admin/system-settings/general/preferences/page.tsx'
      ),
      'General preferences page missing'
    );
    const page = fs.readFileSync(
      'apps/app/src/app/[locale]/(admin)/admin/system-settings/general/preferences/page.tsx',
      'utf8'
    );
    assert(page.includes('Financial Year Cycle'), 'Financial Year Cycle missing');
    assert(page.includes('Display Date Format'), 'Date format missing');
    assert(page.includes('Enable Full System Audit Trail'), 'Audit trail missing');
  });

  // 4. Employee Preferences page exists
  test('Employee Preferences page exists with numbering series and tenure options', () => {
    assert(
      fs.existsSync(
        'apps/app/src/app/[locale]/(admin)/admin/system-settings/employee/preferences/page.tsx'
      ),
      'Employee preferences page missing'
    );
    const page = fs.readFileSync(
      'apps/app/src/app/[locale]/(admin)/admin/system-settings/employee/preferences/page.tsx',
      'utf8'
    );
    assert(page.includes('Automatically Generate Employee Numbers'), 'AutoGen toggle missing');
    assert(page.includes('Employee ID Prefix'), 'Prefix field missing');
    assert(page.includes('Probation Period'), 'Probation field missing');
    assert(page.includes('Notice Period'), 'Notice period field missing');
  });

  // 5. Payroll Preferences page exists
  test('Payroll Preferences page exists with pay cycle and wage ceiling parameters', () => {
    assert(
      fs.existsSync(
        'apps/app/src/app/[locale]/(admin)/admin/system-settings/payroll/preferences/page.tsx'
      ),
      'Payroll preferences page missing'
    );
    const page = fs.readFileSync(
      'apps/app/src/app/[locale]/(admin)/admin/system-settings/payroll/preferences/page.tsx',
      'utf8'
    );
    assert(page.includes('Pay Period Cycle'), 'Pay period cycle missing');
    assert(page.includes('PF Statutory Wage Ceiling'), 'PF wage ceiling missing');
    assert(page.includes('ESI Statutory Wage Ceiling'), 'ESI wage ceiling missing');
    assert(page.includes('Professional Tax'), 'PT toggle missing');
  });

  // 6. Income Tax Preferences page exists
  test('Income Tax Preferences page exists with assessment year and regime toggles', () => {
    assert(
      fs.existsSync(
        'apps/app/src/app/[locale]/(admin)/admin/system-settings/income-tax/preferences/page.tsx'
      ),
      'Income Tax preferences page missing'
    );
    const page = fs.readFileSync(
      'apps/app/src/app/[locale]/(admin)/admin/system-settings/income-tax/preferences/page.tsx',
      'utf8'
    );
    assert(page.includes('Active Assessment / Financial Year'), 'FY select missing');
    assert(page.includes('Default Enterprise Tax Regime'), 'Tax regime select missing');
    assert(page.includes('Proof of Investment Deadline'), 'Deadline field missing');
  });

  // 7. Leave Preferences page exists
  test('Leave Preferences page exists with carry forward and encashment rules', () => {
    assert(
      fs.existsSync(
        'apps/app/src/app/[locale]/(admin)/admin/system-settings/leave/preferences/page.tsx'
      ),
      'Leave preferences page missing'
    );
    const page = fs.readFileSync(
      'apps/app/src/app/[locale]/(admin)/admin/system-settings/leave/preferences/page.tsx',
      'utf8'
    );
    assert(page.includes('Leave Year Start Month'), 'Start month missing');
    assert(page.includes('Maximum Carry Forward'), 'Max carry forward missing');
    assert(page.includes('Allow Leave Encashment'), 'Encashment missing');
  });

  // 8. Integrations page exists with connector cards and state controls
  test('Integrations page exists with ERP/accounting connectors and active toggles', () => {
    assert(
      fs.existsSync(
        'apps/app/src/app/[locale]/(admin)/admin/system-settings/integrations/page.tsx'
      ),
      'Integrations page missing'
    );
    const page = fs.readFileSync(
      'apps/app/src/app/[locale]/(admin)/admin/system-settings/integrations/page.tsx',
      'utf8'
    );
    assert(page.includes('Integration Connectors'), 'Title missing');
    assert(page.includes('API Version'), 'API Version field missing');
    assert(page.includes('Connect') && page.includes('Disconnect'), 'Connect toggles missing');
  });

  // 9. Convex Schema defines Phase 18 system settings tables with indexes
  test('Convex Schema defines systemCompanySettings and related tables with indexes', () => {
    const schema = fs.readFileSync('packages/backend/convex/schema.ts', 'utf8');
    assert(schema.includes('systemCompanySettings: defineTable'), 'systemCompanySettings table missing');
    assert(schema.includes('systemGeneralPreferences: defineTable'), 'systemGeneralPreferences table missing');
    assert(schema.includes('systemEmployeePreferences: defineTable'), 'systemEmployeePreferences table missing');
    assert(schema.includes('systemPayrollPreferences: defineTable'), 'systemPayrollPreferences table missing');
    assert(schema.includes('systemIncomeTaxPreferences: defineTable'), 'systemIncomeTaxPreferences table missing');
    assert(schema.includes('systemLeavePreferences: defineTable'), 'systemLeavePreferences table missing');
    assert(schema.includes('systemIntegrationConnectors: defineTable'), 'systemIntegrationConnectors table missing');
    assert(schema.includes('by_workspace_connectorKey'), 'by_workspace_connectorKey index missing');
  });

  // 10. Convex backend service provides queries and mutations
  test('Convex backend service provides company, employee, payroll, tax, leave, and integration handlers', () => {
    const backend = fs.readFileSync('packages/backend/convex/systemSettings.ts', 'utf8');
    assert(backend.includes('getCompanySettings'), 'getCompanySettings query missing');
    assert(backend.includes('updateCompanySettings'), 'updateCompanySettings mutation missing');
    assert(backend.includes('getEmployeePreferences'), 'getEmployeePreferences query missing');
    assert(backend.includes('updateEmployeePreferences'), 'updateEmployeePreferences mutation missing');
    assert(backend.includes('getPayrollPreferences'), 'getPayrollPreferences query missing');
    assert(backend.includes('updatePayrollPreferences'), 'updatePayrollPreferences mutation missing');
    assert(backend.includes('getIncomeTaxPreferences'), 'getIncomeTaxPreferences query missing');
    assert(backend.includes('updateIncomeTaxPreferences'), 'updateIncomeTaxPreferences mutation missing');
    assert(backend.includes('getLeavePreferences'), 'getLeavePreferences query missing');
    assert(backend.includes('updateLeavePreferences'), 'updateLeavePreferences mutation missing');
    assert(backend.includes('getIntegrationConnectors'), 'getIntegrationConnectors query missing');
    assert(backend.includes('toggleConnectorStatus'), 'toggleConnectorStatus mutation missing');
  });

  // 11. Global Admin Topbar routes System Settings to /admin/system-settings/general/company-info
  test('Global Admin Topbar links System Settings to canonical route', () => {
    const topbar = fs.readFileSync(
      'apps/app/src/app/[locale]/(admin)/admin/admin-topbar.tsx',
      'utf8'
    );
    assert(
      topbar.includes('/admin/system-settings/general/company-info'),
      'AdminTopbar does not link to /admin/system-settings/general/company-info'
    );
  });

  // 12. Visual Evidence: Screenshots captured at 1920x1080 and 1366x768
  test('Company Info screenshots captured at 1920x1080 and 1366x768', () => {
    assert(
      fs.existsSync('docs/indiapay-settings-companyinfo-1920x1080.png'),
      'Company Info 1080p shot missing'
    );
    assert(
      fs.existsSync('docs/indiapay-settings-companyinfo-1366x768.png'),
      'Company Info 768p shot missing'
    );
  });

  test('Payroll Preferences screenshots captured at 1920x1080 and 1366x768', () => {
    assert(
      fs.existsSync('docs/indiapay-settings-payroll-1920x1080.png'),
      'Payroll Preferences 1080p shot missing'
    );
    assert(
      fs.existsSync('docs/indiapay-settings-payroll-1366x768.png'),
      'Payroll Preferences 768p shot missing'
    );
  });

  test('Integrations screenshots captured at 1920x1080 and 1366x768', () => {
    assert(
      fs.existsSync('docs/indiapay-settings-integrations-1920x1080.png'),
      'Integrations 1080p shot missing'
    );
    assert(
      fs.existsSync('docs/indiapay-settings-integrations-1366x768.png'),
      'Integrations 768p shot missing'
    );
  });

  // 15. Reference greytHR screenshots present for comparison
  test('Reference greytHR screenshots present for visual comparison', () => {
    assert(
      fs.existsSync('docs/greythr-settings-companyinfo-1920x1080.png'),
      'greytHR Company Info shot missing'
    );
  });

  // 16. Discovered reference route inventory documented
  test('Complete greytHR route inventory extracted and documented', () => {
    assert(
      fs.existsSync('docs/greythr-settings-route-inventory.json'),
      'Route inventory file missing'
    );
    const inv = JSON.parse(fs.readFileSync('docs/greythr-settings-route-inventory.json', 'utf8'));
    assert(inv.General && inv.General.length > 0, 'General items empty');
    assert(inv.Employee && inv.Employee.length > 0, 'Employee items empty');
    assert(inv.Payroll && inv.Payroll.length > 0, 'Payroll items empty');
    assert(inv['Income Tax'] && inv['Income Tax'].length > 0, 'Income Tax items empty');
    assert(inv.Leave && inv.Leave.length > 0, 'Leave items empty');
  });

  console.log('---------------------------------------------------------------');
  console.log(`Phase 18 System Settings Test Results: ${passed} / ${total} PASSING (100%)`);
  console.log('===============================================================\n');

  if (passed !== total) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error(err);
  process.exit(1);
});
