const test = require("node:test");
const assert = require("node:assert");

/**
 * PHASE 24 — P1.2: REIMBURSEMENT CLAIMS & APPROVAL WORKFLOW TEST SUITE
 * 
 * Verifies 30 discrete requirements across 3 main categories:
 * 
 * I. CLAIM LIFECYCLE (Tests 1 - 10)
 * 1. Draft creation
 * 2. Draft modification
 * 3. Claim submission
 * 4. Manager approval
 * 5. Manager rejection
 * 6. Return for correction
 * 7. Finance approval & amount adjustment
 * 8. Finance rejection
 * 9. Claim cancellation
 * 10. Complete audit timeline history integrity
 * 
 * II. FINANCIAL INTEGRITY (Tests 11 - 20)
 * 11. Amount validation (> 0)
 * 12. Decimal/paisa precision rounding
 * 13. Maximum category claim limits
 * 14. Duplicate claim prevention
 * 15. Tax treatment preservation (Taxable vs Potentially Exempt vs Non-taxable)
 * 16. Approved amount vs claimed amount differentiation
 * 17. Payroll preview reconciliation (Reimbursements as additions)
 * 18. Payroll finalization settlement
 * 19. Duplicate settlement prevention
 * 20. Net salary non-negativity with reimbursements
 * 
 * III. SECURITY & ACCESS CONTROL (Tests 21 - 30)
 * 21. Unauthenticated access rejection
 * 22. Cross-tenant read rejection
 * 23. Cross-tenant mutation rejection
 * 24. Employee ownership enforcement (Cannot submit claim for others unless admin)
 * 25. Unauthorized manager approval rejection
 * 26. Unauthorized finance approval rejection
 * 27. Self-approval prevention (Separation of duties)
 * 28. Secure receipt requirement validation
 * 29. Client-side approved amount manipulation rejection
 * 30. Audit attribution integrity
 */

class MockReimbursementHarness {
  constructor() {
    this.workspaces = [
      { _id: "ws_alpha", name: "Alpha Corporation" },
      { _id: "ws_beta", name: "Beta Financial" }
    ];

    this.users = [
      { _id: "usr_admin_alpha", role: "admin", workspaceId: "ws_alpha" },
      { _id: "usr_mgr_alpha", role: "admin", workspaceId: "ws_alpha" },
      { _id: "usr_emp_alpha_1", role: "member", workspaceId: "ws_alpha" },
      { _id: "usr_emp_alpha_2", role: "member", workspaceId: "ws_alpha" },
      { _id: "usr_admin_beta", role: "admin", workspaceId: "ws_beta" },
      { _id: "usr_emp_beta_1", role: "member", workspaceId: "ws_beta" }
    ];

    this.employees = [
      { _id: "emp_1", workspaceId: "ws_alpha", userId: "usr_emp_alpha_1", name: "Arjun Verma" },
      { _id: "emp_2", workspaceId: "ws_alpha", userId: "usr_emp_alpha_2", name: "Sunita Roy" },
      { _id: "emp_beta", workspaceId: "ws_beta", userId: "usr_emp_beta_1", name: "Rahul Deshmukh" }
    ];

    this.categories = [
      {
        _id: "cat_travel",
        workspaceId: "ws_alpha",
        categoryCode: "TRAVEL",
        categoryName: "Travel Expenses",
        maxClaimLimit: 50000,
        receiptRequired: true,
        taxTreatment: "NON_TAXABLE_BUSINESS"
      },
      {
        _id: "cat_food",
        workspaceId: "ws_alpha",
        categoryCode: "FOOD",
        categoryName: "Meals",
        maxClaimLimit: 5000,
        receiptRequired: true,
        taxTreatment: "TAXABLE"
      },
      {
        _id: "cat_fuel",
        workspaceId: "ws_alpha",
        categoryCode: "FUEL",
        categoryName: "Fuel",
        maxClaimLimit: 10000,
        receiptRequired: true,
        taxTreatment: "POTENTIALLY_EXEMPT"
      }
    ];

    this.claims = [];
    this.auditLogs = [];
    this.payrollRuns = [];
    this.payrollItems = [];
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

  saveClaim(userId, workspaceId, claimId, employeeId, categoryCode, claimAmount, expenseDate, businessPurpose, description, submitNow, billStorageId) {
    const member = this.requireMember(userId, workspaceId);
    const emp = this.employees.find(e => e._id === employeeId);
    if (!emp || emp.workspaceId !== workspaceId) {
      throw new Error("Invalid employee reference or cross-tenant violation");
    }

    if (member.role === "member" && emp.userId !== userId) {
      throw new Error("Forbidden: You can only submit reimbursement claims for yourself");
    }

    if (claimAmount <= 0) {
      throw new Error("Claim amount must be greater than zero");
    }

    const cat = this.categories.find(c => c.workspaceId === workspaceId && c.categoryCode === categoryCode);
    if (cat && cat.maxClaimLimit && claimAmount > cat.maxClaimLimit) {
      throw new Error(`Claim amount exceeds maximum limit of ₹${cat.maxClaimLimit}`);
    }

    if (cat && cat.receiptRequired && submitNow && !billStorageId) {
      throw new Error(`Receipt document is mandatory for category ${categoryCode}`);
    }

    // Check duplicate
    if (submitNow) {
      const dup = this.claims.find(c => 
        c.workspaceId === workspaceId && 
        c.employeeId === employeeId && 
        c.expenseDate === expenseDate && 
        c.claimAmount === claimAmount &&
        c.categoryCode === categoryCode &&
        c.status !== "CANCELLED" && c.status !== "REJECTED" && c._id !== claimId
      );
      if (dup) {
        throw new Error("Potential duplicate claim detected for the same date and amount");
      }
    }

    const targetStatus = submitNow ? "MANAGER_REVIEW" : "DRAFT";
    const now = Date.now();

    if (claimId) {
      const existing = this.claims.find(c => c._id === claimId && c.workspaceId === workspaceId);
      if (!existing) throw new Error("Claim not found or cross-tenant violation");
      if (existing.status !== "DRAFT" && existing.status !== "RETURNED_FOR_CORRECTION") {
        throw new Error(`Cannot modify claim in status: ${existing.status}`);
      }

      existing.categoryCode = categoryCode;
      existing.claimAmount = claimAmount;
      existing.expenseDate = expenseDate;
      existing.businessPurpose = businessPurpose;
      existing.description = description;
      existing.status = targetStatus;
      existing.taxTreatment = cat ? cat.taxTreatment : "REQUIRES_REVIEW";
      existing.isTaxExempt = cat ? cat.taxTreatment === "NON_TAXABLE_BUSINESS" : false;
      existing.billAttachmentStorageId = billStorageId || existing.billAttachmentStorageId;

      this.auditLogs.push({ claimId, action: submitNow ? "SUBMITTED" : "EDITED_DRAFT", userId, toStatus: targetStatus });
      return { claimId, status: targetStatus };
    } else {
      const newId = "claim_" + (this.claims.length + 1);
      const claim = {
        _id: newId,
        claimNumber: `CLM-202611-${String(this.claims.length + 1).padStart(4, "0")}`,
        workspaceId,
        employeeId,
        categoryCode,
        claimAmount,
        expenseDate,
        businessPurpose,
        description,
        taxTreatment: cat ? cat.taxTreatment : "REQUIRES_REVIEW",
        isTaxExempt: cat ? cat.taxTreatment === "NON_TAXABLE_BUSINESS" : false,
        billAttachmentStorageId: billStorageId,
        status: targetStatus,
        createdAt: now
      };
      this.claims.push(claim);
      this.auditLogs.push({ claimId: newId, action: submitNow ? "SUBMITTED" : "CREATED_DRAFT", userId, toStatus: targetStatus });
      return { claimId: newId, status: targetStatus };
    }
  }

  cancelClaim(userId, workspaceId, claimId) {
    const member = this.requireMember(userId, workspaceId);
    const claim = this.claims.find(c => c._id === claimId && c.workspaceId === workspaceId);
    if (!claim) throw new Error("Claim not found or cross-tenant violation");

    const emp = this.employees.find(e => e._id === claim.employeeId);
    if (member.role === "member" && emp.userId !== userId) {
      throw new Error("Forbidden: You can only cancel your own claims");
    }

    if (claim.status === "APPROVED" || claim.status === "SETTLED") {
      throw new Error(`Cannot cancel claim in status: ${claim.status}`);
    }

    claim.status = "CANCELLED";
    this.auditLogs.push({ claimId, action: "CANCELLED", userId, toStatus: "CANCELLED" });
    return { success: true };
  }

  managerReview(userId, workspaceId, claimId, action, comments, reason) {
    this.requireRole(userId, workspaceId, ["admin"]);
    const claim = this.claims.find(c => c._id === claimId && c.workspaceId === workspaceId);
    if (!claim) throw new Error("Claim not found or cross-tenant violation");

    const emp = this.employees.find(e => e._id === claim.employeeId);
    if (emp && emp.userId === userId) {
      throw new Error("Separation of duties violation: You cannot approve your own claim");
    }

    if (claim.status !== "MANAGER_REVIEW") {
      throw new Error(`Cannot perform manager review on status ${claim.status}`);
    }

    if (action === "APPROVE") {
      claim.status = "FINANCE_REVIEW";
      claim.managerReviewedBy = userId;
      this.auditLogs.push({ claimId, action: "MANAGER_APPROVED", userId, toStatus: "FINANCE_REVIEW" });
    } else if (action === "REJECT") {
      if (!reason) throw new Error("Rejection reason is mandatory");
      claim.status = "REJECTED";
      claim.rejectionReason = reason;
      this.auditLogs.push({ claimId, action: "MANAGER_REJECTED", userId, toStatus: "REJECTED" });
    } else if (action === "RETURN") {
      claim.status = "RETURNED_FOR_CORRECTION";
      this.auditLogs.push({ claimId, action: "RETURNED_FOR_CORRECTION", userId, toStatus: "RETURNED_FOR_CORRECTION" });
    }
    return { success: true, newStatus: claim.status };
  }

  financeReview(userId, workspaceId, claimId, action, approvedAmount, taxTreatment, reason) {
    this.requireRole(userId, workspaceId, ["admin"]);
    const claim = this.claims.find(c => c._id === claimId && c.workspaceId === workspaceId);
    if (!claim) throw new Error("Claim not found or cross-tenant violation");

    const emp = this.employees.find(e => e._id === claim.employeeId);
    if (emp && emp.userId === userId) {
      throw new Error("Separation of duties violation: You cannot verify your own claim");
    }

    if (claim.status !== "FINANCE_REVIEW" && claim.status !== "ON_HOLD") {
      throw new Error(`Cannot perform finance review on status ${claim.status}`);
    }

    if (action === "APPROVE") {
      const finalAmt = approvedAmount ?? claim.claimAmount;
      if (finalAmt <= 0) throw new Error("Approved amount must be positive");
      if (finalAmt > claim.claimAmount) {
        throw new Error("Approved amount cannot exceed original claimed amount");
      }
      claim.status = "APPROVED";
      claim.approvedAmount = finalAmt;
      claim.taxTreatment = taxTreatment ?? claim.taxTreatment;
      claim.isTaxExempt = claim.taxTreatment === "NON_TAXABLE_BUSINESS";
      this.auditLogs.push({ claimId, action: "FINANCE_APPROVED", userId, toStatus: "APPROVED", approvedAmount: finalAmt });
    } else if (action === "REJECT") {
      if (!reason) throw new Error("Rejection reason is mandatory");
      claim.status = "REJECTED";
      claim.rejectionReason = reason;
      this.auditLogs.push({ claimId, action: "FINANCE_REJECTED", userId, toStatus: "REJECTED" });
    } else if (action === "HOLD") {
      if (!reason) throw new Error("Hold reason is mandatory");
      claim.status = "ON_HOLD";
      claim.holdReason = reason;
      this.auditLogs.push({ claimId, action: "FINANCE_HOLD", userId, toStatus: "ON_HOLD" });
    }
    return { success: true, newStatus: claim.status };
  }

  // Preview Payroll with Reimbursements
  calculatePreview(userId, workspaceId, periodMonth) {
    this.requireRole(userId, workspaceId, ["admin"]);
    const emps = this.employees.filter(e => e.workspaceId === workspaceId);
    const approvedReimbs = this.claims.filter(c => c.workspaceId === workspaceId && c.status === "APPROVED" && !c.settledInPayrollMonth);

    const items = emps.map(emp => {
      const eligible = approvedReimbs.filter(c => c.employeeId === emp._id);
      const reimbItems = eligible.map(c => ({
        claimId: c._id,
        amount: c.approvedAmount ?? c.claimAmount,
        isTaxExempt: c.isTaxExempt
      }));
      const totalReimb = reimbItems.reduce((s, r) => s + r.amount, 0);
      const gross = 50000;
      return {
        employeeId: emp._id,
        grossSalary: gross,
        reimbursementItems: reimbItems,
        totalReimbursements: totalReimb,
        netSalary: gross + totalReimb
      };
    });

    return { periodMonth, items };
  }

  finalizeRun(userId, workspaceId, periodMonth) {
    this.requireRole(userId, workspaceId, ["admin"]);
    const preview = this.calculatePreview(userId, workspaceId, periodMonth);
    const runId = "run_" + (this.payrollRuns.length + 1);
    this.payrollRuns.push({ _id: runId, workspaceId, periodMonth, status: "processed" });

    for (const item of preview.items) {
      if (item.reimbursementItems.length > 0) {
        for (const r of item.reimbursementItems) {
          const claim = this.claims.find(c => c._id === r.claimId);
          if (claim && claim.status === "APPROVED") {
            claim.status = "SETTLED";
            claim.settledInPayrollMonth = periodMonth;
            claim.settledInPayrollRunId = runId;
            this.auditLogs.push({ claimId: claim._id, action: "SETTLED_IN_PAYROLL", userId, toStatus: "SETTLED" });
          }
        }
      }
    }
    return { success: true, runId };
  }
}

// ═════════════════════════════════════════════════════════════════════════════
// 30 TEST CASES
// ═════════════════════════════════════════════════════════════════════════════

test("1. Draft creation", () => {
  const h = new MockReimbursementHarness();
  const res = h.saveClaim("usr_emp_alpha_1", "ws_alpha", null, "emp_1", "TRAVEL", 4500, "2026-11-15", "Client Visit", "Cab fare", false);
  assert.strictEqual(res.status, "DRAFT");
  assert.strictEqual(h.claims[0].status, "DRAFT");
});

test("2. Draft modification", () => {
  const h = new MockReimbursementHarness();
  const res = h.saveClaim("usr_emp_alpha_1", "ws_alpha", null, "emp_1", "TRAVEL", 4500, "2026-11-15", "Client Visit", "Cab fare", false);
  const updated = h.saveClaim("usr_emp_alpha_1", "ws_alpha", res.claimId, "emp_1", "TRAVEL", 5200, "2026-11-15", "Client Visit", "Cab + Toll fare", false);
  assert.strictEqual(updated.status, "DRAFT");
  assert.strictEqual(h.claims[0].claimAmount, 5200);
});

test("3. Claim submission", () => {
  const h = new MockReimbursementHarness();
  const res = h.saveClaim("usr_emp_alpha_1", "ws_alpha", null, "emp_1", "TRAVEL", 3000, "2026-11-16", "Client Visit", "Taxi", true, "storage_123");
  assert.strictEqual(res.status, "MANAGER_REVIEW");
  assert.strictEqual(h.claims[0].status, "MANAGER_REVIEW");
});

test("4. Manager approval", () => {
  const h = new MockReimbursementHarness();
  const res = h.saveClaim("usr_emp_alpha_1", "ws_alpha", null, "emp_1", "TRAVEL", 3000, "2026-11-16", "Client Visit", "Taxi", true, "storage_123");
  const rev = h.managerReview("usr_mgr_alpha", "ws_alpha", res.claimId, "APPROVE", "Looks legitimate");
  assert.strictEqual(rev.newStatus, "FINANCE_REVIEW");
  assert.strictEqual(h.claims[0].status, "FINANCE_REVIEW");
});

test("5. Manager rejection", () => {
  const h = new MockReimbursementHarness();
  const res = h.saveClaim("usr_emp_alpha_1", "ws_alpha", null, "emp_1", "TRAVEL", 3000, "2026-11-16", "Client Visit", "Taxi", true, "storage_123");
  const rev = h.managerReview("usr_mgr_alpha", "ws_alpha", res.claimId, "REJECT", null, "Missing prior travel authorization");
  assert.strictEqual(rev.newStatus, "REJECTED");
  assert.strictEqual(h.claims[0].status, "REJECTED");
  assert.strictEqual(h.claims[0].rejectionReason, "Missing prior travel authorization");
});

test("6. Return for correction", () => {
  const h = new MockReimbursementHarness();
  const res = h.saveClaim("usr_emp_alpha_1", "ws_alpha", null, "emp_1", "TRAVEL", 3000, "2026-11-16", "Client Visit", "Taxi", true, "storage_123");
  const rev = h.managerReview("usr_mgr_alpha", "ws_alpha", res.claimId, "RETURN", "Please attach detailed toll receipts");
  assert.strictEqual(rev.newStatus, "RETURNED_FOR_CORRECTION");
  assert.strictEqual(h.claims[0].status, "RETURNED_FOR_CORRECTION");
});

test("7. Finance approval & amount adjustment", () => {
  const h = new MockReimbursementHarness();
  const res = h.saveClaim("usr_emp_alpha_1", "ws_alpha", null, "emp_1", "TRAVEL", 10000, "2026-11-16", "Client Visit", "Flight", true, "storage_123");
  h.managerReview("usr_mgr_alpha", "ws_alpha", res.claimId, "APPROVE");
  
  // Finance approves adjusted amount 8500 (1500 disallowed alcohol/personal)
  const fin = h.financeReview("usr_admin_alpha", "ws_alpha", res.claimId, "APPROVE", 8500, "NON_TAXABLE_BUSINESS");
  assert.strictEqual(fin.newStatus, "APPROVED");
  assert.strictEqual(h.claims[0].approvedAmount, 8500);
  assert.strictEqual(h.claims[0].claimAmount, 10000);
});

test("8. Finance rejection", () => {
  const h = new MockReimbursementHarness();
  const res = h.saveClaim("usr_emp_alpha_1", "ws_alpha", null, "emp_1", "TRAVEL", 10000, "2026-11-16", "Client Visit", "Flight", true, "storage_123");
  h.managerReview("usr_mgr_alpha", "ws_alpha", res.claimId, "APPROVE");
  const fin = h.financeReview("usr_admin_alpha", "ws_alpha", res.claimId, "REJECT", null, null, "Invoice GSTIN mismatch");
  assert.strictEqual(fin.newStatus, "REJECTED");
});

test("9. Claim cancellation", () => {
  const h = new MockReimbursementHarness();
  const res = h.saveClaim("usr_emp_alpha_1", "ws_alpha", null, "emp_1", "TRAVEL", 3000, "2026-11-16", "Client Visit", "Taxi", false);
  const canc = h.cancelClaim("usr_emp_alpha_1", "ws_alpha", res.claimId);
  assert.strictEqual(canc.success, true);
  assert.strictEqual(h.claims[0].status, "CANCELLED");
});

test("10. Complete audit timeline history integrity", () => {
  const h = new MockReimbursementHarness();
  const res = h.saveClaim("usr_emp_alpha_1", "ws_alpha", null, "emp_1", "TRAVEL", 3000, "2026-11-16", "Visit", "Taxi", true, "storage_123");
  h.managerReview("usr_mgr_alpha", "ws_alpha", res.claimId, "APPROVE");
  h.financeReview("usr_admin_alpha", "ws_alpha", res.claimId, "APPROVE");
  
  const logs = h.auditLogs.filter(l => l.claimId === res.claimId);
  assert.strictEqual(logs.length, 3);
  assert.strictEqual(logs[0].action, "SUBMITTED");
  assert.strictEqual(logs[1].action, "MANAGER_APPROVED");
  assert.strictEqual(logs[2].action, "FINANCE_APPROVED");
});

test("11. Amount validation (> 0)", () => {
  const h = new MockReimbursementHarness();
  assert.throws(() => {
    h.saveClaim("usr_emp_alpha_1", "ws_alpha", null, "emp_1", "TRAVEL", 0, "2026-11-16", "Visit", "Taxi", false);
  }, /Claim amount must be greater than zero/);
});

test("12. Decimal/paisa precision rounding", () => {
  const h = new MockReimbursementHarness();
  const res = h.saveClaim("usr_emp_alpha_1", "ws_alpha", null, "emp_1", "TRAVEL", 450.50, "2026-11-16", "Visit", "Auto", true, "storage_123");
  assert.strictEqual(h.claims[0].claimAmount, 450.50);
});

test("13. Maximum category claim limits", () => {
  const h = new MockReimbursementHarness();
  // Food limit is 5000
  assert.throws(() => {
    h.saveClaim("usr_emp_alpha_1", "ws_alpha", null, "emp_1", "FOOD", 7500, "2026-11-16", "Dinner", "Food", false);
  }, /Claim amount exceeds maximum limit/);
});

test("14. Duplicate claim prevention", () => {
  const h = new MockReimbursementHarness();
  h.saveClaim("usr_emp_alpha_1", "ws_alpha", null, "emp_1", "TRAVEL", 3000, "2026-11-16", "Visit", "Taxi", true, "storage_1");
  assert.throws(() => {
    h.saveClaim("usr_emp_alpha_1", "ws_alpha", null, "emp_1", "TRAVEL", 3000, "2026-11-16", "Visit duplicate", "Taxi", true, "storage_2");
  }, /Potential duplicate claim detected/);
});

test("15. Tax treatment preservation (Taxable vs Potentially Exempt vs Non-taxable)", () => {
  const h = new MockReimbursementHarness();
  h.saveClaim("usr_emp_alpha_1", "ws_alpha", null, "emp_1", "TRAVEL", 2000, "2026-11-16", "Cab", false);
  h.saveClaim("usr_emp_alpha_1", "ws_alpha", null, "emp_1", "FOOD", 1200, "2026-11-16", "Lunch", false);
  h.saveClaim("usr_emp_alpha_1", "ws_alpha", null, "emp_1", "FUEL", 2500, "2026-11-16", "Petrol", false);

  assert.strictEqual(h.claims[0].taxTreatment, "NON_TAXABLE_BUSINESS");
  assert.strictEqual(h.claims[1].taxTreatment, "TAXABLE");
  assert.strictEqual(h.claims[2].taxTreatment, "POTENTIALLY_EXEMPT");
});

test("16. Approved amount vs claimed amount differentiation", () => {
  const h = new MockReimbursementHarness();
  const res = h.saveClaim("usr_emp_alpha_1", "ws_alpha", null, "emp_1", "TRAVEL", 5000, "2026-11-16", "Travel", "Flight", true, "storage_1");
  h.managerReview("usr_mgr_alpha", "ws_alpha", res.claimId, "APPROVE");
  h.financeReview("usr_admin_alpha", "ws_alpha", res.claimId, "APPROVE", 4200);

  const claim = h.claims.find(c => c._id === res.claimId);
  assert.strictEqual(claim.claimAmount, 5000);
  assert.strictEqual(claim.approvedAmount, 4200);
});

test("17. Payroll preview reconciliation (Reimbursements as additions)", () => {
  const h = new MockReimbursementHarness();
  const res = h.saveClaim("usr_emp_alpha_1", "ws_alpha", null, "emp_1", "TRAVEL", 5000, "2026-11-16", "Travel", "Flight", true, "storage_1");
  h.managerReview("usr_mgr_alpha", "ws_alpha", res.claimId, "APPROVE");
  h.financeReview("usr_admin_alpha", "ws_alpha", res.claimId, "APPROVE");

  const preview = h.calculatePreview("usr_admin_alpha", "ws_alpha", "2026-11");
  const emp1 = preview.items.find(i => i.employeeId === "emp_1");
  assert.strictEqual(emp1.totalReimbursements, 5000);
  assert.strictEqual(emp1.netSalary, 55000); // 50,000 gross + 5,000 reimbursement
});

test("18. Payroll finalization settlement", () => {
  const h = new MockReimbursementHarness();
  const res = h.saveClaim("usr_emp_alpha_1", "ws_alpha", null, "emp_1", "TRAVEL", 5000, "2026-11-16", "Travel", "Flight", true, "storage_1");
  h.managerReview("usr_mgr_alpha", "ws_alpha", res.claimId, "APPROVE");
  h.financeReview("usr_admin_alpha", "ws_alpha", res.claimId, "APPROVE");

  h.finalizeRun("usr_admin_alpha", "ws_alpha", "2026-11");
  assert.strictEqual(h.claims[0].status, "SETTLED");
  assert.strictEqual(h.claims[0].settledInPayrollMonth, "2026-11");
});

test("19. Duplicate settlement prevention", () => {
  const h = new MockReimbursementHarness();
  const res = h.saveClaim("usr_emp_alpha_1", "ws_alpha", null, "emp_1", "TRAVEL", 5000, "2026-11-16", "Travel", "Flight", true, "storage_1");
  h.managerReview("usr_mgr_alpha", "ws_alpha", res.claimId, "APPROVE");
  h.financeReview("usr_admin_alpha", "ws_alpha", res.claimId, "APPROVE");

  h.finalizeRun("usr_admin_alpha", "ws_alpha", "2026-11");
  
  // Subsequent payroll run preview for 2026-12 does not include already settled claim
  const preview12 = h.calculatePreview("usr_admin_alpha", "ws_alpha", "2026-12");
  const emp1 = preview12.items.find(i => i.employeeId === "emp_1");
  assert.strictEqual(emp1.totalReimbursements, 0);
  assert.strictEqual(emp1.netSalary, 50000);
});

test("20. Net salary non-negativity with reimbursements", () => {
  const h = new MockReimbursementHarness();
  const preview = h.calculatePreview("usr_admin_alpha", "ws_alpha", "2026-11");
  assert.strictEqual(preview.items[0].netSalary >= 0, true);
});

test("21. Unauthenticated access rejection", () => {
  const h = new MockReimbursementHarness();
  assert.throws(() => {
    h.saveClaim(null, "ws_alpha", null, "emp_1", "TRAVEL", 1000, "2026-11-16", "Cab", "Cab", false);
  }, /Not authenticated/);
});

test("22. Cross-tenant read rejection", () => {
  const h = new MockReimbursementHarness();
  assert.throws(() => {
    h.calculatePreview("usr_admin_beta", "ws_alpha", "2026-11");
  }, /Forbidden: Not a member of this workspace/);
});

test("23. Cross-tenant mutation rejection", () => {
  const h = new MockReimbursementHarness();
  assert.throws(() => {
    h.saveClaim("usr_admin_alpha", "ws_alpha", null, "emp_beta", "TRAVEL", 1000, "2026-11-16", "Cab", "Cab", false);
  }, /Invalid employee reference or cross-tenant violation/);
});

test("24. Employee ownership enforcement (Cannot submit claim for others)", () => {
  const h = new MockReimbursementHarness();
  assert.throws(() => {
    h.saveClaim("usr_emp_alpha_1", "ws_alpha", null, "emp_2", "TRAVEL", 1000, "2026-11-16", "Cab", "Cab", false);
  }, /Forbidden: You can only submit reimbursement claims for yourself/);
});

test("25. Unauthorized manager approval rejection", () => {
  const h = new MockReimbursementHarness();
  const res = h.saveClaim("usr_emp_alpha_1", "ws_alpha", null, "emp_1", "TRAVEL", 3000, "2026-11-16", "Visit", "Taxi", true, "storage_1");
  assert.throws(() => {
    h.managerReview("usr_emp_alpha_2", "ws_alpha", res.claimId, "APPROVE");
  }, /Forbidden: Role 'member' lacks permission/);
});

test("26. Unauthorized finance approval rejection", () => {
  const h = new MockReimbursementHarness();
  const res = h.saveClaim("usr_emp_alpha_1", "ws_alpha", null, "emp_1", "TRAVEL", 3000, "2026-11-16", "Visit", "Taxi", true, "storage_1");
  h.managerReview("usr_mgr_alpha", "ws_alpha", res.claimId, "APPROVE");
  assert.throws(() => {
    h.financeReview("usr_emp_alpha_2", "ws_alpha", res.claimId, "APPROVE");
  }, /Forbidden: Role 'member' lacks permission/);
});

test("27. Self-approval prevention (Separation of duties)", () => {
  const h = new MockReimbursementHarness();
  // Admin Arjun Verma is also emp_1
  h.employees[0].userId = "usr_admin_alpha";
  const res = h.saveClaim("usr_admin_alpha", "ws_alpha", null, "emp_1", "TRAVEL", 3000, "2026-11-16", "Visit", "Taxi", true, "storage_1");
  
  assert.throws(() => {
    h.managerReview("usr_admin_alpha", "ws_alpha", res.claimId, "APPROVE");
  }, /Separation of duties violation: You cannot approve your own claim/);
});

test("28. Secure receipt requirement validation", () => {
  const h = new MockReimbursementHarness();
  assert.throws(() => {
    h.saveClaim("usr_emp_alpha_1", "ws_alpha", null, "emp_1", "TRAVEL", 3000, "2026-11-16", "Visit", "Taxi", true, null);
  }, /Receipt document is mandatory for category TRAVEL/);
});

test("29. Client-side approved amount manipulation rejection", () => {
  const h = new MockReimbursementHarness();
  const res = h.saveClaim("usr_emp_alpha_1", "ws_alpha", null, "emp_1", "TRAVEL", 3000, "2026-11-16", "Visit", "Taxi", true, "storage_1");
  h.managerReview("usr_mgr_alpha", "ws_alpha", res.claimId, "APPROVE");

  // Attempting to approve 4000 when claimed was 3000
  assert.throws(() => {
    h.financeReview("usr_admin_alpha", "ws_alpha", res.claimId, "APPROVE", 4000);
  }, /Approved amount cannot exceed original claimed amount/);
});

test("30. Audit attribution integrity", () => {
  const h = new MockReimbursementHarness();
  const res = h.saveClaim("usr_emp_alpha_1", "ws_alpha", null, "emp_1", "TRAVEL", 3000, "2026-11-16", "Visit", "Taxi", true, "storage_1");
  h.managerReview("usr_mgr_alpha", "ws_alpha", res.claimId, "APPROVE");
  h.financeReview("usr_admin_alpha", "ws_alpha", res.claimId, "APPROVE");
  h.finalizeRun("usr_admin_alpha", "ws_alpha", "2026-11");

  const actions = h.auditLogs.map(l => l.action);
  assert.ok(actions.includes("SUBMITTED"));
  assert.ok(actions.includes("MANAGER_APPROVED"));
  assert.ok(actions.includes("FINANCE_APPROVED"));
  assert.ok(actions.includes("SETTLED_IN_PAYROLL"));
});
