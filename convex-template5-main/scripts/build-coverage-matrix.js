const fs = require('fs');

const reconciled = JSON.parse(fs.readFileSync('C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/docs/greythr-settings-reconciled-164.json', 'utf8'));

// Canonical Phase 18 verified states (7 pages)
const PHASE18_VERIFIED = {
  "settings.general.company-info": "/admin/system-settings/general/company-info",
  "settings.general.general-preferences": "/admin/system-settings/general/preferences",
  "settings.employee.employee-preferences": "/admin/system-settings/employee/preferences",
  "settings.payroll.payroll-preferences": "/admin/system-settings/payroll/preferences",
  "settings.income-tax.incometax-preferences": "/admin/system-settings/income-tax/preferences",
  "settings.leave.leaveOptions.leavepreferences": "/admin/system-settings/leave/preferences",
  "settings.integrations": "/admin/system-settings/integrations",
};

// Phase 18.2 verified states (6 pages)
const PHASE18_2_VERIFIED = {
  "settings.general.lov": "/admin/system-settings/general/lov",
  "settings.general.bank-branch": "/admin/system-settings/general/bank-branch",
  "settings.general.company-bank": "/admin/system-settings/general/company-bank",
  "settings.general.state": "/admin/system-settings/general/state",
  "settings.employee.emp-no-series": "/admin/system-settings/employee/emp-no-series",
  "settings.employee.transitiongroup": "/admin/system-settings/employee/transitiongroup",
};

const DEFERRED_STATES = [
  "settings.general.ngapex-preferences",
  "settings.general.wps-preferences",
];

const matrix = [];

for (const [category, items] of Object.entries(reconciled)) {
  for (const item of items) {
    let status = "MISSING";
    let indiapayRoute = null;
    let persistenceStatus = "NOT_IMPLEMENTED";
    let rbacStatus = "NOT_CONFIGURED";
    let workspaceIsolation = "NOT_CONFIGURED";
    let visualVerification = "PENDING";
    let missingFunctionality = "Page, schema, and queries not yet implemented.";
    let priority = "PHASE_18_3_TO_18_7";

    if (PHASE18_VERIFIED[item.state]) {
      status = "VERIFIED";
      indiapayRoute = PHASE18_VERIFIED[item.state];
      persistenceStatus = "CONVEX_PERSISTED";
      rbacStatus = "ADMIN_RESTRICTED";
      workspaceIsolation = "WORKSPACE_SCOPED";
      visualVerification = "VERIFIED_1080P_AND_768P";
      missingFunctionality = "None. Verified in Phase 18.";
      priority = "COMPLETED_PHASE_18";
    } else if (PHASE18_2_VERIFIED[item.state]) {
      status = "VERIFIED";
      indiapayRoute = PHASE18_2_VERIFIED[item.state];
      persistenceStatus = "CONVEX_PERSISTED";
      rbacStatus = "ADMIN_RESTRICTED";
      workspaceIsolation = "WORKSPACE_SCOPED";
      visualVerification = "VERIFIED_1080P_AND_768P";
      missingFunctionality = "None. Fully implemented, persisted and tested in Phase 18.2.";
      priority = "COMPLETED_PHASE_18_2";
    } else if (DEFERRED_STATES.includes(item.state)) {
      status = "DEFERRED";
      indiapayRoute = null;
      persistenceStatus = "NOT_APPLICABLE";
      rbacStatus = "NOT_APPLICABLE";
      workspaceIsolation = "NOT_APPLICABLE";
      visualVerification = "DEFERRED_REGIONAL";
      missingFunctionality = "Regional non-India payroll compliance (UAE WPS / NGA PEX).";
      priority = "DEFERRED";
    } else if (category === "Payroll") {
      priority = "PHASE_18_3_PAYROLL";
    } else if (category === "Income Tax") {
      priority = "PHASE_18_4_INCOME_TAX";
    } else if (category === "Leave") {
      priority = "PHASE_18_5_LEAVE";
    } else if (category === "More") {
      priority = "PHASE_18_6_MORE";
    } else {
      priority = "PHASE_18_7_GENERAL_EMPLOYEE_EXT";
    }

    matrix.push({
      category,
      title: item.title,
      state: item.state,
      referenceRoute: item.url,
      indiapayRoute,
      status,
      persistenceStatus,
      rbacStatus,
      workspaceIsolation,
      visualVerification,
      missingFunctionality,
      priority,
    });
  }
}

fs.writeFileSync(
  'C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/docs/system-settings-coverage-matrix.json',
  JSON.stringify(matrix, null, 2),
  'utf8'
);

const counts = matrix.reduce((acc, cur) => {
  acc[cur.status] = (acc[cur.status] || 0) + 1;
  return acc;
}, {});

console.log('Total matrix entries:', matrix.length);
console.log('Status breakdown:', counts);
const ver = matrix.filter(m => m.status === 'VERIFIED');
console.log('Verified count:', ver.length);
ver.forEach(v => console.log('  *', v.category, '-', v.title, '(' + v.indiapayRoute + ')'));
