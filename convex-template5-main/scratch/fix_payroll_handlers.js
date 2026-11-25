const fs = require('fs');

// 1. Fix page.tsx click handlers
const pageFile = 'C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/apps/app/src/app/[locale]/(admin)/admin/payroll/page.tsx';
let pageContent = fs.readFileSync(pageFile, 'utf8');

pageContent = pageContent.replace(
  `onClick={() => {\n                      setEmployeeViewReleased(false);\n                      showToast("Employee payslip view placed on hold");\n                    }}`,
  `onClick={() => handleToggle("employeeViewReleased", false, "Employee payslip view placed on hold")}`
);

pageContent = pageContent.replace(
  `onClick={() => {\n                      setItStatementReleased(true);\n                      showToast("IT Statement released to employee portal");\n                    }}`,
  `onClick={() => handleToggle("itStatementReleased", true, "IT Statement released to employee portal")}`
);

pageContent = pageContent.replace(
  `onClick={() => {\n                      setItStatementReleased(false);\n                      showToast("IT Statement employee view held");\n                    }}`,
  `onClick={() => handleToggle("itStatementReleased", false, "IT Statement employee view held")}`
);

pageContent = pageContent.replace(
  `onClick={() => {\n                      setPayrollLocked(false);\n                      showToast("Payroll unlocked for reprocessing");\n                    }}`,
  `onClick={() => handleToggle("payrollLocked", false, "Payroll unlocked for reprocessing")}`
);

pageContent = pageContent.replace(
  `onClick={() => {\n                      setPayrollLocked(true);\n                      showToast("Payroll locked successfully");\n                    }}`,
  `onClick={() => handleToggle("payrollLocked", true, "Payroll locked successfully")}`
);

fs.writeFileSync(pageFile, pageContent, 'utf8');
console.log("Fixed page.tsx handlers");

// 2. Fix process/page.tsx createRun call
const procFile = 'C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/apps/app/src/app/[locale]/(admin)/admin/payroll/process/page.tsx';
let procContent = fs.readFileSync(procFile, 'utf8');

procContent = procContent.replace(
  `      await createRun({\n        workspaceId: effectiveWorkspaceId,\n        periodMonth,\n        startDate: "2026-11-01",\n        endDate: "2026-11-30",\n      });`,
  `      await createRun({\n        workspaceId: effectiveWorkspaceId,\n        periodMonth,\n      });`
);

fs.writeFileSync(procFile, procContent, 'utf8');
console.log("Fixed process/page.tsx createRun call");
