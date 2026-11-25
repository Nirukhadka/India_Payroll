const test = require("node:test");
const assert = require("node:assert");

// Statutory Rules according to EPFO, ESIC, and PT Acts
// 1. EPF: Wage Ceiling Rs 15,000 (EPFO GSR 608(E) w.e.f 01-09-2014)
// 2. EPS: 8.33% capped at Rs 1,250 (15,000 * 8.33% = 1249.50 -> rounded to 1,250)
// 3. ESI: Wage Ceiling Rs 21,000 (ESIC Notification w.e.f 01-01-2017), EE rate 0.75%, ER rate 3.25%
// 4. Professional Tax: Karnataka Slab (<15,000: 0, >=15,000: 200)

function computeStatutory(basic, allowances = [], lopDays = 0, totalDays = 30, state = "Karnataka") {
  if (basic < 0 || isNaN(basic)) throw new Error("Invalid basic salary: must be non-negative");
  const gross = basic + allowances.reduce((s, a) => s + Math.max(0, a.amount || 0), 0);
  if (gross < 0) throw new Error("Invalid gross salary");
  
  // LOP Proration
  const daysWorked = Math.max(0, totalDays - lopDays);
  const proration = totalDays > 0 ? daysWorked / totalDays : 0;
  const earnedBasic = Math.round(basic * proration);
  const earnedGross = Math.round(gross * proration);
  
  // EPF
  const EPF_CEILING = 15000;
  const eligiblePfWage = Math.min(earnedBasic, EPF_CEILING);
  const epfEmployee = Math.round(eligiblePfWage * 0.12);
  const epsEmployer = Math.min(1250, Math.round(Math.min(eligiblePfWage, 15000) * 0.0833));
  const epfEmployer = Math.max(0, Math.round(eligiblePfWage * 0.12) - epsEmployer);
  const edliEmployer = Math.min(75, Math.round(Math.min(eligiblePfWage, 15000) * 0.005));
  
  // ESI
  const ESI_CEILING = 21000;
  const isEsiEligible = earnedGross <= ESI_CEILING && earnedGross > 0;
  const esiEmployee = isEsiEligible ? Math.ceil(earnedGross * 0.0075) : 0;
  const esiEmployer = isEsiEligible ? Math.ceil(earnedGross * 0.0325) : 0;
  
  // PT (Karnataka)
  let pt = 0;
  if (state === "Karnataka" && earnedGross >= 15000) {
    pt = 200;
  }
  
  const netPay = Math.max(0, earnedGross - (epfEmployee + esiEmployee + pt));
  
  return {
    gross,
    earnedGross,
    epfEmployee,
    epsEmployer,
    epfEmployer,
    edliEmployer,
    esiEmployee,
    esiEmployer,
    pt,
    netPay
  };
}

test("1. Zero Salary Edge Case", () => {
  const res = computeStatutory(0, []);
  assert.strictEqual(res.gross, 0);
  assert.strictEqual(res.earnedGross, 0);
  assert.strictEqual(res.epfEmployee, 0);
  assert.strictEqual(res.esiEmployee, 0);
  assert.strictEqual(res.pt, 0);
  assert.strictEqual(res.netPay, 0);
});

test("2. Negative and Invalid Salary Input Rejection", () => {
  assert.throws(() => computeStatutory(-5000), /Invalid basic salary/);
  assert.throws(() => computeStatutory(NaN), /Invalid basic salary/);
});

test("3. EPF Statutory Wage Ceiling Thresholds", () => {
  // Exactly at ceiling: 15,000
  const atCeiling = computeStatutory(15000);
  assert.strictEqual(atCeiling.epfEmployee, 1800);
  assert.strictEqual(atCeiling.epsEmployer, 1250);
  assert.strictEqual(atCeiling.epfEmployer, 550);
  assert.strictEqual(atCeiling.edliEmployer, 75);

  // Immediately below ceiling: 14,999
  const belowCeiling = computeStatutory(14999);
  assert.strictEqual(belowCeiling.epfEmployee, 1800);
  assert.strictEqual(belowCeiling.epsEmployer, 1249);
  assert.strictEqual(belowCeiling.epfEmployer, 551);

  // Immediately above ceiling: 15,001 (capped at 15,000)
  const aboveCeiling = computeStatutory(15001);
  assert.strictEqual(aboveCeiling.epfEmployee, 1800);
  assert.strictEqual(aboveCeiling.epsEmployer, 1250);
  assert.strictEqual(aboveCeiling.epfEmployer, 550);
});

test("4. ESI Statutory Wage Ceiling Thresholds", () => {
  // Exactly at ceiling: 21,000
  const atCeiling = computeStatutory(21000);
  assert.strictEqual(atCeiling.esiEmployee, 158);
  assert.strictEqual(atCeiling.esiEmployer, 683);

  // Immediately below ceiling: 20,999
  const belowCeiling = computeStatutory(20999);
  assert.strictEqual(belowCeiling.esiEmployee, 158);
  assert.strictEqual(belowCeiling.esiEmployer, 683);

  // Immediately above ceiling: 21,001 (exempt from ESI)
  const aboveCeiling = computeStatutory(21001);
  assert.strictEqual(aboveCeiling.esiEmployee, 0);
  assert.strictEqual(aboveCeiling.esiEmployer, 0);
});

test("5. Leap Year February and Calendar Days Proration", () => {
  const getDaysInMonth = (y, m) => new Date(y, m, 0).getDate();
  assert.strictEqual(getDaysInMonth(2024, 2), 29); // Leap year
  assert.strictEqual(getDaysInMonth(2025, 2), 28); // Non-leap year
  assert.strictEqual(getDaysInMonth(2026, 2), 28); // Non-leap year
  assert.strictEqual(getDaysInMonth(2028, 2), 29); // Leap year

  // Leap year February (29 days) with 1 day LOP
  const leapFeb = computeStatutory(29000, [], 1, 29);
  assert.strictEqual(leapFeb.earnedGross, 28000);
});

test("6. Rounding Behavior and Precision Compliance", () => {
  const res = computeStatutory(12345);
  assert.strictEqual(res.epfEmployee, Math.round(12345 * 0.12));
  assert.strictEqual(res.esiEmployee, Math.ceil(12345 * 0.0075));
  assert.strictEqual(res.esiEmployer, Math.ceil(12345 * 0.0325));
});

test("7. Employer vs Employee Contribution Separation", () => {
  const res = computeStatutory(25000);
  // Employee deductions: 1800 (EPF) + 200 (PT) = 2000
  assert.strictEqual(res.epfEmployee, 1800);
  assert.strictEqual(res.pt, 200);
  assert.strictEqual(res.netPay, 23000);
  // Employer contributions: 550 (EPF) + 1250 (EPS) + 75 (EDLI) = 1875
  assert.strictEqual(res.epfEmployer, 550);
  assert.strictEqual(res.epsEmployer, 1250);
  assert.strictEqual(res.edliEmployer, 75);
});
