import { CartItem } from "@/types/product";
import { api } from "../api";
import { Sale } from "@/types/sale";

const ROUTE = "/sales";

const create = async ({
  participantCode,
  cart,
}: {
  participantCode: string;
  cart: CartItem[];
}) => {
  return await api
    .post<Sale>(ROUTE, {
      participantCode,
      items: cart.map((x) => ({ productId: x.id, quantity: x.quantity })),
    })
    .then(({ data }) => data);
};

const getAll = async () => {
  return await api.get<Sale[]>(ROUTE).then(({ data }) => data);
};

export const SalesRoutes = {
  create,
  getAll,
};
