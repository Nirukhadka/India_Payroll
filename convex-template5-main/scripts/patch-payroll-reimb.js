const fs = require('fs');
let p = fs.readFileSync('packages/backend/convex/payroll.ts', 'utf8');

// 1. Add import
const targetImport = 'import { calculateEmployeeLoanDeductions } from "./payrollLoanHelper";';
const replacementImport = 'import { calculateEmployeeLoanDeductions } from "./payrollLoanHelper";\nimport { calculateEmployeeReimbursements } from "./payrollReimbursementHelper";';
p = p.replace(targetImport, replacementImport);

// 2. In calculatePreview:
const target1 = `    const processedLoanIds = new Set(existingRepaymentsForPeriod.map((r) => r.loanId));

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

const replacement1 = `    const processedLoanIds = new Set(existingRepaymentsForPeriod.map((r) => r.loanId));

    // Retrieve approved reimbursements eligible for payout in this payroll period
    const approvedReimbursements = await ctx.db
      .query("reimbursementClaims")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId))
      .filter((q) => q.eq(q.field("status"), "APPROVED"))
      .collect();

    // Build calculation items per employee with loan EMI deductions & reimbursements
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

      const reimbSummary = calculateEmployeeReimbursements(
        emp._id,
        approvedReimbursements
      );

      return {
        ...baseItem,
        loanDeductions: loanSummary.loanDeductions,
        totalLoanDeductions: loanSummary.totalLoanDeduction,
        reimbursementItems: reimbSummary.reimbursementItems,
        totalReimbursements: reimbSummary.totalReimbursement,
        totalDeductions: baseItem.totalDeductions + loanSummary.totalLoanDeduction,
        netSalary: loanSummary.adjustedNetSalary + reimbSummary.totalReimbursement,
        warnings: [...baseItem.warnings, ...loanSummary.warnings],
      };
    });`;

if (!p.includes(target1)) {
  console.error("target1 not found in calculatePreview");
  process.exit(1);
}
p = p.replace(target1, replacement1);

// 3. In createRun:
const target2 = `    const processedLoanIds = new Set(existingRepaymentsForPeriod.map((r) => r.loanId));

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

const replacement2 = `    const processedLoanIds = new Set(existingRepaymentsForPeriod.map((r) => r.loanId));

    const approvedReimbursements = await ctx.db
      .query("reimbursementClaims")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId))
      .filter((q) => q.eq(q.field("status"), "APPROVED"))
      .collect();

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

      const reimbSummary = calculateEmployeeReimbursements(
        emp._id,
        approvedReimbursements
      );

      return {
        ...baseItem,
        loanDeductions: loanSummary.loanDeductions,
        totalLoanDeductions: loanSummary.totalLoanDeduction,
        reimbursementItems: reimbSummary.reimbursementItems,
        totalReimbursements: reimbSummary.totalReimbursement,
        totalDeductions: baseItem.totalDeductions + loanSummary.totalLoanDeduction,
        netSalary: loanSummary.adjustedNetSalary + reimbSummary.totalReimbursement,
        warnings: [...baseItem.warnings, ...loanSummary.warnings],
      };
    });`;

if (!p.includes(target2)) {
  console.error("target2 not found in createRun");
  process.exit(1);
}
p = p.replace(target2, replacement2);

// 4. In createRun item insertion:
const targetInsert = `        loanDeductions: item.loanDeductions,
        totalLoanDeductions: item.totalLoanDeductions,
        createdAt: now,
      });`;

const replacementInsert = `        loanDeductions: item.loanDeductions,
        totalLoanDeductions: item.totalLoanDeductions,
        reimbursementItems: item.reimbursementItems,
        totalReimbursements: item.totalReimbursements,
        createdAt: now,
      });`;

if (!p.includes(targetInsert)) {
  console.error("targetInsert not found");
  process.exit(1);
}
p = p.replace(targetInsert, replacementInsert);

// 5. In finalizeRun:
const targetFinalize = `    await audit(ctx, args.workspaceId, userId, "payroll.finalize", {`;

const replacementFinalize = `    // Settle all reimbursements associated with this finalized run
    for (const item of payrollItems) {
      if (item.reimbursementItems && item.reimbursementItems.length > 0) {
        for (const reimb of item.reimbursementItems) {
          const claim = await ctx.db.get(reimb.claimId);
          if (!claim || claim.status !== "APPROVED") continue;

          await ctx.db.patch(claim._id, {
            status: "SETTLED",
            settledInPayrollMonth: run.periodMonth,
            settledInPayrollRunId: run._id,
            settledAt: now,
            updatedAt: now,
          });

          await ctx.db.insert("reimbursementAuditLogs", {
            workspaceId: args.workspaceId,
            claimId: claim._id,
            action: "SETTLED_IN_PAYROLL",
            actorUserId: userId,
            fromStatus: "APPROVED",
            toStatus: "SETTLED",
            notes: \`Settled in payroll run \${run.periodMonth} (Run ID: \${run._id})\`,
            timestamp: now,
          });
        }
      }
    }

    await audit(ctx, args.workspaceId, userId, "payroll.finalize", {`;

if (!p.includes(targetFinalize)) {
  console.error("targetFinalize not found");
  process.exit(1);
}
p = p.replace(targetFinalize, replacementFinalize);

fs.writeFileSync('packages/backend/convex/payroll.ts', p, 'utf8');
console.log("Successfully patched payroll.ts with Reimbursement integration!");
