import { api } from "../api";
import { Participant } from "@/types/participant";

const ROUTE = "/participants";

const getAll = async () => {
  return await api
    .get<Participant[]>(ROUTE)
    .then(({ data }) => data);
};

const create = async (data: {
  name: string
  code: string
  role: string,
  limitCents: number | null
}) => {
  return await api
    .post<Participant>(`/admin${ROUTE}`, data)
    .then(({ data }) => data);
};

const update = async (code: string, data: {
  name: string
  code: string
  role: string,
  limitCents: number | null
}) => {
  return await api
    .put<Participant>('/admin' + ROUTE + '/' + code, data)
    .then(({ data }) => data);
};

export const ParticipantsRoutes = {
  getAll,
  create,
  update
};
