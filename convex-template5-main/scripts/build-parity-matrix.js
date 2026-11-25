const fs = require('fs');

const inv = JSON.parse(fs.readFileSync('docs/REPORTS-GALLERY-EXACT-REFERENCE-INVENTORY.json', 'utf8'));

const headers = [
  "Report ID",
  "Category",
  "Report Name",
  "Reference URL",
  "Supported Formats",
  "Parameters",
  "Is Statutory",
  "Audit Classification",
  "Implementation Reality",
  "Gap / Action Required"
];

const rows = [headers.join(",")];

inv.reports.forEach(r => {
  let reality = "UI ONLY";
  let gap = "Generic calculation fallback; requires report-specific handler";

  // Check which category or report has dedicated logic
  if (r.category === "Payroll Payout" && (r.reportId.includes("salary") || r.reportId.includes("bank_transfer") || r.reportId.includes("payment_register"))) {
    reality = "PARTIAL";
    gap = "Working basic calculation; needs component breakdown & true payrollItem aggregation";
  } else if (r.category.includes("PF") || r.category.includes("ESI") || r.category.includes("PT")) {
    reality = "PARTIAL";
    gap = "Has statutory stub; needs true monthly challan/wage register schema binding";
  } else if (r.category === "Leave") {
    reality = "PARTIAL";
    gap = "Pulls leaveRequests; needs true leave balance & policy accrual accounting";
  }

  rows.push([
    `"${r.reportId}"`,
    `"${r.category}"`,
    `"${r.reportName.replace(/"/g, '""')}"`,
    `"${r.refUrl}"`,
    `"${r.supportedFormats.join('|')}"`,
    `"${r.parameters.join('|')}"`,
    r.isDraftStatutory ? "YES" : "NO",
    r.auditStatus,
    reality,
    `"${gap.replace(/"/g, '""')}"`
  ].join(","));
});

fs.writeFileSync('docs/REPORTS-GALLERY-PARITY-MATRIX.csv', rows.join("\n"), 'utf8');
console.log('Saved docs/REPORTS-GALLERY-PARITY-MATRIX.csv with', rows.length - 1, 'records.');
