export interface Participant {
  id: string;
  name: string;
  expense: number;
  payment: number;
}

export interface Settlement {
  payer: string;
  recipient: string;
  amount: number;
}
