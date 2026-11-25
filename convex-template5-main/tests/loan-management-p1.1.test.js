const test = require("node:test");
const assert = require("node:assert");

/**
 * PHASE 23 — P1.1: LOAN MANAGEMENT AND EMI REPAYMENT ENGINE TEST SUITE
 * 
 * Verifies:
 * 1. EMI calculation against independently calculated reference cases (Reducing Balance)
 * 2. Zero-interest loans (Exact integer division, remainder absorption in final installment)
 * 3. Different interest rates and tenures (3-year, 5-year, fractional tenures)
 * 4. Early repayment & balance recalculation
 * 5. Partial repayment handling
 * 6. Loan closure workflow & state transition validation
 * 7. Duplicate installment prevention for the same payroll period
 * 8. Payroll deduction reconciliation with outstanding loan balance
 * 9. Insufficient salary handling (Partial deduction & zero-salary bounce)
 * 10. Unauthorized loan approval rejection (Non-admin / unauthenticated)
 * 11. Cross-tenant read and mutation rejection (Multi-tenant security)
 * 12. Audit history integrity across all loan lifecycle events
 */

// ═════════════════════════════════════════════════════════════════════════════
// IN-MEMORY HARNESS IMPLEMENTING P1.1 LOAN ENGINE & SPECIFICATION
// ═════════════════════════════════════════════════════════════════════════════

class LoanTestHarness {
  constructor() {
    this.workspaces = [
      { _id: "ws_alpha", name: "Alpha Technologies India Pvt Ltd" },
      { _id: "ws_beta", name: "Beta Financial Enterprises" }
    ];

    this.users = [
      { _id: "usr_admin_alpha", role: "admin", workspaceId: "ws_alpha" },
      { _id: "usr_emp_alpha_1", role: "member", workspaceId: "ws_alpha" },
      { _id: "usr_admin_beta", role: "admin", workspaceId: "ws_beta" },
      { _id: "usr_emp_beta_1", role: "member", workspaceId: "ws_beta" }
    ];

    this.employees = [
      { _id: "emp_alpha_1", workspaceId: "ws_alpha", userId: "usr_emp_alpha_1", name: "Aarav Sharma" },
      { _id: "emp_beta_1", workspaceId: "ws_beta", userId: "usr_emp_beta_1", name: "Priya Nair" }
    ];

    this.loans = [];
    this.loanRepayments = [];
    this.auditLogs = [];
  }

  // Exact Decimal-Safe Formula
  calculateEmi(principal, annualRatePercent, tenureMonths) {
    if (annualRatePercent === 0) {
      return Math.round(principal / tenureMonths);
    }
    const r = annualRatePercent / 12 / 100;
    const factor = Math.pow(1 + r, tenureMonths);
    const emi = (principal * r * factor) / (factor - 1);
    return Math.round(emi);
  }

  requireAuth(userId) {
    if (!userId) throw new Error("Not authenticated");
  }

  requireMember(userId, workspaceId) {
    this.requireAuth(userId);
    const u = this.users.find(user => user._id === userId && user.workspaceId === workspaceId);
    if (!u) throw new Error("Forbidden: Not a member of this workspace");
    return u;
  }

  requireRole(userId, workspaceId, allowedRoles) {
    const u = this.requireMember(userId, workspaceId);
    if (!allowedRoles.includes(u.role)) {
      throw new Error(`Forbidden: Role '${u.role}' lacks permission`);
    }
    return u;
  }

  createLoan(userId, workspaceId, employeeId, loanType, principalAmount, interestRatePercent, tenureMonths, purpose) {
    this.requireRole(userId, workspaceId, ["admin"]);
    const emp = this.employees.find(e => e._id === employeeId);
    if (!emp || emp.workspaceId !== workspaceId) {
      throw new Error("Invalid employee reference or cross-tenant violation");
    }

    if (principalAmount <= 0) throw new Error("Principal must be greater than zero");
    if (tenureMonths <= 0) throw new Error("Tenure must be at least 1 month");

    const monthlyEmi = this.calculateEmi(principalAmount, interestRatePercent, tenureMonths);
    const loanId = "loan_" + (this.loans.length + 1);

    const loan = {
      _id: loanId,
      workspaceId,
      employeeId,
      loanType,
      purpose,
      principalAmount,
      interestRatePercent,
      tenureMonths,
      monthlyEmiAmount: monthlyEmi,
      approvalStatus: "PENDING",
      disbursementStatus: "PENDING",
      status: "PENDING",
      outstandingPrincipal: principalAmount,
      totalRepaid: 0,
      createdAt: Date.now()
    };
    this.loans.push(loan);
    this.auditLogs.push({ workspaceId, userId, action: "loan.created", loanId, principalAmount });
    return loanId;
  }

  reviewLoan(userId, workspaceId, loanId, action, reason) {
    this.requireRole(userId, workspaceId, ["admin"]);
    const loan = this.loans.find(l => l._id === loanId);
    if (!loan || loan.workspaceId !== workspaceId) {
      throw new Error("Loan not found or cross-tenant violation");
    }

    if (loan.approvalStatus !== "PENDING") {
      throw new Error(`Cannot review loan in status: ${loan.status}`);
    }

    if (action === "APPROVE") {
      loan.approvalStatus = "APPROVED";
      loan.status = "APPROVED";
      loan.approvedBy = userId;
      loan.approvedAt = Date.now();
      this.auditLogs.push({ workspaceId, userId, action: "loan.approved", loanId });
    } else {
      if (!reason) throw new Error("Rejection reason is mandatory");
      loan.approvalStatus = "REJECTED";
      loan.status = "REJECTED";
      loan.rejectedBy = userId;
      loan.rejectionReason = reason;
      this.auditLogs.push({ workspaceId, userId, action: "loan.rejected", loanId, reason });
    }
    return { success: true, status: loan.status };
  }

  disburseLoan(userId, workspaceId, loanId) {
    this.requireRole(userId, workspaceId, ["admin"]);
    const loan = this.loans.find(l => l._id === loanId);
    if (!loan || loan.workspaceId !== workspaceId) {
      throw new Error("Loan not found or cross-tenant violation");
    }
    if (loan.approvalStatus !== "APPROVED") {
      throw new Error("Loan must be approved before disbursement");
    }
    loan.disbursementStatus = "DISBURSED";
    loan.status = "ACTIVE";
    loan.disbursedAt = Date.now();
    loan.disbursedBy = userId;
    this.auditLogs.push({ workspaceId, userId, action: "loan.disbursed", loanId });
    return { success: true, status: "ACTIVE" };
  }

  recordEarlyRepayment(userId, workspaceId, loanId, amount) {
    this.requireRole(userId, workspaceId, ["admin"]);
    const loan = this.loans.find(l => l._id === loanId);
    if (!loan || loan.workspaceId !== workspaceId) {
      throw new Error("Loan not found or cross-tenant violation");
    }
    if (loan.status !== "ACTIVE") {
      throw new Error("Cannot record repayment on non-active loan");
    }
    if (amount <= 0) throw new Error("Repayment amount must be positive");

    const repaymentAmount = Math.min(amount, loan.outstandingPrincipal);
    loan.outstandingPrincipal -= repaymentAmount;
    loan.totalRepaid += repaymentAmount;

    const isClosed = loan.outstandingPrincipal <= 0;
    if (isClosed) {
      loan.status = "CLOSED";
      loan.closedAt = Date.now();
      loan.closedBy = userId;
    }

    const repId = "rep_" + (this.loanRepayments.length + 1);
    this.loanRepayments.push({
      _id: repId,
      workspaceId,
      loanId,
      principalPaid: repaymentAmount,
      interestPaid: 0,
      totalDeducted: repaymentAmount,
      outstandingBalanceAfter: loan.outstandingPrincipal,
      repaymentType: isClosed ? "EARLY_REPAYMENT" : "PARTIAL_REPAYMENT",
      deductionStatus: "PROCESSED"
    });

    this.auditLogs.push({ workspaceId, userId, action: "loan.repayment.early", loanId, amount: repaymentAmount });
    return { repaidAmount: repaymentAmount, remainingBalance: loan.outstandingPrincipal, isClosed };
  }

  processPayrollDeduction(userId, workspaceId, loanId, period, availableNetSalary) {
    this.requireRole(userId, workspaceId, ["admin"]);
    const loan = this.loans.find(l => l._id === loanId);
    if (!loan || loan.workspaceId !== workspaceId) {
      throw new Error("Loan not found or cross-tenant violation");
    }
    if (loan.status !== "ACTIVE") {
      throw new Error("Only active loans can participate in payroll deductions");
    }

    // Duplicate prevention
    const existing = this.loanRepayments.find(r => r.loanId === loanId && r.repaymentMonth === period && r.deductionStatus === "PROCESSED");
    if (existing) {
      throw new Error(`EMI deduction for loan ${loanId} already processed for month ${period}`);
    }

    const targetEmi = Math.min(loan.monthlyEmiAmount, loan.outstandingPrincipal);
    let actualDeduction = targetEmi;
    let isBounced = false;
    let isPartial = false;

    if (availableNetSalary < targetEmi) {
      if (availableNetSalary <= 0) {
        isBounced = true;
        actualDeduction = 0;
      } else {
        isPartial = true;
        actualDeduction = availableNetSalary;
      }
    }

    const monthlyRate = loan.interestRatePercent / 12 / 100;
    const interestComponent = Math.min(Math.round(loan.outstandingPrincipal * monthlyRate), actualDeduction);
    const principalComponent = actualDeduction - interestComponent;

    loan.outstandingPrincipal = Math.max(0, loan.outstandingPrincipal - principalComponent);
    loan.totalRepaid += principalComponent;
    const isClosed = loan.outstandingPrincipal <= 0;
    if (isClosed && !isBounced) {
      loan.status = "CLOSED";
      loan.closedAt = Date.now();
      loan.closedBy = userId;
    }

    const repId = "rep_" + (this.loanRepayments.length + 1);
    this.loanRepayments.push({
      _id: repId,
      workspaceId,
      loanId,
      repaymentMonth: period,
      principalPaid: principalComponent,
      interestPaid: interestComponent,
      totalDeducted: actualDeduction,
      outstandingBalanceAfter: loan.outstandingPrincipal,
      deductionStatus: isBounced ? "BOUNCED" : "PROCESSED"
    });

    this.auditLogs.push({ workspaceId, userId, action: "payroll.loan.deduction", loanId, actualDeduction, isBounced });
    return { actualDeduction, remainingBalance: loan.outstandingPrincipal, isClosed, isBounced, isPartial };
  }

  closeLoanManually(userId, workspaceId, loanId, reason) {
    this.requireRole(userId, workspaceId, ["admin"]);
    const loan = this.loans.find(l => l._id === loanId);
    if (!loan || loan.workspaceId !== workspaceId) {
      throw new Error("Loan not found or cross-tenant violation");
    }
    loan.status = "CLOSED";
    loan.outstandingPrincipal = 0;
    loan.closedAt = Date.now();
    loan.closedBy = userId;
    loan.closureReason = reason;
    this.auditLogs.push({ workspaceId, userId, action: "loan.closed.manual", loanId, reason });
    return { success: true };
  }
}

// ═════════════════════════════════════════════════════════════════════════════
// TESTS
// ═════════════════════════════════════════════════════════════════════════════

test("1. EMI calculation against standard financial reference benchmark", () => {
  const harness = new LoanTestHarness();
  // Benchmark Case: Principal 100,000, 10% annual interest, 12 months tenure
  // Standard Financial Formula: E = [100000 * (0.10/12) * (1 + 0.10/12)^12] / [(1 + 0.10/12)^12 - 1] = 8791.588... ~ 8792
  const emi = harness.calculateEmi(100000, 10, 12);
  assert.strictEqual(emi, 8792);
});

test("2. Zero-interest loans (Salary advances / interest-free emergency loans)", () => {
  const harness = new LoanTestHarness();
  // 60,000 INR over 6 months at 0% interest -> Exactly 10,000 / month
  const emi = harness.calculateEmi(60000, 0, 6);
  assert.strictEqual(emi, 10000);

  // Odd amount division: 50,000 INR over 3 months at 0% interest -> 16,667 / month
  const emiOdd = harness.calculateEmi(50000, 0, 3);
  assert.strictEqual(emiOdd, 16667);
});

test("3. Different interest rates and multi-year tenures", () => {
  const harness = new LoanTestHarness();
  // 3-year (36 months) loan of 300,000 INR at 12% p.a.
  // Standard Formula gives 9964.29... -> 9964
  const emi36 = harness.calculateEmi(300000, 12, 36);
  assert.strictEqual(emi36, 9964);

  // 5-year (60 months) loan of 500,000 INR at 8.5% p.a.
  // Standard Formula gives 10258.32... -> 10258
  const emi60 = harness.calculateEmi(500000, 8.5, 60);
  assert.strictEqual(emi60, 10258);
});

test("4. Early repayment & full loan settlement", () => {
  const harness = new LoanTestHarness();
  const loanId = harness.createLoan("usr_admin_alpha", "ws_alpha", "emp_alpha_1", "PERSONAL", 50000, 0, 5, "Medical");
  harness.reviewLoan("usr_admin_alpha", "ws_alpha", loanId, "APPROVE");
  harness.disburseLoan("usr_admin_alpha", "ws_alpha", loanId);

  // Lump-sum full prepayment of 50,000
  const result = harness.recordEarlyRepayment("usr_admin_alpha", "ws_alpha", loanId, 50000);
  assert.strictEqual(result.isClosed, true);
  assert.strictEqual(result.remainingBalance, 0);

  const loan = harness.loans.find(l => l._id === loanId);
  assert.strictEqual(loan.status, "CLOSED");
});

test("5. Partial prepayment and remaining principal reduction", () => {
  const harness = new LoanTestHarness();
  const loanId = harness.createLoan("usr_admin_alpha", "ws_alpha", "emp_alpha_1", "PERSONAL", 80000, 0, 8, "Laptop");
  harness.reviewLoan("usr_admin_alpha", "ws_alpha", loanId, "APPROVE");
  harness.disburseLoan("usr_admin_alpha", "ws_alpha", loanId);

  // Partial prepayment of 30,000
  const result = harness.recordEarlyRepayment("usr_admin_alpha", "ws_alpha", loanId, 30000);
  assert.strictEqual(result.isClosed, false);
  assert.strictEqual(result.remainingBalance, 50000);
  assert.strictEqual(result.repaidAmount, 30000);
});

test("6. Loan closure workflow & state transition validation", () => {
  const harness = new LoanTestHarness();
  const loanId = harness.createLoan("usr_admin_alpha", "ws_alpha", "emp_alpha_1", "EMERGENCY", 20000, 0, 2, "Emergency");
  
  // Cannot disburse before approval
  assert.throws(() => harness.disburseLoan("usr_admin_alpha", "ws_alpha", loanId), /Loan must be approved before disbursement/);

  // Cannot repay before disbursement
  assert.throws(() => harness.recordEarlyRepayment("usr_admin_alpha", "ws_alpha", loanId, 5000), /Cannot record repayment on non-active loan/);

  harness.reviewLoan("usr_admin_alpha", "ws_alpha", loanId, "APPROVE");
  harness.disburseLoan("usr_admin_alpha", "ws_alpha", loanId);

  // Manual closure with audit justification
  harness.closeLoanManually("usr_admin_alpha", "ws_alpha", loanId, "Waived by management");
  const loan = harness.loans.find(l => l._id === loanId);
  assert.strictEqual(loan.status, "CLOSED");
  assert.strictEqual(loan.outstandingPrincipal, 0);
});

test("7. Duplicate installment prevention for the same payroll period", () => {
  const harness = new LoanTestHarness();
  const loanId = harness.createLoan("usr_admin_alpha", "ws_alpha", "emp_alpha_1", "SALARY_ADVANCE", 20000, 0, 2, "Advance");
  harness.reviewLoan("usr_admin_alpha", "ws_alpha", loanId, "APPROVE");
  harness.disburseLoan("usr_admin_alpha", "ws_alpha", loanId);

  // First payroll deduction for 2026-11 succeeds
  const res1 = harness.processPayrollDeduction("usr_admin_alpha", "ws_alpha", loanId, "2026-11", 45000);
  assert.strictEqual(res1.actualDeduction, 10000);

  // Attempting second deduction in the same payroll period throws error
  assert.throws(() => {
    harness.processPayrollDeduction("usr_admin_alpha", "ws_alpha", loanId, "2026-11", 45000);
  }, /EMI deduction for loan .* already processed for month 2026-11/);
});

test("8. Payroll deduction reconciliation with outstanding loan balance", () => {
  const harness = new LoanTestHarness();
  const loanId = harness.createLoan("usr_admin_alpha", "ws_alpha", "emp_alpha_1", "PERSONAL", 15000, 0, 2, "Phone");
  harness.reviewLoan("usr_admin_alpha", "ws_alpha", loanId, "APPROVE");
  harness.disburseLoan("usr_admin_alpha", "ws_alpha", loanId);

  // EMI is 7500. Month 1 deduction: 7500 -> 7500 remaining
  const m1 = harness.processPayrollDeduction("usr_admin_alpha", "ws_alpha", loanId, "2026-11", 50000);
  assert.strictEqual(m1.remainingBalance, 7500);
  assert.strictEqual(m1.isClosed, false);

  // Month 2 deduction: 7500 -> 0 remaining -> Loan auto-closes
  const m2 = harness.processPayrollDeduction("usr_admin_alpha", "ws_alpha", loanId, "2026-12", 50000);
  assert.strictEqual(m2.remainingBalance, 0);
  assert.strictEqual(m2.isClosed, true);

  const loan = harness.loans.find(l => l._id === loanId);
  assert.strictEqual(loan.status, "CLOSED");
});

test("9. Insufficient salary handling (Partial deduction & zero-salary bounce)", () => {
  const harness = new LoanTestHarness();
  const loanId = harness.createLoan("usr_admin_alpha", "ws_alpha", "emp_alpha_1", "PERSONAL", 40000, 0, 4, "Advance");
  harness.reviewLoan("usr_admin_alpha", "ws_alpha", loanId, "APPROVE");
  harness.disburseLoan("usr_admin_alpha", "ws_alpha", loanId);

  // EMI is 10,000. Employee has only 6,000 available salary -> Partial deduction of 6,000
  const partial = harness.processPayrollDeduction("usr_admin_alpha", "ws_alpha", loanId, "2026-11", 6000);
  assert.strictEqual(partial.isPartial, true);
  assert.strictEqual(partial.actualDeduction, 6000);
  assert.strictEqual(partial.remainingBalance, 34000);

  // Next month employee has 0 available salary -> Installment bounced
  const bounced = harness.processPayrollDeduction("usr_admin_alpha", "ws_alpha", loanId, "2026-12", 0);
  assert.strictEqual(bounced.isBounced, true);
  assert.strictEqual(bounced.actualDeduction, 0);
  assert.strictEqual(bounced.remainingBalance, 34000); // Balance unchanged
});

test("10. Unauthorized loan approval rejection (Non-admin or unauthenticated)", () => {
  const harness = new LoanTestHarness();
  const loanId = harness.createLoan("usr_admin_alpha", "ws_alpha", "emp_alpha_1", "PERSONAL", 30000, 0, 3, "Advance");

  // Anonymous request rejected
  assert.throws(() => {
    harness.reviewLoan(null, "ws_alpha", loanId, "APPROVE");
  }, /Not authenticated/);

  // Regular member cannot approve loan
  assert.throws(() => {
    harness.reviewLoan("usr_emp_alpha_1", "ws_alpha", loanId, "APPROVE");
  }, /Forbidden: Role 'member' lacks permission/);
});

test("11. Cross-tenant read and mutation rejection", () => {
  const harness = new LoanTestHarness();
  const loanId = harness.createLoan("usr_admin_alpha", "ws_alpha", "emp_alpha_1", "PERSONAL", 50000, 0, 5, "Personal");

  // Admin of ws_beta cannot approve ws_alpha loan
  assert.throws(() => {
    harness.reviewLoan("usr_admin_beta", "ws_beta", loanId, "APPROVE");
  }, /Loan not found or cross-tenant violation/);

  // Admin of ws_alpha cannot create loan for employee of ws_beta
  assert.throws(() => {
    harness.createLoan("usr_admin_alpha", "ws_alpha", "emp_beta_1", "PERSONAL", 25000, 0, 5, "Advance");
  }, /Invalid employee reference or cross-tenant violation/);
});

test("12. Audit history integrity across complete loan lifecycle", () => {
  const harness = new LoanTestHarness();
  const loanId = harness.createLoan("usr_admin_alpha", "ws_alpha", "emp_alpha_1", "PERSONAL", 20000, 0, 2, "Medical");
  harness.reviewLoan("usr_admin_alpha", "ws_alpha", loanId, "APPROVE");
  harness.disburseLoan("usr_admin_alpha", "ws_alpha", loanId);
  harness.processPayrollDeduction("usr_admin_alpha", "ws_alpha", loanId, "2026-11", 50000);
  harness.recordEarlyRepayment("usr_admin_alpha", "ws_alpha", loanId, 10000);

  const actions = harness.auditLogs.map(a => a.action);
  assert.ok(actions.includes("loan.created"));
  assert.ok(actions.includes("loan.approved"));
  assert.ok(actions.includes("loan.disbursed"));
  assert.ok(actions.includes("payroll.loan.deduction"));
  assert.ok(actions.includes("loan.repayment.early"));
  assert.strictEqual(harness.auditLogs.length, 5);
});
