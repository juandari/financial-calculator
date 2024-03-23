import NumericInput from "~/components/numeric-input";
import { Button } from "~/components/ui/button";
import {
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
  Drawer,
} from "~/components/ui/drawer";
import { useState } from "react";
import { removeRpPrefix } from "~/lib/string/remove-rp-prefix";
import type { Participant } from "~/domain/model/split-bill";

interface MultiplePeopleInputProps {
  participants: Participant[];
  onSubmit: (participants: Participant[]) => void;
}

const title = "Enter paid amounts";

export default function MultiplePeopleInput({
  participants,
  onSubmit,
}: MultiplePeopleInputProps) {
  const [tempParticipants, setTempParticipants] = useState(participants);
  const [isOpen, setIsOpen] = useState(false);

  function handleChangeAmount(id: string, value: string) {
    setTempParticipants((prevParticipants) =>
      prevParticipants.map((p) =>
        p.id === id ? { ...p, payment: Number(removeRpPrefix(value)) } : p
      )
    );
  }

  function handleSubmit() {
    onSubmit(tempParticipants);
    setIsOpen(false);
  }

  function handleOpenChange(open: boolean) {
    setIsOpen(open);
  }

  return (
    <Drawer open={isOpen} onOpenChange={handleOpenChange}>
      <DrawerTrigger asChild>
        <Button className="w-full">{title}</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
        </DrawerHeader>

        <div className="flex flex-col gap-3">
          {participants.map((p) => (
            <CustomInput
              key={p.id}
              name={p.name}
              value={p.payment || 0}
              onChange={(value) => handleChangeAmount(p.id, value)}
            />
          ))}
        </div>

        <DrawerFooter>
          <Button onClick={handleSubmit}>Submit</Button>
          <DrawerClose asChild>
            <Button variant="outline" className="w-full">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

interface CustomInputProps {
  name: string;
  value: number;
  onChange: (value: string) => void;
}

function CustomInput({ name, value, onChange }: CustomInputProps) {
  return (
    <div className="flex gap-2 items-center mt-1 px-5">
      <p className="text-md w-[30%] ellipsis font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {name}
      </p>
      <NumericInput
        className="w-[70%]"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
