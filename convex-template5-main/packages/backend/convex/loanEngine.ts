/**
 * Precise, Decimal-Safe EMI & Loan Amortization Calculation Engine
 * 
 * METHODOLOGY & ASSUMPTIONS:
 * 1. Standard Reducing Balance Methodology (Equated Monthly Installment - EMI):
 *    Formula: E = [P * r * (1 + r)^n] / [(1 + r)^n - 1]
 *    where:
 *      P = Principal amount in cents/paisa (scaled by 100 for integer arithmetic)
 *      r = Monthly interest rate = (Annual Rate % / 12) / 100
 *      n = Tenure in months
 * 
 * 2. Zero-Interest Methodology:
 *    When annual interest rate is 0%:
 *      Base monthly installment = Math.floor(P / n)
 *      Final installment = P - (Base * (n - 1))  [Absorbs any remainder cents/paisa]
 * 
 * 3. Repayment Schedule Amortization:
 *    For month m = 1..n:
 *      Interest for month m: I_m = Math.round(OutstandingBalance * r)
 *      Principal for month m: P_m = E - I_m
 *      Outstanding Balance: Bal_m = Bal_{m-1} - P_m
 *    Final installment adjustment:
 *      In the final month or when remaining balance < E:
 *      Principal = OutstandingBalance
 *      Installment = Principal + Interest
 * 
 * 4. Early Repayment & Recalculation:
 *    When an extra lump-sum is paid:
 *      New Outstanding Principal = Max(0, Current Balance - LumpSum)
 *      Remaining Tenure or recalculated EMI updated accordingly.
 */

export interface AmortizationScheduleItem {
  installmentNumber: number;
  repaymentMonth: string; // "YYYY-MM"
  beginningBalance: number;
  emiAmount: number;
  principalComponent: number;
  interestComponent: number;
  endingBalance: number;
}

export interface EmiCalculationResult {
  monthlyEmiAmount: number;
  totalInterestPayable: number;
  totalAmountPayable: number;
  schedule: AmortizationScheduleItem[];
}

/**
 * Helper to advance a YYYY-MM string by N months
 */
export function addMonths(startMonth: string, monthsToAdd: number): string {
  const parts = startMonth.split("-");
  const yearStr = parts[0] || "2026";
  const monthStr = parts[1] || "01";
  let year = parseInt(yearStr, 10);
  let month = parseInt(monthStr, 10) - 1; // 0-indexed

  month += monthsToAdd;
  year += Math.floor(month / 12);
  month = (month % 12) + 1;

  const mm = month < 10 ? `0${month}` : `${month}`;
  return `${year}-${mm}`;
}

/**
 * Calculates standard Reducing Balance EMI with exact decimal-safe financial rounding.
 */
export function calculateEmiAndSchedule(
  principalAmount: number,
  annualInterestRatePercent: number,
  tenureMonths: number,
  startMonth: string = "2026-12"
): EmiCalculationResult {
  if (principalAmount <= 0) {
    throw new Error("Principal amount must be greater than zero");
  }
  if (tenureMonths <= 0 || !Number.isInteger(tenureMonths)) {
    throw new Error("Tenure in months must be a positive integer");
  }
  if (annualInterestRatePercent < 0) {
    throw new Error("Interest rate cannot be negative");
  }

  // Work with integer paisa/cents to avoid floating point drift
  const principalPaisa = Math.round(principalAmount * 100);
  const schedule: AmortizationScheduleItem[] = [];

  // Zero-Interest Case
  if (annualInterestRatePercent === 0) {
    const baseEmiPaisa = Math.floor(principalPaisa / tenureMonths);
    const lastEmiPaisa = principalPaisa - baseEmiPaisa * (tenureMonths - 1);
    const monthlyEmi = Math.round(baseEmiPaisa / 100);

    let currentBalancePaisa = principalPaisa;

    for (let i = 1; i <= tenureMonths; i++) {
      const monthStr = addMonths(startMonth, i - 1);
      const isLast = i === tenureMonths;
      const emiForThisMonthPaisa = isLast ? lastEmiPaisa : baseEmiPaisa;
      const principalPaidPaisa = emiForThisMonthPaisa;
      const interestPaidPaisa = 0;
      const endingBalancePaisa = Math.max(0, currentBalancePaisa - principalPaidPaisa);

      schedule.push({
        installmentNumber: i,
        repaymentMonth: monthStr,
        beginningBalance: Math.round(currentBalancePaisa) / 100,
        emiAmount: Math.round(emiForThisMonthPaisa) / 100,
        principalComponent: Math.round(principalPaidPaisa) / 100,
        interestComponent: 0,
        endingBalance: Math.round(endingBalancePaisa) / 100,
      });

      currentBalancePaisa = endingBalancePaisa;
    }

    return {
      monthlyEmiAmount: monthlyEmi,
      totalInterestPayable: 0,
      totalAmountPayable: principalAmount,
      schedule,
    };
  }

  // Standard Reducing Balance Interest Case
  const monthlyRate = annualInterestRatePercent / 12 / 100;
  const rateFactor = Math.pow(1 + monthlyRate, tenureMonths);
  const emiPaisaExact = (principalPaisa * monthlyRate * rateFactor) / (rateFactor - 1);
  const monthlyEmiPaisa = Math.round(emiPaisaExact);
  const monthlyEmi = Math.round(monthlyEmiPaisa / 100);

  let currentBalancePaisa = principalPaisa;
  let totalInterestPaisa = 0;

  for (let i = 1; i <= tenureMonths; i++) {
    const monthStr = addMonths(startMonth, i - 1);
    const beginningBalancePaisa = currentBalancePaisa;

    // Monthly interest = Beginning Balance * monthlyRate
    let interestPaisa = Math.round(beginningBalancePaisa * monthlyRate);
    let principalPaidPaisa = monthlyEmiPaisa - interestPaisa;
    let emiForMonthPaisa = monthlyEmiPaisa;

    // Adjustment for final installment or balance truncation
    if (i === tenureMonths || principalPaidPaisa >= beginningBalancePaisa) {
      principalPaidPaisa = beginningBalancePaisa;
      emiForMonthPaisa = principalPaidPaisa + interestPaisa;
    }

    const endingBalancePaisa = Math.max(0, beginningBalancePaisa - principalPaidPaisa);
    totalInterestPaisa += interestPaisa;

    schedule.push({
      installmentNumber: i,
      repaymentMonth: monthStr,
      beginningBalance: Math.round(beginningBalancePaisa) / 100,
      emiAmount: Math.round(emiForMonthPaisa) / 100,
      principalComponent: Math.round(principalPaidPaisa) / 100,
      interestComponent: Math.round(interestPaisa) / 100,
      endingBalance: Math.round(endingBalancePaisa) / 100,
    });

    currentBalancePaisa = endingBalancePaisa;
    if (currentBalancePaisa <= 0) break;
  }

  const totalAmountPayable = Math.round((principalPaisa + totalInterestPaisa) / 100);

  return {
    monthlyEmiAmount: monthlyEmi,
    totalInterestPayable: Math.round(totalInterestPaisa) / 100,
    totalAmountPayable,
    schedule,
  };
}

/**
 * Early / Partial Repayment Recalculation
 */
export function recalculateAfterPrepayment(
  currentOutstandingPrincipal: number,
  prepaymentAmount: number,
  annualInterestRatePercent: number,
  remainingTenureMonths: number,
  startMonth: string
): {
  newOutstandingPrincipal: number;
  newMonthlyEmi: number;
  isFullyClosed: boolean;
  schedule: AmortizationScheduleItem[];
} {
  const newOutstanding = Math.max(0, currentOutstandingPrincipal - prepaymentAmount);
  if (newOutstanding === 0 || remainingTenureMonths <= 0) {
    return {
      newOutstandingPrincipal: 0,
      newMonthlyEmi: 0,
      isFullyClosed: true,
      schedule: [],
    };
  }

  const result = calculateEmiAndSchedule(
    newOutstanding,
    annualInterestRatePercent,
    remainingTenureMonths,
    startMonth
  );

  return {
    newOutstandingPrincipal: newOutstanding,
    newMonthlyEmi: result.monthlyEmiAmount,
    isFullyClosed: false,
    schedule: result.schedule,
  };
}
