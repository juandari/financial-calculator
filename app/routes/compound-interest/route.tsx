import { Form, useActionData, useNavigation } from '@remix-run/react';
import {
  json,
  type ActionFunctionArgs,
  type MetaFunction,
} from '@remix-run/node';

import { ButtonAnimate } from '~/components/button-animate';
import NumericInput from '~/components/numeric-input';
import { Card, CardContent, CardFooter } from '~/components/ui/card';
import { Label } from '~/components/ui/label';
import { getCompoundValue } from '~/lib/get-compound-value.server';
import { formatCurrency } from '~/lib/numbers/format-currency';
import PageContainer from '~/components/page-container';
import type { CompoundFrequency } from '~/model/types';
import { removeRpPrefix } from '~/lib/string/remove-rp-prefix';
import { Loader2 } from 'lucide-react';

export const meta: MetaFunction = () => {
  return [
    { title: 'Compound Interest Calculator' },
    { name: 'description', content: 'Calculate compound interest' },
  ];
};

const frequencyMap = {
  annually: 1,
  monthly: 12,
} satisfies Record<CompoundFrequency, number>;

const MAX_DURATION = 101;

function validateYears(years: number) {
  if (years > MAX_DURATION) {
    return 'Maximum duration is 100 years';
  }
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const initialInvestment = String(formData.get('initialInvestment'));
  const monthlyContribution = String(formData.get('monthlyContribution'));
  const years = String(formData.get('years'));
  const interest = String(formData.get('interest'));
  const compoundFrequency = formData.get(
    'compoundFrequency'
  ) as CompoundFrequency;

  // this is for field validatoin purpose
  const fieldErrors = { years: validateYears(Number(years)) };

  if (fieldErrors.years) {
    return json({ finalBalance: '', years, fieldErrors });
  }

  const finalBalance = getCompoundValue({
    principal: Number(removeRpPrefix(initialInvestment)),
    years: Number(years),
    monthlyContribution: Number(removeRpPrefix(monthlyContribution)),
    annualInterestRate: Number(interest) / 100,
    compoundingFrequency: frequencyMap[compoundFrequency],
  });

  return json({
    finalBalance: formatCurrency(finalBalance),
    years,
    fieldErrors,
  });
}

export default function route() {
  const data = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.formAction === '/compound-interest';

  return (
    <PageContainer title="Compound Interest Calculator">
      <Card className="mt-10">
        <Form method="POST">
          <CardContent className="pt-4">
            <div>
              <Label htmlFor="initialInvestment">
                Initial Investment (IDR)
              </Label>
              <NumericInput id="initialInvestment" name="initialInvestment" />
            </div>

            <div className="mt-4">
              <Label htmlFor="monthlyContribution">
                Monthly Contribution (IDR)
              </Label>
              <NumericInput
                id="monthlyContribution"
                name="monthlyContribution"
              />
            </div>

            <div className="mt-4">
              <Label className="mb-4" htmlFor="years">
                Duration (years)
              </Label>
              <NumericInput
                className={`mt-2 ${
                  data?.fieldErrors.years
                    ? ' focus-visible:ring-red-400 focus-visible:ring-offset-2'
                    : ''
                }`}
                id="years"
                name="years"
                prefix=""
              />
              <span
                className={`${
                  data?.fieldErrors.years
                    ? 'opacity-100 transform translate-y-0'
                    : 'opacity-0 transform -translate-y-4'
                } text-xs text-red-500 transition-all duration-400 ease-in-out`}
              >
                {data?.fieldErrors.years}
              </span>
            </div>

            <div className="my-2">
              <Label htmlFor="interest">Estimated Interest Rate (%)</Label>
              <NumericInput
                id="interest"
                name="interest"
                prefix=""
                thousandSeparator=","
                decimalSeparator="."
              />
            </div>

            <div className="my-2">
              <Label htmlFor="compoundFrequency">Compound Frequency</Label>

              <select
                id="compoundFrequency"
                name="compoundFrequency"
                className="flex h-10 w-full mt-4 items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus:ring-slate-300"
              >
                <option value="annually">Annually</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            <CardFooter className="flex justify-end gap-2 p-0 mt-6">
              <ButtonAnimate type="submit" className="gap-2">
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Calculate'
                )}
              </ButtonAnimate>
            </CardFooter>
          </CardContent>
        </Form>
      </Card>

      <Card
        className={`mt-4 transition-all duration-300 ease-out	 ${
          data?.finalBalance
            ? 'opacity-100 transform translate-y-0'
            : 'opacity-0 transform -translate-y-4'
        }`}
      >
        <CardContent className="flex flex-col gap-2 items-center w-full overflow-hidden pt-4">
          <p className="font-medium text-slate-500 text-md">
            In {data?.years} years, you will have
          </p>
          <p className="font-semibold text-xl text-slate-800 overflow-x-scroll w-full text-center">
            {data?.finalBalance}
          </p>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
