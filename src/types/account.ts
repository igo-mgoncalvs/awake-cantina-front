import { Payment } from "./payments";
import { Sale } from "./sale";

export interface Account {
  id: string;
  code: string;
  name: string;
  role: string;
  debtCents: number;
  defaultCreditCents: number;
  creditCents: number;
  sales: Sale[];
  payments: Payment;
}
