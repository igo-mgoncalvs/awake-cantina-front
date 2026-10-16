import { api } from "../api";

const ROUTE = "/admin";

const auth = async (password: string) => {
  return await api.get(ROUTE, {
    headers: {
      "x-admin-password": password,
    },
  });
};

export const AuthRoutes = {
  auth,
};
