const fs = require('fs');

const inventory = JSON.parse(fs.readFileSync('docs/GREYTHR-COMPLETE-REFERENCE-INVENTORY.json', 'utf8'));
const reportItems = inventory.items.filter(i => i.stableId.startsWith('report::'));
const registryContent = fs.readFileSync('apps/app/src/app/[locale]/(admin)/admin/reports/reports-registry.ts', 'utf8');

// Parse registry
const reportRegex = /id:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*category:\s*"([^"]+)",\s*description:\s*"([^"]+)",\s*supportedFormats:\s*(\[[^\]]+\]),\s*status:\s*"([^"]+)",\s*parameters:\s*(\[[^\]]+\]),\s*isDraftStatutory:\s*(true|false)/g;

let m;
const registryMap = new Map();
while ((m = reportRegex.exec(registryContent)) !== null) {
  registryMap.set(m[1], {
    id: m[1],
    name: m[2],
    category: m[3],
    description: m[4],
    supportedFormats: JSON.parse(m[5]),
    status: m[6],
    parameters: JSON.parse(m[7]),
    isDraftStatutory: m[8] === 'true'
  });
}

// Build exact reference inventory
const exactInventory = {
  metadata: {
    title: "IndiaPay Exact greytHR Reports Gallery Reference Inventory",
    totalCategories: 27,
    totalReports: reportItems.length,
    generatedAt: new Date().toISOString(),
    referenceBaseUrl: "https://victorchasex.greythr.com/ngapp/reports/reports/reports-gallery"
  },
  categories: [
    "Payroll Payout",
    "Payroll Control",
    "ESI - EMPLOYEES' STATE INSURANCE FUND",
    "PF - Provident Fund",
    "PT - Profession Tax",
    "Workforce Attrition Reports",
    "Income Tax",
    "Reimbursement",
    "Loan",
    "Claims",
    "MIS Reports",
    "Leave",
    "Help Desk",
    "Labour Welfare Fund Act - Karnataka",
    "Minimum Wages Rules - Karnataka",
    "Factories Act - Karnataka",
    "Maternity Benefit Act - Central",
    "CLRA Act & Rules - Central",
    "Payment of Bonus Act - Central",
    "Equal Remuneration Act - Central",
    "Workmen's Compensation Act",
    "Ease of Compliance - Central",
    "Shops & Est Act - Karnataka",
    "Tamil Nadu Labour Welfare Fund Act, 1972",
    "Labour Reports",
    "Payment of Gratuity Act - Central",
    "HR Reports"
  ],
  reports: reportItems.map(item => {
    const cleanId = item.stableId.replace('report::', '');
    const reg = registryMap.get(cleanId);
    return {
      reportId: cleanId,
      stableId: item.stableId,
      category: item.category.replace('Report Category: ', ''),
      reportName: item.name,
      description: reg ? reg.description : `${item.name} reference report`,
      refUrl: item.refUrl,
      supportedFormats: reg ? reg.supportedFormats : ["PDF", "XLSX"],
      parameters: reg ? reg.parameters : ["payrollMonth", "employeeSelection", "department", "location"],
      isDraftStatutory: reg ? reg.isDraftStatutory : item.category.includes('Act') || item.category.includes('PF') || item.category.includes('ESI'),
      auditStatus: item.status,
      priority: item.priority
    };
  })
};

fs.writeFileSync('docs/REPORTS-GALLERY-EXACT-REFERENCE-INVENTORY.json', JSON.stringify(exactInventory, null, 2), 'utf8');
console.log('Saved docs/REPORTS-GALLERY-EXACT-REFERENCE-INVENTORY.json with', exactInventory.reports.length, 'reports.');
