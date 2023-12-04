import { redirect } from "@remix-run/node";
import type { MetaFunction, ActionFunctionArgs } from "@remix-run/node";
import { Form, useNavigation, useSearchParams } from "@remix-run/react";

import { ButtonAnimate } from "~/components/button-animate";
import NumericInput from "~/components/numeric-input";
import PageContainer from "~/components/page-container";
import { Card, CardContent, CardFooter } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { getSavingsGoal } from "~/lib/get-savings-goal.server";
import { formatCurrency } from "~/lib/numbers/format-currency";
import { paramsToObject } from "~/lib/params-to-object";
import { removeRpPrefix } from "~/lib/string/remove-rp-prefix";
import type { CompoundFrequency } from "~/model/types";

export const meta: MetaFunction = () => {
  return [
    { title: "Savings Goal Calculator" },
    {
      name: "description",
      content:
        "Determine your monthly savings target needed to achieve your financial goal.",
    },
  ];
};

export default function SavingsGoal() {
  const [searchParams] = useSearchParams();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const search = searchParams.entries();
  const { s, i, m, y, f, r } = paramsToObject(search);
  const isMonthlySavingsReady = Boolean(m);

  return (
    <PageContainer title="Savings Goal">
      <Card className="mt-10">
        <Form method="POST">
          <CardContent className="pt-4">
            <div>
              <Label htmlFor="savingsGoal">Savings Goal (IDR)</Label>
              <NumericInput
                id="savingsGoal"
                name="savingsGoal"
                defaultValue={s}
              />
            </div>

            <div className="mt-4">
              <Label htmlFor="initialInvestment">Initial Savings (IDR)</Label>
              <NumericInput
                id="initialInvestment"
                name="initialInvestment"
                defaultValue={i}
              />
            </div>

            <div className="mt-4">
              <Label htmlFor="duration">Duration (years)</Label>
              <NumericInput
                id="duration"
                name="duration"
                prefix=""
                defaultValue={y}
              />
            </div>

            <div className="my-2">
              <Label htmlFor="interest">Estimated Interest Rate (%)</Label>
              <NumericInput
                id="interest"
                name="interest"
                prefix=""
                thousandSeparator=","
                decimalSeparator="."
                defaultValue={r}
              />
            </div>

            <div className="my-2">
              <Label>Compound Frequency</Label>

              <select
                id="compoundFrequency"
                name="compoundFrequency"
                defaultValue={f}
                className="flex h-10 w-full mt-4 items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus:ring-slate-300"
              >
                <option value="annually">Annually</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            <CardFooter className="flex justify-end gap-2 p-0 mt-6">
              <ButtonAnimate type="submit">
                {isSubmitting ? "Loading..." : "Calculate"}
              </ButtonAnimate>
            </CardFooter>
          </CardContent>
        </Form>
      </Card>

      <Card
        className={`mt-4 transition-all duration-300 ease-out	 ${
          isMonthlySavingsReady
            ? "opacity-100 transform translate-y-0"
            : "opacity-0 transform -translate-y-4"
        }`}
      >
        <CardContent className="flex flex-col gap-1 items-center w-full overflow-hidden pt-4 font-medium text-slate-500 text-md">
          <p>You will need to save</p>
          <p className="text-lg font-semibold text-slate-600 text-center">
            {m}
          </p>
          <p className="text-center">
            every month over the next {y} years to reach a savings of
          </p>
          <p className="text-lg font-semibold text-green-500 text-center">
            {s}
          </p>
        </CardContent>
      </Card>
    </PageContainer>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const savingsGoal = String(formData.get("savingsGoal"));
  const initialInvestment = String(formData.get("initialInvestment"));
  const duration = String(formData.get("duration"));
  const interest = String(formData.get("interest"));
  const compoundFrequency = formData.get(
    "compoundFrequency"
  ) as CompoundFrequency;

  const monthlySaving = getSavingsGoal({
    savingsGoal: Number(removeRpPrefix(savingsGoal)),
    initialInvestment: Number(removeRpPrefix(initialInvestment)),
    yearsToGrow: Number(removeRpPrefix(duration)),
    annualInterestRate: Number(removeRpPrefix(interest)),
    compoundFrequency,
  });

  return redirect(
    `/savings-goal?s=${savingsGoal}&i=${initialInvestment}&y=${duration}&r=${interest}&f=${compoundFrequency}&m=${formatCurrency(
      Number(monthlySaving)
    )}`
  );
}
