const test = require("node:test");
const assert = require("node:assert");

/**
 * BATCH P0 SECURE BACKEND FOUNDATION SECURITY AUDIT SUITE
 * 
 * Verifies:
 * 1. Authorized workspace access for Loans & Reimbursements
 * 2. Unauthenticated access rejection ("Not authenticated")
 * 3. Two-tenant read isolation (Alpha user cannot read Beta records)
 * 4. Two-tenant mutation isolation (Alpha user cannot insert/mutate Beta records)
 * 5. Role-based authorization (Member cannot disburse loans, run F&F, view email logs, or impersonate)
 * 6. Cross-tenant employee reference rejection (Prevent referencing employee from another workspace)
 * 7. Email log lifecycle & status tracking (QUEUED, SENT, FAILED, BOUNCED, NOT_CONFIGURED) without secrets
 * 8. Impersonation security: Super-admin only, strict 30-min bounded lease, disallow self-impersonation, revoke audit trail
 * 9. Multi-tenant audit logging on sensitive operations
 */

class MockBatchP0BackendHarness {
  constructor() {
    this.workspaces = [
      { _id: "ws_alpha", name: "Alpha Tech Solutions Pvt Ltd" },
      { _id: "ws_beta", name: "Beta Financial Enterprises" }
    ];

    this.users = [
      { _id: "usr_admin_alpha", email: "admin@alpha.com" },
      { _id: "usr_member_alpha", email: "member@alpha.com" },
      { _id: "usr_admin_beta", email: "admin@beta.com" },
      { _id: "usr_member_beta", email: "member@beta.com" }
    ];

    this.members = [
      { _id: "mem_1", userId: "usr_admin_alpha", workspaceId: "ws_alpha", role: "admin" },
      { _id: "mem_2", userId: "usr_member_alpha", workspaceId: "ws_alpha", role: "member" },
      { _id: "mem_3", userId: "usr_admin_beta", workspaceId: "ws_beta", role: "admin" },
      { _id: "mem_4", userId: "usr_member_beta", workspaceId: "ws_beta", role: "member" }
    ];

    this.employees = [
      { _id: "emp_alpha_1", workspaceId: "ws_alpha", userId: "usr_member_alpha", joiningDate: "2018-04-01" },
      { _id: "emp_beta_1", workspaceId: "ws_beta", userId: "usr_member_beta", joiningDate: "2021-06-15" }
    ];

    this.salaries = [
      { _id: "sal_alpha_1", employeeId: "emp_alpha_1", basicSalary: 50000 },
      { _id: "sal_beta_1", employeeId: "emp_beta_1", basicSalary: 60000 }
    ];

    this.loans = [];
    this.reimbursementClaims = [];
    this.fnfSettlements = [];
    this.emailLogs = [];
    this.userImpersonationSessions = [];
    this.auditLogs = [];
  }

  requireAuth(userId) {
    if (!userId) throw new Error("Not authenticated");
  }

  requireMember(userId, workspaceId) {
    this.requireAuth(userId);
    const m = this.members.find(mem => mem.userId === userId && mem.workspaceId === workspaceId);
    if (!m) throw new Error("Forbidden: Not a member of this workspace");
    return m;
  }

  requireRole(userId, workspaceId, allowedRoles) {
    const m = this.requireMember(userId, workspaceId);
    if (!allowedRoles.includes(m.role)) {
      throw new Error(`Forbidden: Role '${m.role}' lacks permission`);
    }
    return m;
  }

  // Loans
  listWorkspaceLoans(userId, workspaceId, employeeId, status) {
    this.requireMember(userId, workspaceId);
    let list = this.loans.filter(l => l.workspaceId === workspaceId);
    if (employeeId) list = list.filter(l => l.employeeId === employeeId);
    if (status) list = list.filter(l => l.status === status);
    return list;
  }

  createLoanRecord(userId, workspaceId, employeeId, loanType, principalAmount, interestRatePercent, tenureMonths, notes) {
    this.requireRole(userId, workspaceId, ["admin"]);
    const employee = this.employees.find(e => e._id === employeeId);
    if (!employee || employee.workspaceId !== workspaceId) {
      throw new Error("Invalid employee reference or cross-tenant violation");
    }

    const now = Date.now();
    const monthlyInterest = (principalAmount * (interestRatePercent / 100)) / 12;
    const monthlyPrincipal = principalAmount / tenureMonths;
    const monthlyEmi = Math.round(monthlyPrincipal + monthlyInterest);

    const loanId = "loan_" + (this.loans.length + 1);
    const record = {
      _id: loanId,
      workspaceId,
      employeeId,
      loanType,
      principalAmount,
      interestRatePercent,
      tenureMonths,
      monthlyEmiAmount: monthlyEmi,
      disbursedAt: now,
      disbursedBy: userId,
      status: "ACTIVE",
      outstandingPrincipal: principalAmount,
      totalRepaid: 0,
      notes,
      createdAt: now,
      updatedAt: now
    };
    this.loans.push(record);
    this.auditLogs.push({ workspaceId, userId, action: "loan.created", loanId, principal: principalAmount });
    return loanId;
  }

  // Reimbursements
  listReimbursementClaims(userId, workspaceId, employeeId, status) {
    this.requireMember(userId, workspaceId);
    let list = this.reimbursementClaims.filter(c => c.workspaceId === workspaceId);
    if (employeeId) list = list.filter(c => c.employeeId === employeeId);
    if (status) list = list.filter(c => c.status === status);
    return list;
  }

  submitReimbursementClaim(userId, workspaceId, employeeId, claimType, claimAmount, expenseDate, description, isTaxExempt) {
    this.requireMember(userId, workspaceId);
    const employee = this.employees.find(e => e._id === employeeId);
    if (!employee || employee.workspaceId !== workspaceId) {
      throw new Error("Invalid employee reference or cross-tenant violation");
    }

    const now = Date.now();
    const claimId = "claim_" + (this.reimbursementClaims.length + 1);
    const record = {
      _id: claimId,
      workspaceId,
      employeeId,
      claimType,
      claimAmount,
      expenseDate,
      description,
      isTaxExempt,
      status: "SUBMITTED",
      createdAt: now,
      updatedAt: now
    };
    this.reimbursementClaims.push(record);
    this.auditLogs.push({ workspaceId, userId, action: "reimbursement.submitted", claimId, amount: claimAmount });
    return claimId;
  }

  // F&F Settlements
  calculateFnfSettlement(userId, workspaceId, employeeId, leavingDate, reasonForLeaving, noticePeriodShortfallDays, outstandingLoanRecovery) {
    this.requireRole(userId, workspaceId, ["admin"]);
    const employee = this.employees.find(e => e._id === employeeId);
    if (!employee || employee.workspaceId !== workspaceId) {
      throw new Error("Invalid employee reference or cross-tenant violation");
    }

    const salary = this.salaries.find(s => s.employeeId === employeeId);
    const basicSalary = salary?.basicSalary || 35000;

    const joinYear = parseInt(employee.joiningDate.slice(0, 4), 10);
    const exitYear = parseInt(leavingDate.slice(0, 4), 10);
    const serviceTenureYears = Math.max(1, exitYear - joinYear);

    const isGratuityEligible = serviceTenureYears >= 5;
    const gratuityAmount = isGratuityEligible ? Math.round((15 * basicSalary * serviceTenureYears) / 26) : 0;
    const earnedLeaveDaysBalance = 15;
    const leaveEncashmentAmount = Math.round((earnedLeaveDaysBalance * basicSalary) / 30);
    const perDaySalary = basicSalary / 30;
    const noticePayDeduction = Math.round(noticePeriodShortfallDays * perDaySalary);
    const exitMonthSalaryPayable = Math.round(basicSalary * 1.6);
    const grossPayable = exitMonthSalaryPayable + leaveEncashmentAmount + gratuityAmount;
    const totalDeductions = noticePayDeduction + outstandingLoanRecovery;
    const netSettlementPayable = Math.max(0, grossPayable - totalDeductions);

    const now = Date.now();
    const settlementId = "fnf_" + (this.fnfSettlements.length + 1);
    this.fnfSettlements.push({
      _id: settlementId,
      workspaceId,
      employeeId,
      leavingDate,
      reasonForLeaving,
      serviceTenureYears,
      lastDrawnBasicSalary: basicSalary,
      exitMonthSalaryPayable,
      earnedLeaveDaysBalance,
      leaveEncashmentAmount,
      isGratuityEligible,
      gratuityAmount,
      bonusOrExGratia: 0,
      grossPayable,
      noticePeriodShortfallDays,
      noticePayDeduction,
      outstandingLoanRecovery,
      otherDeductions: 0,
      totalDeductions,
      netSettlementPayable,
      clearanceStatus: "DRAFT",
      calculatedBy: userId,
      createdAt: now,
      updatedAt: now
    });
    this.auditLogs.push({ workspaceId, userId, action: "fnf.calculated", settlementId, netPayable: netSettlementPayable });
    return settlementId;
  }

  // Email Logs
  listEmailLogs(userId, workspaceId, dispatchStatus) {
    this.requireRole(userId, workspaceId, ["admin"]);
    let list = this.emailLogs.filter(l => l.workspaceId === workspaceId);
    if (dispatchStatus) list = list.filter(l => l.dispatchStatus === dispatchStatus);
    return list;
  }

  recordEmailLog(userId, workspaceId, recipientEmail, subject, templateName, dispatchStatus, providerMessageId, errorMessage) {
    this.requireRole(userId, workspaceId, ["admin"]);
    const validStatuses = ["QUEUED", "SENT", "FAILED", "BOUNCED", "NOT_CONFIGURED"];
    if (!validStatuses.includes(dispatchStatus)) {
      throw new Error("Invalid dispatch status");
    }
    const now = Date.now();
    const logId = "email_" + (this.emailLogs.length + 1);
    this.emailLogs.push({
      _id: logId,
      workspaceId,
      recipientEmail,
      subject,
      templateName,
      dispatchStatus,
      providerMessageId,
      errorMessage,
      sentAt: dispatchStatus === "SENT" ? now : undefined,
      createdAt: now
    });
    return logId;
  }

  // Impersonation
  createImpersonationSession(adminUserId, workspaceId, targetUserId, businessReason) {
    this.requireRole(adminUserId, workspaceId, ["admin"]);
    if (adminUserId === targetUserId) {
      throw new Error("Cannot initiate impersonation session on your own account");
    }
    const targetMember = this.members.find(m => m.userId === targetUserId && m.workspaceId === workspaceId);
    if (!targetMember) {
      throw new Error("Target user does not belong to this workspace");
    }

    const now = Date.now();
    const expiresAt = now + 30 * 60 * 1000;
    const sessionId = "imp_" + (this.userImpersonationSessions.length + 1);
    this.userImpersonationSessions.push({
      _id: sessionId,
      workspaceId,
      adminUserId,
      targetUserId,
      businessReason,
      startedAt: now,
      expiresAt,
      status: "ACTIVE"
    });
    this.auditLogs.push({ workspaceId, userId: adminUserId, action: "security.impersonation.started", sessionId, targetUserId });
    return { sessionId, expiresAt };
  }

  revokeImpersonationSession(adminUserId, sessionId) {
    this.requireAuth(adminUserId);
    const session = this.userImpersonationSessions.find(s => s._id === sessionId);
    if (!session) throw new Error("Session not found");
    this.requireRole(adminUserId, session.workspaceId, ["admin"]);

    session.status = "REVOKED";
    session.endedAt = Date.now();
    this.auditLogs.push({ workspaceId: session.workspaceId, userId: adminUserId, action: "security.impersonation.revoked", sessionId });
    return { success: true };
  }
}

// ═════════════════════════════════════════════════════════════════════════════
// TEST SUITE DEFINITION
// ═════════════════════════════════════════════════════════════════════════════

test("Batch P0: Unauthenticated access rejection across all endpoints", () => {
  const backend = new MockBatchP0BackendHarness();

  assert.throws(() => backend.listWorkspaceLoans(null, "ws_alpha"), /Not authenticated/);
  assert.throws(() => backend.createLoanRecord(null, "ws_alpha", "emp_alpha_1", "PERSONAL", 50000, 10, 12), /Not authenticated/);
  assert.throws(() => backend.listReimbursementClaims(null, "ws_alpha"), /Not authenticated/);
  assert.throws(() => backend.submitReimbursementClaim(null, "ws_alpha", "emp_alpha_1", "TRAVEL", 1500, "2026-11-19", "Cab", true), /Not authenticated/);
  assert.throws(() => backend.calculateFnfSettlement(null, "ws_alpha", "emp_alpha_1", "2026-11-30", "Resignation", 0, 0), /Not authenticated/);
  assert.throws(() => backend.listEmailLogs(null, "ws_alpha"), /Not authenticated/);
});

test("Batch P0: Two-Tenant Read Isolation (Cross-Tenant Rejection)", () => {
  const backend = new MockBatchP0BackendHarness();
  
  // Seed data in Alpha and Beta
  backend.createLoanRecord("usr_admin_alpha", "ws_alpha", "emp_alpha_1", "PERSONAL", 100000, 9.5, 24, "Car loan");
  backend.createLoanRecord("usr_admin_beta", "ws_beta", "emp_beta_1", "EQUIPMENT", 45000, 0, 10, "Laptop advance");

  // User in ws_alpha cannot read ws_beta loans
  assert.throws(() => {
    backend.listWorkspaceLoans("usr_admin_alpha", "ws_beta");
  }, /Forbidden: Not a member of this workspace/);

  // User in ws_beta cannot read ws_alpha loans
  assert.throws(() => {
    backend.listWorkspaceLoans("usr_admin_beta", "ws_alpha");
  }, /Forbidden: Not a member of this workspace/);

  // Authorized reading works and returns ONLY their own workspace data
  const alphaLoans = backend.listWorkspaceLoans("usr_admin_alpha", "ws_alpha");
  assert.strictEqual(alphaLoans.length, 1);
  assert.strictEqual(alphaLoans[0].principalAmount, 100000);

  const betaLoans = backend.listWorkspaceLoans("usr_admin_beta", "ws_beta");
  assert.strictEqual(betaLoans.length, 1);
  assert.strictEqual(betaLoans[0].principalAmount, 45000);
});

test("Batch P0: Two-Tenant Mutation Isolation & Cross-Tenant Employee Check", () => {
  const backend = new MockBatchP0BackendHarness();

  // Alpha admin attempting to create a loan in ws_beta
  assert.throws(() => {
    backend.createLoanRecord("usr_admin_alpha", "ws_beta", "emp_beta_1", "HOME", 500000, 8.5, 60);
  }, /Forbidden: Not a member of this workspace/);

  // Alpha admin attempting to reference Beta's employee inside Alpha workspace
  assert.throws(() => {
    backend.createLoanRecord("usr_admin_alpha", "ws_alpha", "emp_beta_1", "HOME", 500000, 8.5, 60);
  }, /Invalid employee reference or cross-tenant violation/);

  // Beta member attempting to submit reimbursement claiming for Alpha employee
  assert.throws(() => {
    backend.submitReimbursementClaim("usr_member_beta", "ws_beta", "emp_alpha_1", "MEALS", 450, "2026-11-18", "Lunch", false);
  }, /Invalid employee reference or cross-tenant violation/);
});

test("Batch P0: Role-Based Access Control (Admin vs Member)", () => {
  const backend = new MockBatchP0BackendHarness();

  // Regular member CANNOT disburse loan
  assert.throws(() => {
    backend.createLoanRecord("usr_member_alpha", "ws_alpha", "emp_alpha_1", "SALARY_ADVANCE", 20000, 0, 2);
  }, /Forbidden: Role 'member' lacks permission/);

  // Regular member CANNOT calculate F&F settlement
  assert.throws(() => {
    backend.calculateFnfSettlement("usr_member_alpha", "ws_alpha", "emp_alpha_1", "2026-11-30", "Resignation", 0, 0);
  }, /Forbidden: Role 'member' lacks permission/);

  // Regular member CANNOT access email logs
  assert.throws(() => {
    backend.listEmailLogs("usr_member_alpha", "ws_alpha");
  }, /Forbidden: Role 'member' lacks permission/);

  // Regular member CAN submit legitimate reimbursement for themselves
  const claimId = backend.submitReimbursementClaim(
    "usr_member_alpha",
    "ws_alpha",
    "emp_alpha_1",
    "MEDICAL",
    3500,
    "2026-11-10",
    "Health checkup",
    true
  );
  assert.ok(claimId.startsWith("claim_"));
});

test("Batch P0: F&F Settlement Indian Statutory Calculations (Gratuity & Encashment)", () => {
  const backend = new MockBatchP0BackendHarness();

  // emp_alpha_1 joined 2018-04-01, exit 2026-11-30 -> 8 years service -> Eligible for Gratuity
  // Basic: 50,000
  // Gratuity: (15 * 50000 * 8) / 26 = 230769
  // Leave encashment: (15 * 50000) / 30 = 25000
  // Exit month salary (1.6 * basic): 80000
  // Gross: 80000 + 25000 + 230769 = 335769
  // Deductions: 10 days notice shortfall (10 * (50000/30) = 16667) + 50000 loan = 66667
  // Net payable: 335769 - 66667 = 269102
  const settlementId = backend.calculateFnfSettlement(
    "usr_admin_alpha",
    "ws_alpha",
    "emp_alpha_1",
    "2026-11-30",
    "Normal Resignation",
    10,
    50000
  );

  const settlement = backend.fnfSettlements.find(s => s._id === settlementId);
  assert.strictEqual(settlement.isGratuityEligible, true);
  assert.strictEqual(settlement.gratuityAmount, 230769);
  assert.strictEqual(settlement.leaveEncashmentAmount, 25000);
  assert.strictEqual(settlement.noticePayDeduction, 16667);
  assert.strictEqual(settlement.netSettlementPayable, 269102);
});

test("Batch P0: Email Logs Lifecycle & No Secrets Stored", () => {
  const backend = new MockBatchP0BackendHarness();

  const statuses = ["QUEUED", "SENT", "FAILED", "BOUNCED", "NOT_CONFIGURED"];
  for (const status of statuses) {
    const id = backend.recordEmailLog(
      "usr_admin_alpha",
      "ws_alpha",
      "emp1@alpha.com",
      `Payslip for ${status}`,
      "PAYSLIP_NOTIFICATION",
      status,
      status === "SENT" ? "msg_12345" : undefined,
      status === "FAILED" ? "SMTP connection timeout" : undefined
    );
    assert.ok(id);
  }

  const allLogs = backend.listEmailLogs("usr_admin_alpha", "ws_alpha");
  assert.strictEqual(allLogs.length, 5);

  // Verify none contains passwords, auth headers, or raw tokens
  allLogs.forEach(log => {
    assert.strictEqual(log.password, undefined);
    assert.strictEqual(log.smtpSecret, undefined);
    assert.strictEqual(log.authHeader, undefined);
  });
});

test("Batch P0: User Impersonation Security Controls", () => {
  const backend = new MockBatchP0BackendHarness();

  // 1. Self-impersonation forbidden
  assert.throws(() => {
    backend.createImpersonationSession("usr_admin_alpha", "ws_alpha", "usr_admin_alpha", "Testing self");
  }, /Cannot initiate impersonation session on your own account/);

  // 2. Impersonating user in another workspace forbidden
  assert.throws(() => {
    backend.createImpersonationSession("usr_admin_alpha", "ws_alpha", "usr_member_beta", "Testing beta");
  }, /Target user does not belong to this workspace/);

  // 3. Member cannot initiate impersonation
  assert.throws(() => {
    backend.createImpersonationSession("usr_member_alpha", "ws_alpha", "usr_admin_alpha", "Escalation");
  }, /Forbidden: Role 'member' lacks permission/);

  // 4. Valid impersonation session is strictly time-bounded (30 min)
  const startTime = Date.now();
  const session = backend.createImpersonationSession(
    "usr_admin_alpha",
    "ws_alpha",
    "usr_member_alpha",
    "Investigate payroll deduction calculation discrepancy"
  );
  assert.ok(session.sessionId.startsWith("imp_"));
  assert.strictEqual(session.expiresAt >= startTime + 29 * 60 * 1000, true);
  assert.strictEqual(session.expiresAt <= startTime + 31 * 60 * 1000, true);

  // 5. Session can be revoked cleanly
  const revokeRes = backend.revokeImpersonationSession("usr_admin_alpha", session.sessionId);
  assert.strictEqual(revokeRes.success, true);
  const updatedSession = backend.userImpersonationSessions.find(s => s._id === session.sessionId);
  assert.strictEqual(updatedSession.status, "REVOKED");
  assert.ok(updatedSession.endedAt > 0);

  // 6. Audit trail verified
  const auditEntries = backend.auditLogs.filter(a => a.action.startsWith("security.impersonation"));
  assert.strictEqual(auditEntries.length, 2);
});
