import { Allocation } from "./allocation";

export interface Payment {
  allocations: Allocation[];
  method: string;
  id: string;
  createdAt: Date;
  participantId: string;
  amountCents: number;
  note: string | null;
}
