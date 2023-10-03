import type { ChangeEvent, MouseEvent } from "react";
import { useRef, useState } from "react";
import { Form } from "@remix-run/react";

import { ButtonAnimate } from "~/components/button-animate";
import NumericInput from "~/components/numeric-input";
import { Card, CardContent, CardFooter } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { getCompoundValue } from "~/lib/get-compound-value";
import { formatCurrency } from "~/lib/numbers/format-currency";
import PageContainer from "~/components/page-container";

type Frequency = "annually" | "monthly";

const frequencyMap = {
  annually: 1,
  monthly: 12,
} satisfies Record<Frequency, number>;

const MAX_DURATION = 101;

export default function route() {
  const [initialInvestment, setInitialInvestment] = useState("");
  const [monthlyContribution, setMonthlyContribution] = useState("");
  const [years, setYears] = useState("");
  const [interest, setInterest] = useState("");
  const [frequency, setFrequency] = useState<Frequency>("annually");
  const [finalBalance, setFinalBalance] = useState(0);
  const [isResultReady, setIsResultReady] = useState(false);
  const [isMaxDuration, setIsMaxDuration] = useState(false);
  const yearsRef = useRef("");

  const isFormFilled =
    !initialInvestment || !monthlyContribution || !years || !interest;

  function handleCalculate() {
    setFinalBalance(0);
    yearsRef.current = years;

    const finalBalance = getCompoundValue({
      principal: Number(initialInvestment),
      years: Number(years),
      monthlyContribution: Number(monthlyContribution),
      annualInterestRate: Number(interest) / 100,
      compoundingFrequency: frequencyMap[frequency],
    });

    setFinalBalance(finalBalance);
    setIsResultReady(true);
  }

  function resetForm() {
    setIsResultReady(false);
    setInitialInvestment("");
    setMonthlyContribution("");
    setYears("");
    setInterest("");
    setFrequency("annually");
    setIsMaxDuration(false);
  }

  function handleResetForm(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    resetForm();
  }

  function handleChangeFrequency(e: ChangeEvent<HTMLSelectElement>) {
    setFrequency(e.currentTarget.value as Frequency);
  }

  return (
    <PageContainer title="Compound Interest Calculator">
      <Card className="mt-10">
        <Form onSubmit={handleCalculate}>
          <CardContent className="pt-4">
            <div>
              <Label htmlFor="initialInvestment">
                Initial Investment (IDR)
              </Label>
              <NumericInput
                id="initialInvestment"
                value={initialInvestment}
                onValueChange={(v) => setInitialInvestment(v.value)}
              />
            </div>

            <div className="mt-4">
              <Label htmlFor="monthlyContribution">
                Monthly Contribution (IDR)
              </Label>
              <NumericInput
                id="monthlyContribution"
                value={monthlyContribution}
                onValueChange={(v) => setMonthlyContribution(v.value)}
              />
            </div>

            <div className="mt-4">
              <Label className="mb-4" htmlFor="years">
                Duration (years)
              </Label>
              <NumericInput
                className={`mt-2 ${
                  isMaxDuration
                    ? " focus-visible:ring-red-400 focus-visible:ring-offset-2"
                    : ""
                }`}
                id="years"
                value={years}
                onValueChange={(v) => setYears(v.value)}
                prefix=""
                isAllowed={(values) => {
                  const { floatValue = 0 } = values;
                  const belowLimit = floatValue < MAX_DURATION;

                  if (!belowLimit) {
                    setIsMaxDuration(true);
                  } else {
                    setIsMaxDuration(false);
                  }

                  return floatValue < MAX_DURATION;
                }}
              />
              <span
                className={`${
                  isMaxDuration
                    ? "opacity-100 transform translate-y-0"
                    : "opacity-0 transform -translate-y-4"
                } text-xs text-red-500 transition-all duration-400 ease-in-out`}
              >
                Maximum duration is 100 years
              </span>
            </div>

            <div className="my-2">
              <Label htmlFor="interest">Estimated Interest Rate (%)</Label>
              <NumericInput
                id="interest"
                value={interest}
                onValueChange={(v) => setInterest(v.value)}
                prefix=""
                thousandSeparator=","
                decimalSeparator="."
              />
            </div>

            <div className="my-2">
              <Label>Compound Frequency</Label>

              <select
                defaultValue={frequency}
                onChange={handleChangeFrequency}
                className="flex h-10 w-full mt-4 items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus:ring-slate-300"
              >
                <option value="annually">Annually</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            <CardFooter className="flex justify-end gap-2 p-0 mt-6">
              <ButtonAnimate variant="destructive" onClick={handleResetForm}>
                Reset
              </ButtonAnimate>
              <ButtonAnimate type="submit" disabled={isFormFilled}>
                Calculate
              </ButtonAnimate>
            </CardFooter>
          </CardContent>
        </Form>
      </Card>

      <Card
        className={`mt-4 transition-all duration-300 ease-out	 ${
          isResultReady
            ? "opacity-100 transform translate-y-0"
            : "opacity-0 transform -translate-y-4"
        }`}
      >
        <CardContent className="flex flex-col gap-2 items-center w-full overflow-hidden pt-4">
          <p className="font-medium text-slate-500 text-md">
            In {yearsRef.current} years, you will have
          </p>
          <p className="font-semibold text-xl text-slate-800 overflow-x-scroll w-full text-center">
            {formatCurrency(finalBalance)}
          </p>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
