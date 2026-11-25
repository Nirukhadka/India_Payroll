const fs = require('fs');

const inventory = JSON.parse(fs.readFileSync('docs/REPORTS-GALLERY-EXACT-REFERENCE-INVENTORY.json', 'utf8'));

const targets = [
  "salary_register",
  "salary_statement",
  "payment_register",
  "bank_transfer_statement",
  "bank_transfer_advise",
  "payroll_summary",
  "payroll_variance",
  "payroll_jv",
  "payroll_reconciliation",
  "loan_deduction",
  "reimbursement_summary",
  "employee_cost",
  "earnings_and_deductions"
];

console.log('Matching target payroll reports in inventory:');
inventory.reports.forEach(r => {
  const matches = targets.filter(t => r.reportId.includes(t) || r.reportName.toLowerCase().includes(t.replace(/_/g, ' ')));
  if (matches.length > 0 || r.category.includes('Payroll') || r.category === 'Loan' || r.category === 'Reimbursement') {
    console.log(`- ID: "${r.reportId}" | Name: "${r.reportName}" | Category: "${r.category}"`);
  }
});
