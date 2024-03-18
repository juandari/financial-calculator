import { Form } from "@remix-run/react";
import PageContainer from "~/components/page-container";
import { Card, CardContent } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Label } from "~/components/ui/label";
import NumericInput from "~/components/numeric-input";
import InputName from "./InputName";

export async function action() {
  return {
    title: "Split Bill",
  };
}

export default function SpliBillPage() {
  function handleAddName() {
    console.log("Add name");
  }

  return (
    <PageContainer title="Split Bill">
      <Card className="mt-10">
        <p className="m-2 font-bold text-2xl text-red-400">
          Under construction!
        </p>
        <Form method="POST">
          <CardContent className="pt-4">
            <div>
              <Label htmlFor="initialInvestment">Bill Amount (IDR)</Label>
              <NumericInput id="initialInvestment" name="initialInvestment" />
            </div>

            <div className="mt-4">
              <Label htmlFor="paidBy">Paid by</Label>
              <div className="flex items-center gap-2 mt-2">
                <InputName onClick={handleAddName} />
              </div>
            </div>

            <Tabs defaultValue="account" className="w-full mt-4">
              <TabsList className="w-full">
                <TabsTrigger className="w-[50%]" value="account">
                  equally
                </TabsTrigger>
                <TabsTrigger className="w-[50%]" value="password">
                  unequally
                </TabsTrigger>
              </TabsList>
              <TabsContent value="account">
                Make changes to your account here.
              </TabsContent>
              <TabsContent value="password">
                Change your password here.
              </TabsContent>
            </Tabs>
          </CardContent>
        </Form>
      </Card>
    </PageContainer>
  );
}
