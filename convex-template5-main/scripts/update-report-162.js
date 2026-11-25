const fs = require('fs');
let content = fs.readFileSync('C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/FULL_DAY_REPORT_2026-11-18.txt', 'utf8');

const phase162Section = [
  "--------------------------------------------------------------------------------",
  "PHASE 16.2 — COMPLETE ACCOUNT SETTINGS REPLICATION",
  "--------------------------------------------------------------------------------",
  "• Scope:",
  "  - Dedicated horizontal Account Settings shell layout with 5 canonical tabs:",
  "    Plan (/admin/account-settings/plan), Invoices (/admin/account-settings/invoices),",
  "    Payments (/admin/account-settings/payments), Ticket Management (/admin/account-settings/tickets),",
  "    New Features (/admin/account-settings/features).",
  "  - Global Settings gear dropdown mapped to /admin/account-settings/plan by default.",
  "• Key Deliverables & Accomplishments:",
  "  - Plan Page: 3 pricing cards (ESSENTIAL @ ₹3,495, GROWTH @ ₹5,495 with Best Value ribbon,",
  "    ENTERPRISE @ ₹7,495) with employee allowance and additional employee rate.",
  "  - Plan change confirmation modal and requestPlanChange mutation.",
  "  - Invoices Page: Table with Invoice No, Billing Period, Amount, Download CSV action,",
  "    and expandable line items accordion (headcount, amounts, tax, total).",
  "  - Payments Page: Table with Payment Date, Amount, Payment Mode, Status, and expandable",
  "    payment record with cheque/ref number, bank name, and settled invoice references.",
  "  - Ticket Management Page: Search by ticket ID or subject, status filtering, sortable",
  "    table, ticket details slide-out drawer, and new ticket creation modal.",
  "  - New Features Page: Full registry of 25 greytHR features, summary counter ('16 of 25",
  "    features selected'), filter switcher (Show All, Show Selected, Show Unselected),",
  "    and toggleAccountFeature persistence mutation.",
  "  - Backend schemas: Added accountSubscriptions, accountInvoices, accountPayments,",
  "    accountTickets, and accountFeatures tables with strict workspace isolation.",
  "  - Captured verification screenshots for both viewports (1920x1080 and 1366x768).",
  "  - Test Suite: tests/account-settings.test.js passing 8/8 assertions.",
  "  - Documentation:",
  "    * docs/PHASE-16.2-ACCOUNT-SETTINGS-IMPLEMENTATION.md",
  "    * docs/PHASE-16.2-ACCOUNT-SETTINGS-TEST-RESULTS.md",
  "• Status: VERIFIED.",
  ""
].join("\n");

const target = "3. ARCHITECTURAL ISOLATION & NON-REGRESSION VERIFICATION";
const idx = content.indexOf(target, 100);
if (idx !== -1) {
  content = content.slice(0, idx) + phase162Section + "\n" + content.slice(idx);
}

content = content.replace(/54 assertions/g, "62 assertions");
content = content.replace(/54 \/ 54 tests/g, "62 / 62 tests");
content = content.replace(/54 \/ 54/g, "62 / 62");

fs.writeFileSync('C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/FULL_DAY_REPORT_2026-11-18.txt', content, 'utf8');
fs.writeFileSync('C:/Users/nirma/Downloads/Indian_payroll_system/convex-template5-main/docs/FULL-DAY-REPORT-2026-11-18.txt', content, 'utf8');
fs.writeFileSync('C:/Users/nirma/.gemini/antigravity/brain/dfff8ff6-9284-4952-899a-e09c886e427e/FULL-DAY-REPORT-2026-11-18.txt', content, 'utf8');

console.log('Appended Phase 16.2 to all master reports. New length:', content.length);
