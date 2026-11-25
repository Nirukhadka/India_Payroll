const fs = require('fs');
const p = fs.readFileSync('packages/backend/convex/payroll.ts', 'utf8');

const targetImport = 'import { numberToIndianWords } from "./statutoryReports";';
const replacementImport = 'import { numberToIndianWords } from "./salaryComponents";\nimport { calculateEmployeeLoanDeductions } from "./payrollLoanHelper";';

if (!p.includes(targetImport)) {
  console.error('targetImport not found in payroll.ts');
  process.exit(1);
}

let updated = p.replace(targetImport, replacementImport);

// 1. In calculatePreview:
const targetCalcPreview = '// Build calculation items per employee\n    const items = employees.map((emp) => {';
const replacementCalcPreview = `// Retrieve active loans and existing repayments for this period
    const activeLoans = await ctx.db
      .query("loans")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId))
      .filter((q) => q.eq(q.field("status"), "ACTIVE"))
      .collect();

    const existingRepaymentsForPeriod = await ctx.db
      .query("loanRepayments")
      .withIndex("by_workspace_month", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("repaymentMonth", args.periodMonth)
      )
      .filter((q) => q.eq(q.field("deductionStatus"), "PROCESSED"))
      .collect();

    const processedLoanIds = new Set(existingRepaymentsForPeriod.map((r) => r.loanId));

    // Build calculation items per employee with loan EMI deductions
    const items = employees.map((emp) => {
      const salary = currentSalaries.get(emp._id);
      const empAttendance = periodAttendance.filter(
        (a) => a.employeeId === emp._id,
      );
      const empComp = empComplianceMap.get(emp._id);
      const baseItem = computeEmployeePayrollItem(emp, salary, empAttendance, empComp, {
        totalDaysInMonth,
        month,
        lopSettings,
        workspaceCompliance,
      });

      const loanSummary = calculateEmployeeLoanDeductions(
        emp._id,
        baseItem.netSalary,
        activeLoans,
        processedLoanIds
      );

      return {
        ...baseItem,
        loanDeductions: loanSummary.loanDeductions,
        totalLoanDeductions: loanSummary.totalLoanDeduction,
        totalDeductions: baseItem.totalDeductions + loanSummary.totalLoanDeduction,
        netSalary: loanSummary.adjustedNetSalary,
        warnings: [...baseItem.warnings, ...loanSummary.warnings],
      };
    });`;

if (!updated.includes(targetCalcPreview)) {
  console.error('targetCalcPreview not found in payroll.ts');
  process.exit(1);
}
updated = updated.replace(targetCalcPreview, replacementCalcPreview);

// 2. In createRun:
const targetCreateRun = 'const calculatedItems = employees.map((emp) => {';
const replacementCreateRun = `// Retrieve active loans and existing repayments for this period
    const activeLoans = await ctx.db
      .query("loans")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId))
      .filter((q) => q.eq(q.field("status"), "ACTIVE"))
      .collect();

    const existingRepaymentsForPeriod = await ctx.db
      .query("loanRepayments")
      .withIndex("by_workspace_month", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("repaymentMonth", args.periodMonth)
      )
      .filter((q) => q.eq(q.field("deductionStatus"), "PROCESSED"))
      .collect();

    const processedLoanIds = new Set(existingRepaymentsForPeriod.map((r) => r.loanId));

    const calculatedItems = employees.map((emp) => {
      const salary = currentSalaries.get(emp._id);
      const empAttendance = periodAttendance.filter(
        (a) => a.employeeId === emp._id,
      );
      const empComp = empComplianceMap.get(emp._id);
      const baseItem = computeEmployeePayrollItem(emp, salary, empAttendance, empComp, {
        totalDaysInMonth,
        month,
        lopSettings,
        workspaceCompliance,
      });

      const loanSummary = calculateEmployeeLoanDeductions(
        emp._id,
        baseItem.netSalary,
        activeLoans,
        processedLoanIds
      );

      return {
        ...baseItem,
        loanDeductions: loanSummary.loanDeductions,
        totalLoanDeductions: loanSummary.totalLoanDeduction,
        totalDeductions: baseItem.totalDeductions + loanSummary.totalLoanDeduction,
        netSalary: loanSummary.adjustedNetSalary,
        warnings: [...baseItem.warnings, ...loanSummary.warnings],
      };
    });`;

if (!updated.includes(targetCreateRun)) {
  console.error('targetCreateRun not found in payroll.ts');
  process.exit(1);
}
updated = updated.replace(targetCreateRun, replacementCreateRun);

// 3. In createRun item insertion:
const targetInsertItem = 'hasSalaryStructure: item.hasSalaryStructure,\n        warnings: item.warnings,\n        createdAt: now,\n      });';
const replacementInsertItem = `hasSalaryStructure: item.hasSalaryStructure,
        warnings: item.warnings,
        loanDeductions: item.loanDeductions,
        totalLoanDeductions: item.totalLoanDeductions,
        createdAt: now,
      });`;

if (!updated.includes(targetInsertItem)) {
  console.error('targetInsertItem not found in payroll.ts');
  process.exit(1);
}
updated = updated.replace(targetInsertItem, replacementInsertItem);

// 4. In finalizeRun:
const targetFinalizeAudit = 'await audit(ctx, args.workspaceId, userId, "payroll.finalize", {';
const replacementFinalizeAudit = `// Process and commit all loan repayments associated with this finalized run
    const payrollItems = await ctx.db
      .query("payrollItems")
      .withIndex("by_run", (q) => q.eq("payrollRunId", run._id))
      .collect();

    for (const item of payrollItems) {
      if (item.loanDeductions && item.loanDeductions.length > 0) {
        for (const loanDed of item.loanDeductions) {
          const loan = await ctx.db.get(loanDed.loanId);
          if (!loan || loan.status !== "ACTIVE") continue;

          // Check if already created for this loan + run
          const existingRep = await ctx.db
            .query("loanRepayments")
            .withIndex("by_loan", (q) => q.eq("loanId", loanDed.loanId))
            .filter((q) => q.eq(q.field("payrollRunId"), run._id))
            .first();

          if (existingRep) continue;

          const allReps = await ctx.db
            .query("loanRepayments")
            .withIndex("by_loan", (q) => q.eq("loanId", loanDed.loanId))
            .collect();

          const installmentNumber = allReps.length + 1;
          const isBounced = loanDed.isBounced;
          const newOutstanding = loanDed.outstandingAfter;
          const isClosed = newOutstanding <= 0;

          await ctx.db.insert("loanRepayments", {
            workspaceId: args.workspaceId,
            loanId: loanDed.loanId,
            employeeId: item.employeeId,
            repaymentMonth: run.periodMonth,
            installmentNumber,
            principalPaid: loanDed.principalComponent,
            interestPaid: loanDed.interestComponent,
            totalDeducted: loanDed.deductedAmount,
            outstandingBalanceAfter: newOutstanding,
            repaymentType: "PAYROLL_DEDUCTION",
            payrollRunId: run._id,
            deductionStatus: isBounced ? "BOUNCED" : "PROCESSED",
            notes: isBounced
              ? "Zero net salary available; installment bounced"
              : loanDed.isPartial
              ? "Partial deduction applied due to salary constraint"
              : "Standard payroll EMI deduction",
            paidAt: isBounced ? undefined : now,
            createdAt: now,
          });

          if (!isBounced) {
            await ctx.db.patch(loan._id, {
              outstandingPrincipal: newOutstanding,
              totalRepaid: loan.totalRepaid + loanDed.principalComponent,
              status: isClosed ? "CLOSED" : "ACTIVE",
              closedAt: isClosed ? now : undefined,
              closedBy: isClosed ? userId : undefined,
              closureReason: isClosed ? "Settled via finalized payroll run" : undefined,
              updatedAt: now,
            });
          }
        }
      }
    }

    await audit(ctx, args.workspaceId, userId, "payroll.finalize", {`;

if (!updated.includes(targetFinalizeAudit)) {
  console.error('targetFinalizeAudit not found in payroll.ts');
  process.exit(1);
}
updated = updated.replace(targetFinalizeAudit, replacementFinalizeAudit);

fs.writeFileSync('packages/backend/convex/payroll.ts', updated, 'utf8');
console.log('Successfully patched payroll.ts with loan EMI preview, creation, and finalization integration!');
