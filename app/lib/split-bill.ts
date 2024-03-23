import type { Participant, Settlement } from "~/domain/model/split-bill";

export function splitBill(
  totalExpense: number,
  participants: Participant[]
): [Settlement[] | null, Error | null] {
  const settlements: Settlement[] = [];

  const payments = participants.map((payer) => payer.payment || 0);

  // Calculate balances
  const balances = participants.map(
    (payer) => Number(payer.payment) - Number(payer.expense)
  );
  const totalPayments = payments.reduce((sum, pay) => sum + pay, 0);

  if (totalExpense !== totalPayments) {
    return [null, new Error("Total expenses and payments do not match")];
  }

  // Separate creditors and debtors
  const creditors: typeof participants = [];
  const debtors: typeof participants = [];

  balances.forEach((balance, index) => {
    if (balance > 0) {
      creditors.push(participants[index]);
    } else {
      debtors.push(participants[index]);
    }
  });

  // Settle balances
  debtors.forEach((debtor) => {
    const debtorBalance = debtor.expense - debtor.payment;
    creditors.sort((a, b) => b.payment - b.expense - (a.payment - a.expense));
    for (const creditor of creditors) {
      const creditorBalance = creditor.payment - creditor.expense;
      const settlementAmount = Math.min(debtorBalance, creditorBalance);
      if (settlementAmount > 0) {
        settlements.push({
          payer: debtor.name,
          recipient: creditor.name,
          amount: settlementAmount,
        });
        debtor.payment += settlementAmount;
        creditor.payment -= settlementAmount;
        break;
      }
    }
  });

  return [settlements, null];
}
