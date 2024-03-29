import type { Participant, Settlement } from "~/domain/model/split-bill";

/**
 * algorithm:
 * calculate balance of each person
 * separate people into creditors (minus balance) and debtors (plus balance)
 * for each person in creditors, find the person in debtors with the highest balance
 * transfer the amount from debtor to creditor
 */
export function splitBill(
  totalExpense: number,
  participants: Participant[]
): [Settlement[] | null, Error | null] {
  if (
    totalExpense !==
    Math.round(participants.reduce((acc, p) => acc + p.expense, 0))
  ) {
    return [null, new Error("Total expenses and payments do not match")];
  }

  const payments = Math.round(
    participants.reduce((acc, p) => acc + p.payment, 0)
  );

  if (totalExpense !== payments) {
    return [null, new Error("Total expenses and payments do not match")];
  }

  const participantsWithBalance = participants.map((p) => ({
    ...p,
    balance: p.expense - p.payment,
  }));

  const settlements: Settlement[] = [];
  const creditors = participantsWithBalance.filter((p) => p.balance < 0);
  const debtors = participantsWithBalance.filter((p) => p.balance > 0);

  for (const creditor of creditors) {
    let amount = Math.abs(creditor.balance);
    for (const debtor of debtors) {
      if (debtor.balance === 0) {
        continue;
      }

      const transferAmount = Math.min(amount, debtor.balance);
      if (transferAmount > 0) {
        settlements.push({
          payer: debtor.name,
          recipient: creditor.name,
          amount: Number.isInteger(transferAmount)
            ? transferAmount
            : Number(transferAmount.toFixed(2)),
        });
        amount -= transferAmount;
        debtor.balance -= transferAmount;
        creditor.balance += transferAmount;
      }
    }
  }

  return [settlements, null];
}
