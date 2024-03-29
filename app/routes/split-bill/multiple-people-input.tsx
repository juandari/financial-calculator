import NumericInput from "~/components/numeric-input";
import { removeRpPrefix } from "~/lib/string/remove-rp-prefix";
import type { Participant } from "~/domain/model/split-bill";

interface MultiplePeopleInputProps {
  participants: Participant[];
  onChangePaidAmounts: (participants: Participant[]) => void;
}

const title = "Enter paid amounts";

export default function MultiplePeopleInput({
  participants,
  onChangePaidAmounts,
}: MultiplePeopleInputProps) {
  function handleChangeAmount(id: string, value: string) {
    const newParticipants = participants.map((p) =>
      p.id === id ? { ...p, payment: Number(removeRpPrefix(value)) } : p
    );
    onChangePaidAmounts(newParticipants);
  }

  return (
    <div className="border-2 border-gray-400 rounded-lg px-3 py-4">
      <h3 className="font-semibold text-md">{title}:</h3>

      <div className="flex flex-col gap-3 mt-1">
        {participants.map((p) => (
          <CustomInput
            key={p.id}
            name={p.name}
            value={p.payment || 0}
            onChange={(value) => handleChangeAmount(p.id, value)}
          />
        ))}
      </div>
    </div>
  );
}

interface CustomInputProps {
  name: string;
  value: number;
  onChange: (value: string) => void;
}

function CustomInput({ name, value, onChange }: CustomInputProps) {
  return (
    <div className="flex gap-2 items-center mt-1 px-2">
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
