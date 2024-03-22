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
import type { Participant } from "./types";

interface MultiplePeopleInputProps {
  participants: Participant[];
  onSubmit: (id: string, payment: string) => void;
}

const title = "Enter paid amounts";

export default function MultiplePeopleInput({
  participants,
  onSubmit,
}: MultiplePeopleInputProps) {
  function handleChangeAmount(id: string, value: string) {
    onSubmit(id, value);
  }

  return (
    <Drawer>
      <DrawerTrigger>
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
          <DrawerClose>
            <Button className="w-full">Cancel</Button>
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
      <p className="text-md w-[30%] overflow-hidden text-ellipsis whitespace-nowrap font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
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
