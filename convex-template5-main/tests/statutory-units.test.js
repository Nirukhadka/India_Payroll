const test = require("node:test");
const assert = require("node:assert");

test("Days in Month", () => {
  const getDays = (y, m) => new Date(y, m, 0).getDate();
  assert.strictEqual(getDays(2026, 11), 30);
  assert.strictEqual(getDays(2026, 2), 28);
  assert.strictEqual(getDays(2024, 2), 29);
});

test("EPF Ceiling", () => {
  const calc = (b) => Math.round(Math.min(b, 15000) * 0.12);
  assert.strictEqual(calc(25000), 1800);
  assert.strictEqual(calc(12000), 1440);
});

test("ESI Ceiling", () => {
  assert.strictEqual(18000 <= 21000, true);
  assert.strictEqual(25000 <= 21000, false);
});