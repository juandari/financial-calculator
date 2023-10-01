import type { FormEvent, MouseEvent } from "react";
import { useState } from "react";

import { getAmortization } from "~/lib/get-amortization";
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
import { Card, CardContent, CardFooter } from "~/components/ui/card";
import { Form } from "@remix-run/react";
import { Label } from "~/components/ui/label";
import NumericInput from "~/components/numeric-input";
import { ButtonAnimate } from "~/components/button-animate";

const MONTHS_IN_A_YEAR = 12;

export default function Amortization() {
  const [price, setPrice] = useState("");
  const [downPayment, setDownPayment] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [duration, setDuration] = useState("");
  const [fixDuration, setFixDuration] = useState("");
  const [floatingInterestRate, setFloatingInterestRate] = useState("13");
  const [amortizationData, setAmortizationData] = useState<
    ReturnType<typeof getAmortization>
  >([]);
  const [isResultReady, setIsResultReady] = useState(false);

  const isFormFilled =
    !price ||
    !interestRate ||
    !duration ||
    !floatingInterestRate ||
    !fixDuration ||
    !downPayment;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const numPayments = Number(duration) * MONTHS_IN_A_YEAR;
    const interestRates: number[] = [];

    for (let i = 0; i < Number(numPayments); i++) {
      if (i < Number(fixDuration) * MONTHS_IN_A_YEAR) {
        interestRates.push(Number(interestRate));
      } else {
        interestRates.push(Number(floatingInterestRate));
      }
    }

    const result = getAmortization({
      principal: Number(price),
      downPayment: Number(downPayment),
      interestRates,
      numPayments: Number(numPayments),
    });

    setAmortizationData(result);
    setIsResultReady(true);
  };

  function resetForm() {
    setPrice("");
    setInterestRate("");
    setDuration("");
    setFloatingInterestRate("13");
  }

  function handleResetForm(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    resetForm();
  }

  return (
    <>
      <PageContainer title="Amortization Table Calculator">
        <Card className="mt-10">
          <Form onSubmit={(e) => handleSubmit(e)}>
            <CardContent className="pt-4">
              <div>
                <Label htmlFor="price">Price (IDR)</Label>
                <NumericInput
                  id="price"
                  value={price}
                  onValueChange={(v) => setPrice(v.value)}
                />
              </div>

              <div className="mt-2">
                <Label htmlFor="downPayment">Down Payment (IDR)</Label>
                <NumericInput
                  id="downPayment"
                  value={downPayment}
                  onValueChange={(v) => setDownPayment(v.value)}
                />
              </div>

              <div className="mt-2">
                <Label htmlFor="interestRate">Fixed Interest Rate (%)</Label>
                <NumericInput
                  id="interestRate"
                  value={interestRate}
                  onValueChange={(v) => setInterestRate(v.value)}
                  thousandSeparator=","
                  decimalSeparator="."
                  prefix=""
                />
              </div>

              <div className="mt-2">
                <Label htmlFor="fixDuration">Fixed Rate Duration (years)</Label>
                <NumericInput
                  id="fixDuration"
                  value={fixDuration}
                  onValueChange={(v) => setFixDuration(v.value)}
                  prefix=""
                />
              </div>

              <div className="my-2">
                <Label htmlFor="floatingInterestRate">
                  Floating Interest Rate (%)
                </Label>
                <NumericInput
                  id="floatingInterestRate"
                  value={floatingInterestRate}
                  onValueChange={(v) => setFloatingInterestRate(v.value)}
                  prefix=""
                  thousandSeparator=","
                  decimalSeparator="."
                />
              </div>

              <div className="mt-2">
                <Label htmlFor="duration">Tenures (years)</Label>
                <NumericInput
                  id="duration"
                  value={duration}
                  onValueChange={(v) => setDuration(v.value)}
                  prefix=""
                />
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
      </PageContainer>

      <div
        className={`mx-8 transition-all duration-300 ease-out	 ${
          isResultReady
            ? "opacity-100 transform translate-y-0"
            : "opacity-0 transform -translate-y-4"
        }`}
      >
        <h2 className=" font-bold text-lg text-slate-800">
          Amortization Table
        </h2>
        <Card className={`mt-4`}>
          <CardContent>
            <Table className=" mt-10 rounded-lg">
              <TableHeader>
                <TableRow>
                  <TableHead>Month</TableHead>
                  <TableHead>Montly Payment</TableHead>
                  <TableHead>Principal Payment</TableHead>
                  <TableHead>Interest Payment</TableHead>
                  <TableHead className="text-right">
                    Remaining Principal
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {amortizationData.map((item) => (
                  <TableRow key={item.month}>
                    <TableCell>{item.month}</TableCell>
                    <TableCell className="w-[200px]">
                      {formatCurrency(item.monthlyPayment)}
                    </TableCell>
                    <TableCell>
                      {formatCurrency(item.principalPayment)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(item.interestPayment)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(item.remainingPrincipal)}
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
