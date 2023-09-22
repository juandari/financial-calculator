interface GetCompoundValue {
  principal: number;
  annualInterestRate: number;
  compoundingFrequency: number;
  years: number;
  monthlyContribution: number;
}
// A = P * (1 + r/n)^(n*t) + (PMT * (((1 + r/n)^(n*t) - 1) / (r/n)))

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

  return futureValue + (monthlyContribution * (Math.pow(1 + r, t) - 1)) / r;
}
