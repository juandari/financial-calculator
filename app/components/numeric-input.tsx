import type { NumericFormatProps } from "react-number-format";
import { NumericFormat } from "react-number-format";
import { Input } from "./ui/input";
import { cx } from "class-variance-authority";

interface NumericInputProps extends NumericFormatProps {}

export default function NumericInput({ ...props }: NumericInputProps) {
  return (
    <NumericFormat
      allowNegative={false}
      customInput={Input}
      thousandSeparator="."
      decimalSeparator=","
      className={cx("mt-2 text-base", props.className)}
      prefix="Rp"
      {...props}
    />
  );
}
