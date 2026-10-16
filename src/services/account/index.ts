import { api } from "../api";

const ROUTE = "/account";

const getAccount = async ({ code }: { code: string }) => {
  return await api
    .get(`${ROUTE}/${encodeURIComponent(code.trim())}`)
    .then(({ data }) => data);
};

export const AccountService = {
  getAccount,
};
