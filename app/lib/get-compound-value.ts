interface GetCompoundValue {
  initial: number;
  interest: number;
  contributionsPerYear: number;
  years: number;
  monthlyContribution: number;
}

export function getCompoundValue({
  initial,
  interest,
  contributionsPerYear,
  years,
  monthlyContribution,
}: GetCompoundValue) {
  return (
    (initial * (1 + interest / contributionsPerYear)) ^
    (contributionsPerYear * years +
      monthlyContribution *
        (((1 + interest / contributionsPerYear) ^
          (contributionsPerYear * years - 1)) /
          (interest / contributionsPerYear)))
  );
}
