import { Form } from "@remix-run/react";
import PageContainer from "~/components/page-container";
import { Card, CardContent } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Label } from "~/components/ui/label";
import NumericInput from "~/components/numeric-input";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { json } from "@remix-run/node";
import type { MetaFunction, ActionFunctionArgs } from "@remix-run/node";
import { useSplitBillViewModel } from "./view-model";
import InputName from "./input-name";
import PaidBy from "./paid-by";
import MultiplePeopleInput from "./multiple-people-input";
import { ButtonAnimate } from "~/components/button-animate";
import { formatCurrency } from "../../lib/numbers/format-currency";
import { Separator } from "~/components/ui/separator";

export const meta: MetaFunction = () => {
  return [
    { title: "Split Bill" },
    { name: "description", content: "Split expenses with friends and family" },
  ];
};

export async function loader() {
  return json({ hello: "world" });
}

export default function SpliBillPage() {
  const {
    participantName,
    participantNameRef,
    participants,
    paidBy,
    bill,
    settlements,
    setBill,
    handleChangePaidBy,
    handleAddName,
    handleChangeName,
    handleEditName,
    handleDeleteName,
    handleChangePaidAmounts,
    handleCalculateEqually,
  } = useSplitBillViewModel();

  return (
    <PageContainer title="Split Bill">
      <h1 className="text-2xl font-bold mb-4">Under construction</h1>
      <Card className="mt-10">
        <Form method="post">
          <CardContent className="pt-4">
            <div>
              <Label htmlFor="billAmount">
                Bill Amount (IDR) <span className="text-red-500">*</span>
              </Label>
              <NumericInput
                id="billAmount"
                name="billAmount"
                placeholder="Amount"
                value={bill}
                onChange={(e) => setBill(e.target.value)}
                className={`mt-2 ${bill ? "" : "border-red-400"}`}
              />
            </div>

            <div className="mt-4">
              <Label htmlFor="participantName">
                Participants (More than 1){" "}
                <span className="text-red-500">*</span>
              </Label>
              <div className="flex items-center gap-2 mt-2">
                <Input
                  ref={participantNameRef}
                  name="participantName"
                  type="text"
                  placeholder="Name"
                  value={participantName}
                  onChange={handleChangeName}
                  className={participants.length > 1 ? "" : "border-red-400"}
                />
                <Button
                  name="intent"
                  value="addParticipant"
                  onClick={handleAddName}
                >
                  Add
                </Button>
              </div>
            </div>
            {Boolean(participants.length) && (
              <article className="my-3 flex flex-col gap-1">
                {participants.map((participant) => (
                  <InputName
                    key={participant.id}
                    defaultName={participant.name}
                    id={participant.id}
                    onEdit={handleEditName}
                    onDelete={handleDeleteName}
                  />
                ))}
              </article>
            )}

            {participants.length > 0 && (
              <>
                <Label className="mt-1">
                  Paid by <span className="text-red-500">*</span>
                </Label>
                <div className="flex justify-content flex-col gap-2 mt-2">
                  <PaidBy
                    value={paidBy}
                    onValueChange={handleChangePaidBy}
                    participants={participants}
                  />
                  {paidBy.includes("Multiple") && participants.length > 1 && (
                    <MultiplePeopleInput
                      participants={participants}
                      onSubmit={handleChangePaidAmounts}
                    />
                  )}
                </div>
              </>
            )}

            <Tabs defaultValue="account" className="w-full mt-4">
              <TabsList className="w-full">
                <TabsTrigger className="w-[50%]" value="equally">
                  equally
                </TabsTrigger>
                <TabsTrigger className="w-[50%]" value="unequally">
                  unequally
                </TabsTrigger>
              </TabsList>
              <TabsContent value="equally">
                <ButtonAnimate
                  onClick={handleCalculateEqually}
                  className="bg-teal-500 hover:bg-teal-400 w-full"
                >
                  Calculate
                </ButtonAnimate>
                {settlements && (
                  <div className="mt-3">
                    <h2 className="font-bold mb-4">
                      Who pays whom and how much
                    </h2>
                    {settlements.map((s, idx) => (
                      <div key={idx}>
                        <div className="flex justify-center gap-4 mt-2">
                          <p className="w-[25%] ellipsis">{s.payer}</p>
                          <div className="flex items-center w-[50%]">
                            <span className="bg-teal-500 text-white px-2">
                              {formatCurrency(s.amount)}
                            </span>
                            <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[14px] border-l-teal-500 border-b-[12px] border-b-transparent"></div>
                          </div>
                          <p className="w-[25%] ellipsis">{s.recipient}</p>
                        </div>
                        <Separator className="mt-2" />
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="unequally">
                <ButtonAnimate className="bg-cyan-500 hover:bg-cyan-400 w-full">
                  Calculate
                </ButtonAnimate>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Form>
      </Card>
    </PageContainer>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  return {
    title: "Split Bill",
  };
}
