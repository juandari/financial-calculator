import type { NumericFormatProps } from "react-number-format";
import { NumericFormat } from "react-number-format";
import { Input } from "./ui/input";

interface NumericInputProps extends NumericFormatProps {}

export default function NumericInput({ ...props }: NumericInputProps) {
  return (
    <NumericFormat
      allowNegative={false}
      customInput={Input}
      thousandSeparator="."
      decimalSeparator=","
      className="mt-2"
      prefix="Rp"
      {...props}
    />
  );
}
