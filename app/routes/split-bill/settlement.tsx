import { Separator } from "~/components/ui/separator";
import { formatCurrency } from "~/lib/numbers/format-currency";
import type { Settlement } from "~/domain/model/split-bill";

interface SettlementProps {
  settlements: Settlement[];
}

export default function Settlement({ settlements }: SettlementProps) {
  return (
    <div className="mt-3">
      <h2 className="font-bold mb-4">Who pays whom and how much:</h2>
      {settlements.map((s, idx) => (
        <div key={idx}>
          <div className="flex justify-center gap-4 mt-2">
            <p className="w-[25%] ellipsis">{s.payer}</p>
            <div className="flex items-center w-[50%]">
              <span className="bg-teal-500 text-white px-2">
                {formatCurrency(s.amount)}
              </span>
              <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[14px] border-l-teal-500 border-b-[12px] border-b-transparent"></div>
            </div>
            <p className="w-[25%] ellipsis">{s.recipient}</p>
          </div>
          <Separator className="mt-2" />
        </div>
      ))}
    </div>
  );
}
