import type { ChangeEvent, MouseEvent } from "react";
import { useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Form, Link } from "@remix-run/react";

import { ButtonAnimate } from "~/components/ButtonAnimate";
import NumericInput from "~/components/NumericInput";
import { Card, CardContent, CardFooter } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { getCompoundValue } from "~/lib/get-compound-value";
import { formatCurrency } from "~/lib/numbers/format-currency";

type Frequency = "annually" | "monthly";

const frequencyMap = {
  annually: 1,
  monthly: 12,
} satisfies Record<Frequency, number>;

export default function route() {
  const [initialInvestment, setInitialInvestment] = useState("");
  const [monthlyContribution, setMonthlyContribution] = useState("");
  const [years, setYears] = useState("");
  const [interest, setInterest] = useState("");
  const [frequency, setFrequency] = useState<Frequency>("annually");
  const [finalBalance, setFinalBalance] = useState(0);
  const [isResultReady, setIsResultReady] = useState(false);
  const yearsRef = useRef("");

  const isFormFilled =
    !initialInvestment || !monthlyContribution || !years || !interest;

  function resetForm() {
    setIsResultReady(false);
    setInitialInvestment("");
    setMonthlyContribution("");
    setYears("");
    setInterest("");
    setFrequency("annually");
  }

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

  function handleResetForm(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    resetForm();
  }

  function handleChangeFrequency(e: ChangeEvent<HTMLSelectElement>) {
    setFrequency(e.currentTarget.value as Frequency);
  }

  return (
    <div className="py-8 px-6 max-w-[390px] m-auto">
      <Link to=".." replace className="inline-block">
        <ArrowLeft className="cursor-pointer" color="white" />
      </Link>

      <h1 className="text-2xl text-white font-semibold mt-4">
        Compound Interest Calculator
      </h1>

      <Card className="mt-10">
        <Form onSubmit={handleCalculate}>
          <CardContent className="pt-4">
            <div>
              <Label htmlFor="initialInvestment">Initial Investment</Label>
              <NumericInput
                id="initialInvestment"
                value={initialInvestment}
                onValueChange={(v) => setInitialInvestment(v.value)}
              />
            </div>

            <div className="mt-2">
              <Label htmlFor="monthlyContribution">Monthly Contribution</Label>
              <NumericInput
                id="monthlyContribution"
                value={monthlyContribution}
                onValueChange={(v) => setMonthlyContribution(v.value)}
              />
            </div>

            <div className="mt-2">
              <Label htmlFor="years">Length of Time in Years</Label>
              <NumericInput
                id="years"
                value={years}
                onValueChange={(v) => setYears(v.value)}
                prefix=""
              />
            </div>

            <div className="my-2">
              <Label htmlFor="interest">Estimated Interest Rate (%)</Label>
              <NumericInput
                id="interest"
                value={interest}
                onValueChange={(v) => setInterest(v.value)}
                prefix=""
              />
            </div>

            <div className="my-2">
              <Label>Compound Frequency</Label>

              <select
                defaultValue={frequency}
                onChange={handleChangeFrequency}
                className="flex h-10 w-full mt-2 items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus:ring-slate-300"
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
        className={`mt-2 transition-all duration-300 ease-out	 ${
          isResultReady
            ? "opacity-100 transform translate-y-0"
            : "opacity-0 transform -translate-y-4"
        } `}
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
    </div>
  );
}
