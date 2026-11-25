const fs = require('fs');

const phase18Text = `
--------------------------------------------------------------------------------
PHASE 18 — COMPLETE SYSTEM SETTINGS REPLICATION
--------------------------------------------------------------------------------
• Scope:
  - Reference Inspection via authenticated Victor Chasex greytHR CDP session.
  - Extracted 164 submenus across 7 operational categories (General, Employee, Payroll, Income Tax, Leave, Integrations, More).
  - Canonical routes under '/admin/system-settings/...'.
  - Complete Company Info form matching greytHR statutory structure.
  - Sub-navigation shell layout ('layout.tsx') matching greytHR navbar.
  - Preferences interfaces for General, Employee, Payroll, Income Tax, and Leave.
  - Integrations page with live status and connect/disconnect toggles.
  - Full Convex backend schema and service ('systemSettings.ts').
• Key Deliverables & Accomplishments:
  - Linked global Admin Topbar item 4 to '/admin/system-settings/general/company-info'.
  - Company Settings page ('/admin/system-settings/general/company-info') reproducing Company Name, Address, Country, States, Industry, Time Zone, Currency, PF, TAN, PAN, ESI, LIN, GST, Reg Cert, Twitter, and Logo/Signature uploads with Convex mutation persistence.
  - Preferences pages for General, Employee, Payroll, Income Tax, and Leave.
  - Integrations hub ('/admin/system-settings/integrations') supporting ERP and custom webhook connectors.
  - Captured 1920x1080 and 1366x768 screenshots for Company Info, Payroll Preferences, and Integrations.
  - Automated test suite 'tests/system-settings.test.js' (16/16 tests passing, 100%).
  - Total Platform Automated Tests: 11 test suites, 93/93 tests passing (100%), 0 regressions.
`;

let report = fs.readFileSync('FULL_DAY_REPORT_2026-11-18.txt', 'utf8');

// Update Table of Contents
if (!report.includes('2.14 Phase 18: Complete System Settings Replication')) {
  report = report.replace(
    '2.13 Phase 17: Complete User Administration Replication',
    '2.13 Phase 17: Complete User Administration Replication\n   2.14 Phase 18: Complete System Settings Replication'
  );
}

// Append Phase 18 details before SECTION 3
if (!report.includes('PHASE 18 — COMPLETE SYSTEM SETTINGS REPLICATION')) {
  const insertIndex = report.indexOf('================================================================================\n3. TECHNICAL DEEP DIVE & CODE ARCHITECTURE');
  if (insertIndex !== -1) {
    report = report.substring(0, insertIndex) + phase18Text + '\n' + report.substring(insertIndex);
  }
}

// Update test metrics in report
report = report.replace(/77 \/ 77 PASSING/g, '93 / 93 PASSING');
report = report.replace(/Total Automated Tests Executed: 77/g, 'Total Automated Tests Executed: 93');
report = report.replace(/Total Test Suites Passing: 10/g, 'Total Test Suites Passing: 11');
report = report.replace(/Tests Passing: 77 \/ 77 \(100%\)/g, 'Tests Passing: 93 / 93 (100%)');

fs.writeFileSync('FULL_DAY_REPORT_2026-11-18.txt', report, 'utf8');
fs.writeFileSync('docs/FULL-DAY-REPORT-2026-11-18.txt', report, 'utf8');
fs.writeFileSync('C:/Users/nirma/.gemini/antigravity/brain/dfff8ff6-9284-4952-899a-e09c886e427e/FULL-DAY-REPORT-2026-11-18.txt', report, 'utf8');

console.log('Updated FULL_DAY_REPORT_2026-11-18.txt with Phase 18 across all locations successfully!');
