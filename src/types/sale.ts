import { Allocation } from "./allocation";
import { Participant } from "./participant";

export type Sale = {
  id: string;
  totalCents: number;
  createdAt: string;
  status: string;
  participant: Participant;
  items: { productName: string; quantity: number; lineTotalCents: number }[];
  debtCents?: number;
  creditCents?: number;
  allocations: Allocation[];
};
