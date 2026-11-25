import { describe, it } from 'node:test';
import assert from 'node:assert';
import { getDaysInMonth, isHraAllowance, isSpecialAllowance, isConveyanceAllowance } from './packages/backend/convex/statutory.js';

describe('IndiaPay Statutory Payroll Calculation Units', () => {
  it('correctly calculates days in months for calendar cycles', () => {
    assert.strictEqual(getDaysInMonth(2026, 11), 30, 'November 2026 has 30 days');
    assert.strictEqual(getDaysInMonth(2026, 10), 31, 'October 2026 has 31 days');
    assert.strictEqual(getDaysInMonth(2024, 2), 29, 'Leap year Feb 2024 has 29 days');
    assert.strictEqual(getDaysInMonth(2025, 2), 28, 'Standard Feb 2025 has 28 days');
  });

  it('correctly classifies Indian salary components', () => {
    assert.strictEqual(isHraAllowance('HRA'), true);
    assert.strictEqual(isHraAllowance('House Rent Allowance'), true);
    assert.strictEqual(isHraAllowance('Special Allowance'), false);
    
    assert.strictEqual(isSpecialAllowance('Special Allowance'), true);
    assert.strictEqual(isSpecialAllowance('Special'), true);
    assert.strictEqual(isSpecialAllowance('Medical Allowance'), false);

    assert.strictEqual(isConveyanceAllowance('Conveyance'), true);
    assert.strictEqual(isConveyanceAllowance('Conveyance Allowance'), true);
    assert.strictEqual(isConveyanceAllowance('HRA'), false);
  });
});
