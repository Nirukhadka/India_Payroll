const fs = require('fs');
let code = fs.readFileSync('tests/payroll-loan-integration-p23.2.test.js', 'utf8');

const oldBlock = `test("11. Concurrent payroll processing safety", () => {
  const h = new MockPayrollPipelineHarness();
  h.addLoan("ws_alpha", "emp_1", "PERSONAL", 20000, 0, 2, 10000, "ACTIVE");
  const runId = h.createRun("usr_admin_alpha", "ws_alpha", "2026-11");

  // Simulate two finalizeRun invocations
  h.finalizeRun("usr_admin_alpha", "ws_alpha", runId);
  h.finalizeRun("usr_admin_alpha", "ws_alpha", runId);

  // Exactly 1 repayment record created
  const reps = h.loanRepayments.filter(r => r.employeeId === "emp_1");
  assert.strictEqual(reps.length, 1);
});`;

const newBlock = `test("11. Concurrent payroll processing safety", () => {
  const h = new MockPayrollPipelineHarness();
  h.addLoan("ws_alpha", "emp_1", "PERSONAL", 20000, 0, 2, 10000, "ACTIVE");
  const runId = h.createRun("usr_admin_alpha", "ws_alpha", "2026-11");

  // First finalization succeeds
  h.finalizeRun("usr_admin_alpha", "ws_alpha", runId);

  // Concurrent/subsequent finalization on already processed run is safely rejected
  assert.throws(() => {
    h.finalizeRun("usr_admin_alpha", "ws_alpha", runId);
  }, /Cannot finalize run with status processed/);

  // Exactly 1 repayment record created
  const reps = h.loanRepayments.filter(r => r.employeeId === "emp_1");
  assert.strictEqual(reps.length, 1);
});`;

if (!code.includes(oldBlock)) {
  console.error("oldBlock not found");
  process.exit(1);
}
code = code.replace(oldBlock, newBlock);
fs.writeFileSync('tests/payroll-loan-integration-p23.2.test.js', code, 'utf8');
console.log("Successfully updated test 11!");
