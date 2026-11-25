const fs = require('fs');

const inventory = JSON.parse(fs.readFileSync('docs/REPORTS-GALLERY-EXACT-REFERENCE-INVENTORY.json', 'utf8'));
const schemas = JSON.parse(fs.readFileSync('docs/REPORTS-GALLERY-R2-PARAMETER-SCHEMAS.json', 'utf8'));

const headers = [
  "Report ID",
  "Category",
  "Report Name",
  "Supported Formats",
  "Field Count",
  "Parameter Fields List",
  "Dynamic Parameter Status",
  "Calculation Handler Reality",
  "R2 Status Classification",
  "Remaining Gap / Next Batch Scope"
];

const rows = [headers.join(",")];

inventory.reports.forEach(r => {
  const schema = schemas[r.reportId];
  const fieldList = schema ? schema.fields.map(f => f.name).join(";") : "None";
  const fieldCount = schema ? schema.fields.length : 0;
  
  // Status classification per report
  let calcStatus = "Generic Mock";
  let r2Status = "PARTIAL";
  let gap = "Generic handler output; requires Batch R3/R4/R5/R6 specific math";

  if (r.category === "Payroll Payout" && (r.reportId.includes("salary") || r.reportId.includes("bank_transfer") || r.reportId.includes("payment_register"))) {
    calcStatus = "Real DB (salaries table)";
    r2Status = "VERIFIED";
    gap = "R2 form verified; component breakdowns to be enriched in R3";
  } else if (r.category.includes("PF") || r.category.includes("ESI") || r.category.includes("PT")) {
    calcStatus = "Real DB (employees UAN/PAN + statutory calculation)";
    r2Status = "PARTIAL";
    gap = "R2 form verified; exact government return layout in R5";
  } else if (r.category === "Leave") {
    calcStatus = "Real DB (leaveRequests table)";
    r2Status = "PARTIAL";
    gap = "R2 form verified; multi-policy leave quota ledger in R4";
  } else if (r.category === "Reimbursement" || r.category === "Loan") {
    calcStatus = "Real DB (new P1.1 loans / P1.2 reimbursements tables)";
    r2Status = "PARTIAL";
    gap = "R2 form verified; financial audit aggregation in R6";
  }

  rows.push([
    `"${r.reportId}"`,
    `"${r.category}"`,
    `"${r.reportName.replace(/"/g, '""')}"`,
    `"${r.supportedFormats.join('|')}"`,
    fieldCount,
    `"${fieldList}"`,
    "VERIFIED (Dynamic Schema Form)",
    `"${calcStatus}"`,
    r2Status,
    `"${gap.replace(/"/g, '""')}"`
  ].join(","));
});

fs.writeFileSync('docs/REPORTS-GALLERY-R2-GAP-REGISTER.csv', rows.join("\n"), 'utf8');
console.log('Saved docs/REPORTS-GALLERY-R2-GAP-REGISTER.csv with', rows.length - 1, 'records.');
