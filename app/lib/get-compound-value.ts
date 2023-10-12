interface GetCompoundValue {
  principal: number;
  annualInterestRate: number;
  compoundingFrequency: number;
  years: number;
  monthlyContribution: number;
}

const MONTHS = 12;

export function getCompoundValue({
  principal,
  annualInterestRate,
  monthlyContribution,
  compoundingFrequency,
  years,
}: GetCompoundValue) {
  const n = compoundingFrequency;
  const r = annualInterestRate / n;
  const t = years * n;

  let futureValue = principal * Math.pow(1 + r, t);

  for (let i = 1; i <= t; i++) {
    futureValue +=
      monthlyContribution *
      (MONTHS / compoundingFrequency) *
      Math.pow(1 + r, t - i);
  }

  return futureValue;
}
