export type PaymentRegister = {
  participantCode: string;
  amountCents: number;
  saleId?: string;
};

export type PaymentRegisterResponse = {
  payment: {
    id: string;
    createdAt: Date;
    participantId: string;
    amountCents: number;
    method: string;
    note: string | null;
  };
  allocatedCents: number;
  creditCents: number;
};
