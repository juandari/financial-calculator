interface GetSavingsGoal {
  savingsGoal: number;
  initialInvestment: number;
  yearsToGrow: number;
  annualInterestRate: number;
  compoundFrequency: 'annually' | 'monthly';
}

const compoundingFreqMap = {
  annually: 1,
  monthly: 12,
};

export function getSavingsGoal({
  savingsGoal,
  initialInvestment,
  yearsToGrow,
  annualInterestRate,
  compoundFrequency,
}: GetSavingsGoal) {
  // Convert annualInterestRate to decimal form
  const r = annualInterestRate / 100;

  // Calculate the number of times interest is compounded per year
  const n = compoundingFreqMap[compoundFrequency];

  // Calculate the total number of compounding periods
  const totalPeriods = n * yearsToGrow;

  // Calculate the future value of the goal
  const futureValue = savingsGoal - initialInvestment;

  const divider = compoundFrequency === 'annually' ? 12 : 1;

  // Calculate the monthly savings required
  const PMT =
    futureValue / ((Math.pow(1 + r / n, totalPeriods) - 1) / (r / n)) / divider;

  return PMT.toFixed(2); // Return the result rounded to 2 decimal places
}
