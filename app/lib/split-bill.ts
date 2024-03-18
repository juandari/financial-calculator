interface Settlement {
  payer: string;
  recipient: string;
  amount: number;
}

interface Payer {
  name: string;
  expense: number;
  payment: number;
}

export function splitBill(
  totalExpense: number,
  expenses: number[],
  payments: number[]
): Settlement[] {
  const settlements: Settlement[] = [];

  // Initialize payers with expenses and payments
  const payers: Payer[] = expenses.map((expense, index) => ({
    name: `Person ${index + 1}`,
    expense,
    payment: payments[index],
  }));

  // Calculate balances
  const balances = payers.map((payer) => payer.payment - payer.expense);
  const totalBalance = balances.reduce((sum, balance) => sum + balance, 0);
  const totalPayments = payments.reduce((sum, pay) => sum + pay, 0);

  if (totalExpense !== totalPayments) {
    throw new Error('Total expenses and payments do not match');
  }

  // Ensure total balance is zero
  if (totalBalance !== 0) {
    throw new Error('Total expenses and payments do not match');
  }

  // Separate creditors and debtors
  const creditors: typeof payers = [];
  const debtors: typeof payers = [];

  balances.forEach((balance, index) => {
    if (balance > 0) {
      creditors.push(payers[index]);
    } else {
      debtors.push(payers[index]);
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

  return settlements;
}
