import NumericInput from "~/components/numeric-input";
import type { Participant } from "~/domain/model/split-bill";

interface MultiplePeopleInputProps {
  title: string;
  type: "payment" | "expense";
  participants: Participant[];
  onChange: (id: string, value: string) => void;
}

export default function MultiplePeopleInput({
  title,
  type,
  participants,
  onChange,
}: MultiplePeopleInputProps) {
  function handleChangeAmount(id: string, value: string) {
    onChange(id, value);
  }

  return (
    <div className="border-2 border-gray-400 rounded-lg px-3 py-4">
      <h3 className="font-semibold text-md">{title}:</h3>

      <div className="flex flex-col gap-3 mt-1">
        {participants.map((p) => (
          <CustomInput
            key={p.id}
            name={p.name}
            value={type === "payment" ? p.payment : p.expense}
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
