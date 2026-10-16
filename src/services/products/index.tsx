import { CreateProduct, Product } from "@/types/product";
import { api } from "../api";

const ROUTE = "/products";

const getAll = async () => {
  return await api
    .get<Product[]>(ROUTE)
    .then(({ data }) => data);
};

const create = async (data: {
  name: string
  barcode: string
  priceCents: number
  imageUrl?: string | null
}) => {
  return await api
    .post<Product>("/admin" + ROUTE, {
      ...data,
      category: 'Geral'
    })
    .then(({ data }) => data);
};

const inative = async (id: string) => {
  return await api
    .delete(`admin${ROUTE}/${id}`)
    .then(({ data }) => data);
};

const update = async (id: string, data: CreateProduct) => {
  return await api
    .put(`admin${ROUTE}/${id}`, { ...data, active: true })
    .then(({ data }) => data);
};

export const ProductsRoutes = {
  getAll,
  create,
  inative,
  update
};
