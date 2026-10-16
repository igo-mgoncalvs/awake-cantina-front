import { PaymentRegister, PaymentRegisterResponse } from "@/types/payment";
import { api } from "../api";

const ROUTE = "/payments";

const register = async (body: PaymentRegister) => {
  return await api.post<PaymentRegisterResponse>("/admin" + ROUTE, body).then(({ data }) => data);
};

export const PaymentRoutes = {
  register,
};
