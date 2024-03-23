import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import type { Participant } from "~/domain/model/split-bill";

interface PaidByProps {
  value: string;
  participants: Participant[];
  onValueChange?: (value: string) => void;
}

export default function PaidBy({
  value,
  onValueChange,
  participants,
}: PaidByProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={`w-full ${!value ? "border-red-400" : ""}`}
        >
          {value ? value : "Pick name"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64">
        <DropdownMenuRadioGroup value={value} onValueChange={onValueChange}>
          {participants.map((p) => (
            <DropdownMenuRadioItem key={p.id} value={p.name}>
              {p.name}
            </DropdownMenuRadioItem>
          ))}
          {participants.length > 1 && (
            <DropdownMenuRadioItem value="Multiple">
              Multiple people
            </DropdownMenuRadioItem>
          )}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
