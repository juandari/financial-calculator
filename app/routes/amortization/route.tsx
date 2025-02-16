import {
  json,
  type ActionFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import { Loader2 } from "lucide-react";

import { getAmortization } from "~/lib/get-amortization.server";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import PageContainer from "~/components/page-container";
import { formatCurrency } from "~/lib/numbers/format-currency";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { Label } from "~/components/ui/label";
import NumericInput from "~/components/numeric-input";
import { ButtonAnimate } from "~/components/button-animate";
import { removeRpPrefix } from "~/lib/string/remove-rp-prefix";

const MONTHS_IN_A_YEAR = 12;
const MAX_TENURES = 36;

function validateDuration(years: number) {
  if (years > MAX_TENURES) {
    return "Maximum tenures is 35 years";
  }
}

export const meta: MetaFunction = () => {
  return [
    { title: "Amortization Calculator" },
    { name: "description", content: "Generate amortization table" },
  ];
};

export default function Amortization() {
  const data = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.formAction === "/amortization";

  return (
    <>
      <PageContainer title="Amortization Table">
        <Card className="mt-10">
          <Form method="POST">
            <CardContent className="pt-4">
              <div>
                <Label htmlFor="price">Price (IDR)</Label>
                <NumericInput id="price" name="price" />
              </div>

              <div className="mt-2">
                <Label htmlFor="downPayment">Down Payment (IDR)</Label>
                <NumericInput id="downPayment" name="downPayment" />
              </div>

              <div className="mt-2">
                <Label htmlFor="interestRate">Fixed Interest Rate (%)</Label>
                <NumericInput
                  id="interestRate"
                  name="interestRate"
                  thousandSeparator=","
                  decimalSeparator="."
                  prefix=""
                />
              </div>

              <div className="mt-2">
                <Label htmlFor="fixDuration">Fixed Rate Duration (years)</Label>
                <NumericInput id="fixDuration" name="fixDuration" prefix="" />
              </div>

              <div className="my-2">
                <Label htmlFor="floatingInterestRate">
                  Floating Interest Rate (%)
                </Label>
                <NumericInput
                  id="floatingInterestRate"
                  name="floatingInterestRate"
                  prefix=""
                  thousandSeparator=","
                  decimalSeparator="."
                />
              </div>

              <div className="mt-2">
                <Label htmlFor="duration">Tenures (years)</Label>
                <NumericInput
                  className={`mt-2 text-base ${
                    data?.fieldErrors?.duration
                      ? " focus-visible:ring-red-400 focus-visible:ring-offset-2"
                      : ""
                  }`}
                  id="duration"
                  name="duration"
                  prefix=""
                />
                <span
                  className={`${
                    data?.fieldErrors?.duration
                      ? "opacity-100 transform translate-y-0"
                      : "opacity-0 transform -translate-y-4"
                  } text-xs text-red-500 transition-all duration-400 ease-in-out`}
                >
                  {data?.fieldErrors.duration}
                </span>
              </div>

              <CardFooter className="flex justify-end gap-2 p-0 mt-2">
                <ButtonAnimate type="submit">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Calculate"
                  )}
                </ButtonAnimate>
              </CardFooter>
            </CardContent>
          </Form>
        </Card>
      </PageContainer>

      <div
        className={`mx-8 transition-all duration-300 ease-out	 ${
          data?.amortizationData
            ? "opacity-100 transform translate-y-0"
            : "opacity-0 transform -translate-y-4"
        }`}
      >
        <Card className="mt-4">
          <CardHeader className="pb-4">
            <CardTitle>Total Payment</CardTitle>
            <CardDescription>Total payment of your loan</CardDescription>
          </CardHeader>
          <CardContent>
            <span className="text-2xl ">
              {formatCurrency(data?.totalPayment)}
            </span>
          </CardContent>
        </Card>

        <Card className="mt-4">
          <CardHeader className="pb-4">
            <CardTitle>Monthly Payment</CardTitle>
            <CardDescription>Before & After Floating Rate</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div>
              <h3 className="text-md text-slate-700 font-semibold">Before</h3>
              <span className="text-2xl text-green-400">
                {formatCurrency(data?.amortizationData[0]?.monthlyPayment)}
              </span>
            </div>
            <div>
              <h3 className="text-md text-slate-700 font-semibold">After</h3>
              <span className="text-2xl text-red-400">
                {formatCurrency(
                  data?.amortizationData[data?.fixDuration * MONTHS_IN_A_YEAR]
                    ?.monthlyPayment
                )}
              </span>
            </div>
          </CardContent>
        </Card>

        <h2 className=" font-bold text-lg text-slate-800 mt-4">
          Amortization Table
        </h2>
        <Card className="rounded-md border">
          <CardContent className="relative overflow-y-auto max-h-[600px]">
            <Table className="mt-2 rounded-lg">
              <TableHeader>
                <TableRow>
                  <TableHead>Month</TableHead>
                  <TableHead>Monthly Payment</TableHead>
                  <TableHead>Principal Payment</TableHead>
                  <TableHead>Interest Payment</TableHead>
                  <TableHead>Remaining Principal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.amortizationData.map((item, index) => (
                  <TableRow key={item?.month}>
                    <TableCell>{item?.month}</TableCell>
                    <TableCell className="w-[200px]">
                      {formatCurrency(item?.monthlyPayment)}
                    </TableCell>
                    <TableCell>
                      {formatCurrency(item?.principalPayment)}
                    </TableCell>
                    <TableCell>
                      {formatCurrency(item?.interestPayment)}
                    </TableCell>
                    <TableCell>
                      {/* if the remaining principal is negative, we need to show it as positive. This occurs when the loan is paid off, i.e. the remaining principal is 0. */}
                      {index === data?.amortizationData.length - 1
                        ? formatCurrency(
                            Math.abs(Math.round(item?.remainingPrincipal))
                          )
                        : formatCurrency(item?.remainingPrincipal)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const price = String(formData.get("price"));
  const downPayment = String(formData.get("downPayment"));
  const interestRate = String(formData.get("interestRate"));
  const fixDuration = String(formData.get("fixDuration"));
  const floatingInterestRate = String(formData.get("floatingInterestRate"));
  const duration = String(formData.get("duration"));

  // this is for field validatoin purpose
  const fieldErrors = { duration: validateDuration(Number(duration)) };

  if (fieldErrors.duration) {
    return json({
      amortizationData: [],
      fieldErrors,
      fixDuration: Number(fixDuration),
      totalPayment: 0,
    });
  }

  const numPayments = Number(duration) * MONTHS_IN_A_YEAR;
  const interestRates: number[] = [];

  for (let i = 0; i < Number(numPayments); i++) {
    if (i < Number(fixDuration) * MONTHS_IN_A_YEAR) {
      interestRates.push(Number(interestRate));
    } else {
      interestRates.push(Number(floatingInterestRate));
    }
  }

  const { amortizationData, totalPayment } = getAmortization({
    principal: Number(removeRpPrefix(price)),
    downPayment: Number(removeRpPrefix(downPayment)),
    interestRates,
    numPayments: Number(numPayments),
  });

  return json({
    amortizationData,
    fixDuration: Number(fixDuration),
    fieldErrors,
    totalPayment,
  });
}
