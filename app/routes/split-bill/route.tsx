import { Form } from "@remix-run/react";
import PageContainer from "~/components/page-container";
import { Card, CardContent } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Label } from "~/components/ui/label";
import NumericInput from "~/components/numeric-input";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { json, type ActionFunctionArgs } from "@remix-run/node";
import { useSplitBillViewModel } from "./view-model";
import InputName from "./input-name";
import PaidBy from "./paid-by";
import { Checkbox } from "~/components/ui/checkbox";

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
              <div className="flex justify-content flex-col gap-4 mt-10">
                <PaidBy
                  value={paidBy}
                  onValueChange={handleChangePaidBy}
                  participants={participants}
                />
                {paidBy === "multiple" && participants.length > 1 ? (
                  <div className="flex flex-col gap-3">
                    {participants.map((p) => (
                      <div
                        key={p.id}
                        className="flex gap-2 items-center mt-1 px-1"
                      >
                        <Checkbox id={p.id} className="rounded-sm" />
                        <label
                          htmlFor={p.id}
                          className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {p.name}
                        </label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>{paidBy}</p>
                )}
              </div>
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
