import { SyncRetry, SyncStatus } from "@/types/sync";
import { api } from "../api";

const ROUTE = "/sync";

const status = async () => {
  return await api
    .get<SyncStatus>(`${ROUTE}/status`)
    .then(({ data }) => data);
};

const retry = async (data: {
  eventId?: string
  all?: boolean
}) => {
  return await api
    .post<SyncRetry>(`${ROUTE}/retry`, { ...data })
    .then(({ data }) => data);
};

export const SyncRoutes = {
  status,
  retry
};
