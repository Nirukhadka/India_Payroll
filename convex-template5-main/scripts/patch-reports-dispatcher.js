const fs = require('fs');

let content = fs.readFileSync('packages/backend/convex/reports.ts', 'utf8');

// Add import
if (!content.includes('payrollReportsHelper')) {
  content = `import {
  calculateSalaryRegister,
  calculatePaymentRegister,
  calculateBankTransferStatement,
  calculatePayrollSummary,
  calculatePayrollVariance,
  calculatePayrollJV,
  calculateLoanDeductions,
  calculateReimbursementSummary
} from "./payrollReportsHelper";\n` + content;

  // Insert specialized routing into generateReportData
  const routingTarget = 'const isAdmin = member.role === "admin";';
  const routingCode = `const isAdmin = member.role === "admin";

    const pCtx = {
      workspaceId: args.workspaceId,
      isAdmin,
      periodMonth: args.periodMonth,
      department: args.department,
      employeeId: args.employeeId,
      statusFilter: args.statusFilter,
    };

    // ── BATCH R3: PAYROLL REPORTS DISPATCHER ────────────────────────────────
    if (args.reportId === "salary_register" || args.reportId === "salary_statement_monthly" || args.reportId === "salary_bill_register" || args.reportId === "salary_register_cash") {
      return await calculateSalaryRegister(ctx, pCtx);
    }
    if (args.reportId === "payment_register") {
      return await calculatePaymentRegister(ctx, pCtx);
    }
    if (args.reportId === "bank_transfer_statement" || args.reportId === "bank_transfer_advise" || args.reportId === "other_payroll_transfer_statements") {
      return await calculateBankTransferStatement(ctx, pCtx);
    }
    if (args.reportId === "payroll_transfer_summaries" || args.reportId === "negative_cost_report") {
      return await calculatePayrollSummary(ctx, pCtx);
    }
    if (args.reportId === "duplicate_report" || args.reportId === "hold_release_salary_report" || args.reportId === "employee_reconciliation_report" || args.reportId === "payroll_reconciliation" || args.reportId === "payroll_reconciliation_consolidated") {
      return await calculatePayrollVariance(ctx, pCtx);
    }
    if (args.reportId === "payroll_jv" || args.reportId === "payroll_jv_reimbursements") {
      return await calculatePayrollJV(ctx, pCtx);
    }
    if (args.reportId.includes("loan_")) {
      return await calculateLoanDeductions(ctx, pCtx);
    }
    if (args.reportId.includes("reimbursement_") || args.reportId === "claim_bank_transfer_statement") {
      return await calculateReimbursementSummary(ctx, pCtx);
    }
`;

  content = content.replace(routingTarget, routingCode);
  fs.writeFileSync('packages/backend/convex/reports.ts', content, 'utf8');
  console.log('Successfully wired payroll reports dispatcher in packages/backend/convex/reports.ts');
} else {
  console.log('Already wired');
}
