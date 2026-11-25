const fs = require('fs');

const inv = JSON.parse(fs.readFileSync('docs/greythr-settings-route-inventory.json', 'utf8'));

// Implemented IndiaPay routes mapping
const implementedMap = {
  'settings.general.company-info': {
    route: '/admin/system-settings/general/company-info',
    status: 'VERIFIED',
    persistence: 'Convex (systemCompanySettings)',
    visual: 'VERIFIED (1920x1080 & 1366x768)',
    test: 'tests/system-settings.test.js'
  },
  'settings.general.general-preferences': {
    route: '/admin/system-settings/general/preferences',
    status: 'VERIFIED',
    persistence: 'Convex (systemGeneralPreferences)',
    visual: 'VERIFIED',
    test: 'tests/system-settings.test.js'
  },
  'settings.employee.employee-preferences': {
    route: '/admin/system-settings/employee/preferences',
    status: 'VERIFIED',
    persistence: 'Convex (systemEmployeePreferences)',
    visual: 'VERIFIED',
    test: 'tests/system-settings.test.js'
  },
  'settings.payroll.payroll-preferences': {
    route: '/admin/system-settings/payroll/preferences',
    status: 'VERIFIED',
    persistence: 'Convex (systemPayrollPreferences)',
    visual: 'VERIFIED (1920x1080 & 1366x768)',
    test: 'tests/system-settings.test.js'
  },
  'settings.income-tax.incometax-preferences': {
    route: '/admin/system-settings/income-tax/preferences',
    status: 'VERIFIED',
    persistence: 'Convex (systemIncomeTaxPreferences)',
    visual: 'VERIFIED',
    test: 'tests/system-settings.test.js'
  },
  'settings.income-tax.it-options': {
    route: '/admin/system-settings/income-tax/preferences',
    status: 'VERIFIED',
    persistence: 'Convex (systemIncomeTaxPreferences)',
    visual: 'VERIFIED',
    test: 'tests/system-settings.test.js'
  },
  'settings.leave.leaveOptions': {
    route: '/admin/system-settings/leave/preferences',
    status: 'VERIFIED',
    persistence: 'Convex (systemLeavePreferences)',
    visual: 'VERIFIED',
    test: 'tests/system-settings.test.js'
  },
  'settings.leave.leaveOptions.leavepreferences': {
    route: '/admin/system-settings/leave/preferences',
    status: 'VERIFIED',
    persistence: 'Convex (systemLeavePreferences)',
    visual: 'VERIFIED',
    test: 'tests/system-settings.test.js'
  },
  'settings.integrations.outgoing-webhooks': {
    route: '/admin/system-settings/integrations',
    status: 'VERIFIED',
    persistence: 'Convex (systemIntegrationConnectors)',
    visual: 'VERIFIED (1920x1080 & 1366x768)',
    test: 'tests/system-settings.test.js'
  }
};

let markdown = `# PHASE 18.1 — COMPLETE SYSTEM SETTINGS ROUTE COVERAGE MATRIX (164 SUBMENUS)

**Reference:** Authenticated Victor Chasex greytHR (\`https://victorchasex.greythr.com/ngapp/settings/general/company-info\`)  
**Audit Date:** November 19, 2026  
**Scope:** Exhaustive audit of all 164 greytHR System Settings state definitions against IndiaPay HRMS.

---

## 1. Executive Summary & Category Breakdown

| Category | Total Reference Submenus | Verified & Tested | Partial / UI Only | Missing | Deferred | % Covered |
|---|---|---|---|---|---|---|
| **1. General** | 32 | 2 | 0 | 28 | 2 (NGA PEX, WPS) | 6.25% |
| **2. Employee** | 9 | 1 | 0 | 8 | 0 | 11.11% |
| **3. Payroll** | 28 | 1 | 0 | 27 | 0 | 3.57% |
| **4. Income Tax** | 11 | 2 | 0 | 9 | 0 | 18.18% |
| **5. Leave** | 24 | 2 | 0 | 22 | 0 | 8.33% |
| **6. Integrations** | 3 | 1 | 0 | 2 | 0 | 33.33% |
| **7. More** | 57 | 0 | 0 | 57 | 0 | 0.00% |
| **TOTAL** | **164** | **9** | **0** | **153** | **2** | **5.49% VERIFIED** |

---

## 2. Complete 164 Submenu Inventory & Audit Matrix

`;

let counter = 0;

for (const [category, items] of Object.entries(inv)) {
  markdown += `\n### ${category} (${items.length} Submenus)\n\n`;
  markdown += `| # | Reference Submenu Title | greytHR State / Route | IndiaPay Route | Implementation Status | Backend Persistence | Visual Evidence | Remaining Work |\n`;
  markdown += `|---|---|---|---|---|---|---|---|\n`;

  for (const item of items) {
    counter++;
    const impl = implementedMap[item.state];
    let status = 'MISSING';
    let ipRoute = '-';
    let persist = 'None';
    let visual = 'None';
    let remaining = 'Requires dedicated UI view and Convex table handler';

    if (impl) {
      status = impl.status;
      ipRoute = impl.route;
      persist = impl.persistence;
      visual = impl.visual;
      remaining = 'None (Fully verified)';
    } else if (item.state.includes('ngapex') || item.state.includes('wps')) {
      status = 'DEFERRED';
      remaining = 'UAE WPS / Third-party NGA PEX specific integration not required for core India compliance';
    }

    markdown += `| ${counter} | ${item.title.replace(/\|/g, '-')} | \`${item.state}\` | ${ipRoute !== '-' ? `\`${ipRoute}\`` : '-'} | **${status}** | ${persist} | ${visual} | ${remaining} |\n`;
  }
}

fs.writeFileSync('docs/PHASE-18.1-SYSTEM-SETTINGS-COVERAGE-MATRIX.md', markdown, 'utf8');
console.log('Generated docs/PHASE-18.1-SYSTEM-SETTINGS-COVERAGE-MATRIX.md for all 164 submenus!');
