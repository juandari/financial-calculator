import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "@remix-run/react";

import { ButtonAnimate } from "~/components/ButtonAnimate";
import NumericInput from "~/components/NumericInput";
import { Card, CardContent, CardFooter } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
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

  const isFormFilled =
    !initialInvestment && !monthlyContribution && !years && !interest;

  function handleCalculate() {
    const finalBalance = getCompoundValue({
      principal: Number(initialInvestment),
      years: Number(years),
      monthlyContribution: Number(monthlyContribution),
      annualInterestRate: Number(interest),
      compoundingFrequency: frequencyMap[frequency],
    });

    setFinalBalance(finalBalance);
    setIsResultReady(true);
  }

  function handleResetForm() {
    setIsResultReady(false);
    setTimeout(() => {
      setInitialInvestment("");
      setMonthlyContribution("");
      setYears("");
      setInterest("");
      setFrequency("annually");
      setFinalBalance(0);
    }, 1000);
  }

  return (
    <div className="py-8 px-6">
      <Link to=".." replace>
        <ArrowLeft className="cursor-pointer" color="white" />
      </Link>

      <h1 className="text-2xl text-white font-semibold mt-4">
        Compound Interest Calculator
      </h1>

      <Card className="mt-10">
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
            <Label htmlFor="interest">Estimated Interest Rate</Label>
            <NumericInput
              id="interest"
              value={interest}
              onValueChange={(v) => setInterest(v.value)}
              prefix=""
            />
          </div>

          <Select
            onValueChange={(v: Frequency) => setFrequency(v)}
            defaultValue={frequency}
          >
            <Label>Compound Frequency</Label>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select a compound frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="annually">Annually</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <CardFooter className="flex justify-end gap-2 p-0 mt-6">
            <ButtonAnimate variant="destructive" onClick={handleResetForm}>
              Reset
            </ButtonAnimate>
            <ButtonAnimate onClick={handleCalculate} disabled={isFormFilled}>
              Calculate
            </ButtonAnimate>
          </CardFooter>
        </CardContent>
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
            In {years} years, you will have
          </p>
          <p className="font-semibold text-xl text-slate-800 overflow-x-scroll w-full text-center">
            {formatCurrency(finalBalance)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
