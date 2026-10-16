import { Payment } from "./payments";
import { Sale } from "./sale";

export type Finance = {
  sales: Sale[];
  payments: Payment[];
  metrics: {
    salesCents: number;
    receivedCents: number;
    debtCents: number;
    creditCents: number;
    salesCount: number;
  };
};
