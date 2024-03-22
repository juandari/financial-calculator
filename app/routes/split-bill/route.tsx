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
    handleChangePaidBy,
    handleAddName,
    handleChangeName,
    handleEditName,
    handleDeleteName,
    handleChangePaidAmounts,
  } = useSplitBillViewModel();

  return (
    <PageContainer title="Split Bill">
      <Card className="mt-10">
        <Form method="post">
          <CardContent className="pt-4">
            <div>
              <Label htmlFor="billAmount">Bill Amount (IDR)</Label>
              <NumericInput
                id="billAmount"
                name="billAmount"
                placeholder="Amount"
              />
            </div>

            <div className="mt-4">
              <Label htmlFor="participantName">Participants</Label>
              <div className="flex items-center gap-2 mt-2">
                <Input
                  ref={participantNameRef}
                  name="participantName"
                  type="text"
                  placeholder="Name"
                  value={participantName}
                  onChange={handleChangeName}
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
                <Label className="mt-1">Paid by</Label>
                <div className="flex justify-content flex-col gap-2 mt-2">
                  <PaidBy
                    value={paidBy}
                    onValueChange={handleChangePaidBy}
                    participants={participants}
                  />
                  {paidBy === "Multiple" && participants.length > 1 ? (
                    <MultiplePeopleInput
                      participants={participants}
                      onSubmit={handleChangePaidAmounts}
                    />
                  ) : null}
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
                Make changes to your account here.
              </TabsContent>
              <TabsContent value="unequally">
                Change your password here.
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
