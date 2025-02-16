interface AmortizationArgs {
  principal: number;
  interestRates: number[];
  numPayments: number;
  downPayment: number;
}

export function getAmortization({
  principal, // the same as price
  interestRates,
  numPayments,
  downPayment,
}: AmortizationArgs) {
  const loan = principal - downPayment;
  if (interestRates.length !== numPayments) {
    throw new Error(
      "Interest rates array length should match the number of payments."
    );
  }

  const amortizationData = [];
  let remainingPrincipal = loan;

  for (let month = 0; month < numPayments; month++) {
    const monthlyInterestRate = interestRates[month] / 12 / 100;
    const monthlyPayment =
      (remainingPrincipal * monthlyInterestRate) /
      (1 - Math.pow(1 + monthlyInterestRate, -numPayments + month));

    const interestPayment = remainingPrincipal * monthlyInterestRate;
    const principalPayment = monthlyPayment - interestPayment;
    remainingPrincipal -= principalPayment;

    const paymentData = {
      month: month + 1,
      monthlyPayment,
      interestPayment,
      principalPayment,
      remainingPrincipal,
    };

    amortizationData.push(paymentData);
  }

  const totalPayment = amortizationData.reduce(
    (acc, curr) => acc + curr.monthlyPayment,
    0
  );

  return { amortizationData, totalPayment };
}
