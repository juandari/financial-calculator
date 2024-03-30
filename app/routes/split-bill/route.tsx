import PageContainer from "~/components/page-container";
import { Card, CardContent } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Label } from "~/components/ui/label";
import NumericInput from "~/components/numeric-input";
import { Input } from "~/components/ui/input";
import { json } from "@remix-run/node";
import type { MetaFunction, ActionFunctionArgs } from "@remix-run/node";
import { useSplitBillViewModel } from "./view-model";
import InputName from "./input-name";
import PaidBy from "./paid-by";
import MultiplePeopleInput from "./multiple-people-input";
import { ButtonAnimate } from "~/components/button-animate";
import Settlement from "./settlement";

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
    equalSettlements,
    unequalSettlements,
    setBill,
    handleChangePaidBy,
    handleAddName,
    handleChangeName,
    handleEditName,
    handleDeleteName,
    handleChangePaidAmounts,
    handleChangeExpenseAmounts,
    handleCalculateEqually,
    handleCalculateUnequally,
  } = useSplitBillViewModel();

  return (
    <PageContainer title="Split Bill">
      <Card className="mt-10">
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
              Participants (More than 1) <span className="text-red-500">*</span>
            </Label>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex items-center gap-2 mt-2"
            >
              <Input
                ref={participantNameRef}
                name="participantName"
                type="text"
                placeholder="Name"
                value={participantName}
                onChange={handleChangeName}
                className={participants.length > 1 ? "" : "border-red-400"}
              />
              <ButtonAnimate
                name="intent"
                value="addParticipant"
                onClick={handleAddName}
              >
                Add
              </ButtonAnimate>
            </form>
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
                    title="Enter paid amounts"
                    type="payment"
                    participants={participants}
                    onChange={handleChangePaidAmounts}
                  />
                )}
              </div>
            </>
          )}

          <h3 className="mt-4 font-medium text-sm">
            Split <span className="text-red-500">*</span>
          </h3>
          <Tabs defaultValue="equally" className="w-full mt-2">
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
              {equalSettlements && (
                <Settlement settlements={equalSettlements} />
              )}
            </TabsContent>

            <TabsContent value="unequally">
              <form onSubmit={(e) => e.preventDefault()}>
                {participants.length ? (
                  <MultiplePeopleInput
                    title="Enter expense amounts"
                    type="expense"
                    participants={participants}
                    onChange={handleChangeExpenseAmounts}
                  />
                ) : (
                  <p className="text-sm text-red-500">
                    Enter participants first
                  </p>
                )}

                <ButtonAnimate
                  disabled={participants.length < 1}
                  onClick={handleCalculateUnequally}
                  className="bg-cyan-500 hover:bg-cyan-400 w-full mt-2"
                >
                  Calculate
                </ButtonAnimate>
              </form>
              {unequalSettlements && (
                <Settlement settlements={unequalSettlements} />
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </PageContainer>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  return {
    title: "Split Bill",
  };
}
