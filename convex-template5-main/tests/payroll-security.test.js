const test = require("node:test");
const assert = require("node:assert");

// Mock Database & Context Harness for Organization & Role Isolation
class MockConvexDb {
  constructor() {
    this.workspaces = [
      { _id: "ws_alpha", name: "Alpha Corp" },
      { _id: "ws_beta", name: "Beta Corp" }
    ];
    this.memberships = [
      { userId: "usr_alice", workspaceId: "ws_alpha", role: "admin" },
      { userId: "usr_bob", workspaceId: "ws_alpha", role: "member" },
      { userId: "usr_carol", workspaceId: "ws_alpha", role: "member" },
      { userId: "usr_dave", workspaceId: "ws_beta", role: "admin" }
    ];
    this.employees = [
      { _id: "emp_bob", workspaceId: "ws_alpha", userId: "usr_bob", name: "Bob", basic: 50000 },
      { _id: "emp_carol", workspaceId: "ws_alpha", userId: "usr_carol", name: "Carol", basic: 60000 },
      { _id: "emp_eve", workspaceId: "ws_beta", userId: "usr_eve", name: "Eve", basic: 70000 }
    ];
    this.payrollRuns = [
      { _id: "run_alpha_nov", workspaceId: "ws_alpha", period: "2026-11", status: "processed" },
      { _id: "run_beta_nov", workspaceId: "ws_beta", period: "2026-11", status: "processed" }
    ];
    this.payrollItems = [
      { _id: "item_bob", workspaceId: "ws_alpha", payrollRunId: "run_alpha_nov", employeeId: "emp_bob", netSalary: 45000 },
      { _id: "item_carol", workspaceId: "ws_alpha", payrollRunId: "run_alpha_nov", employeeId: "emp_carol", netSalary: 54000 },
      { _id: "item_eve", workspaceId: "ws_beta", payrollRunId: "run_beta_nov", employeeId: "emp_eve", netSalary: 62000 }
    ];
  }

  // Security Gate 1: Require Member
  requireMember(userId, workspaceId) {
    const m = this.memberships.find(mem => mem.userId === userId && mem.workspaceId === workspaceId);
    if (!m) throw new Error("Forbidden: Not a member of this workspace/organization");
    return m;
  }

  // Security Gate 2: Require Role
  requireRole(userId, workspaceId, allowedRoles) {
    const m = this.requireMember(userId, workspaceId);
    if (!allowedRoles.includes(m.role)) {
      throw new Error(`Forbidden: Role '${m.role}' lacks permission. Required: [${allowedRoles.join(', ')}]`);
    }
    return m;
  }

  // Operation: Read Payroll Run Details
  getRunDetails(userId, workspaceId, runId) {
    this.requireRole(userId, workspaceId, ["admin"]);
    const run = this.payrollRuns.find(r => r._id === runId && r.workspaceId === workspaceId);
    if (!run) throw new Error("Payroll run not found or does not belong to your workspace");
    return {
      run,
      items: this.payrollItems.filter(i => i.payrollRunId === runId && i.workspaceId === workspaceId)
    };
  }

  // Operation: View Payslip
  getPayslip(userId, workspaceId, runId, employeeId) {
    const m = this.requireMember(userId, workspaceId);
    if (m.role === "member") {
      const me = this.employees.find(e => e.workspaceId === workspaceId && e.userId === userId);
      if (!me || me._id !== employeeId) {
        throw new Error("Forbidden: You can only view your own payslip");
      }
    }
    const item = this.payrollItems.find(i => i.payrollRunId === runId && i.employeeId === employeeId && i.workspaceId === workspaceId);
    if (!item) throw new Error("Payslip record not found");
    return item;
  }

  // Operation: Trigger Payroll Run
  createRun(userId, workspaceId, period) {
    this.requireRole(userId, workspaceId, ["admin"]);
    return { success: true, createdRunId: `run_${workspaceId}_${period}` };
  }
}

const db = new MockConvexDb();

test("1. Cross-Organization Tenant Data Leakage Prevention", () => {
  // Dave (Admin of Beta Corp) attempts to read Alpha Corp's payroll
  assert.throws(
    () => db.getRunDetails("usr_dave", "ws_alpha", "run_alpha_nov"),
    /Forbidden: Not a member of this workspace\/organization/
  );

  // Dave attempts to access Alpha's payslip
  assert.throws(
    () => db.getPayslip("usr_dave", "ws_alpha", "run_alpha_nov", "emp_bob"),
    /Forbidden: Not a member of this workspace\/organization/
  );
});

test("2. Horizontal Privilege Escalation Prevention (Employee Snooping)", () => {
  // Bob (Member in Alpha) attempts to view Carol's payslip
  assert.throws(
    () => db.getPayslip("usr_bob", "ws_alpha", "run_alpha_nov", "emp_carol"),
    /Forbidden: You can only view your own payslip/
  );

  // Bob views his OWN payslip -> Allowed
  const myPayslip = db.getPayslip("usr_bob", "ws_alpha", "run_alpha_nov", "emp_bob");
  assert.strictEqual(myPayslip.netSalary, 45000);
});

test("3. Unauthorized Role Attempting Payroll Processing", () => {
  // Bob (regular employee / member) attempts to trigger payroll processing
  assert.throws(
    () => db.createRun("usr_bob", "ws_alpha", "2026-11"),
    /Forbidden: Role 'member' lacks permission. Required: \[admin\]/
  );

  // Alice (Admin in Alpha) triggers payroll processing -> Allowed
  const res = db.createRun("usr_alice", "ws_alpha", "2026-11");
  assert.strictEqual(res.success, true);
});

test("4. Missing or Invalid Organization Context", () => {
  assert.throws(
    () => db.getRunDetails("usr_alice", "ws_nonexistent", "run_alpha_nov"),
    /Forbidden: Not a member of this workspace\/organization/
  );
});
