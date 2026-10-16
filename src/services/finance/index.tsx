import { api } from "../api";
import { Finance } from "@/types/finance";

const ROUTE = "/finance";

const getAll = async () => {
  return await api.get<Finance[]>("/admin" + ROUTE).then(({ data }) => data);
};

export const FinanceRoutes = {
  getAll,
};
