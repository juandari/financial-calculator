import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

interface InputNameProps {
  onClick: () => void;
}

export default function InputName({ onClick }: InputNameProps) {
  return (
    <>
      <Input type="text" placeholder="Name" />
      <Button onClick={onClick} name="addName">
        Add
      </Button>
    </>
  );
}
