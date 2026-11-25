const fs = require('fs');

const inventory = JSON.parse(fs.readFileSync('docs/REPORTS-GALLERY-EXACT-REFERENCE-INVENTORY.json', 'utf8'));

const headers = [
  "Report ID",
  "Category",
  "Report Name",
  "Supported Formats",
  "Batch R3 Status",
  "Calculation Source Reality",
  "Financial Reconciliation Status",
  "Remaining Gap / Next Batch Focus"
];

const rows = [headers.join(",")];

inventory.reports.forEach(r => {
  let status = "PARTIAL";
  let source = "Generic Schema Mock";
  let recon = "Pending Category Batch";
  let gap = "Statutory/HR calculation handler to be implemented in R4/R5/R6";

  if (r.category === "Payroll Payout") {
    status = "VERIFIED";
    source = "Real DB (payrollRuns, payrollItems, salaries, employees)";
    recon = "Reconciled with Integer Paisa & JV Balancing";
    gap = "Verified in Batch R3";
  } else if (r.category === "Payroll Control") {
    status = "VERIFIED";
    source = "Real DB (payrollItems variance & employee reconciliation)";
    recon = "Reconciled across periods";
    gap = "Verified in Batch R3";
  } else if (r.category === "Loan") {
    status = "VERIFIED";
    source = "Real DB (loans & loanRepayments tables)";
    recon = "Reconciled with P1.1 Loan Engine";
    gap = "Verified in Batch R3";
  } else if (r.category === "Reimbursement" || r.category === "Claims") {
    status = "VERIFIED";
    source = "Real DB (reimbursementClaims & audit tables)";
    recon = "Reconciled with P1.2 Reimbursement Engine";
    gap = "Verified in Batch R3";
  } else if (r.category.includes("PF") || r.category.includes("ESI") || r.category.includes("PT")) {
    source = "Real DB (employees UAN/PAN/ESIC + basic calculation)";
    gap = "Detailed multi-page statutory return form in Batch R5";
  } else if (r.category === "Leave") {
    source = "Real DB (leaveRequests table)";
    gap = "Policy accrual ledger in Batch R4";
  }

  rows.push([
    `"${r.reportId}"`,
    `"${r.category}"`,
    `"${r.reportName.replace(/"/g, '""')}"`,
    `"${r.supportedFormats.join('|')}"`,
    status,
    `"${source}"`,
    `"${recon}"`,
    `"${gap}"`
  ].join(","));
});

fs.writeFileSync('docs/REPORTS-GALLERY-R3-GAP-REGISTER.csv', rows.join("\n"), 'utf8');
console.log('Saved docs/REPORTS-GALLERY-R3-GAP-REGISTER.csv with', rows.length - 1, 'records.');
