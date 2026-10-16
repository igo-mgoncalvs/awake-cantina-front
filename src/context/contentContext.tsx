import { api } from "@/services/api";
import { AuthRoutes } from "@/services/auth";
import { ParticipantRolesRoutes } from "@/services/participantRoles";
import { ParticipantsRoutes } from "@/services/participants";
import { ProductsRoutes } from "@/services/products";
import { SalesRoutes } from "@/services/sales";
import { SyncRoutes } from "@/services/sync";
import { Participant } from "@/types/participant";
import { Product } from "@/types/product";
import { Role } from "@/types/roles";
import { Sale } from "@/types/sale";
import { SyncStatus } from "@/types/sync";
import {
  createContext,
  ReactNode,
  useMemo,
  useState,
} from "react";

interface IDataContext {
  participants: Participant[]
  products: Product[]
  sales: Sale[]
  syncStatus: SyncStatus | null
  online: boolean
  participantRoles: Role[]
  userAuth: boolean
  setUserAuth: React.Dispatch<React.SetStateAction<boolean>>
  getParticipantRoles: () => void
  getParticipants: () => void
  getProducts: () => void
  getSales: () => void
  getSyncStatus: () => void
  refresh: () => void
  auth: (passoword: string) => Promise<boolean>
}

const defaultValue = {
  participants: [],
  products: [],
  sales: [],
  syncStatus: null,
  online: false,
  participantRoles: [],
  userAuth: false,
  setUserAuth: () => null,
  getParticipantRoles: () => null,
  getParticipants: () => null,
  getProducts: () => null,
  getSales: () => null,
  getSyncStatus: () => null,
  refresh: () => null,
  auth: async () => false
}

export const DataContext = createContext<IDataContext>(defaultValue);

interface IDataContextProviderProps {
  children: ReactNode;
}

export function DataContextProvider({
  children,
}: IDataContextProviderProps) {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
  const [online, setOnline] = useState(false);
  const [participantRoles, setParticipantRoles] = useState<Role[]>([]);
  const [userAuth, setUserAuth] = useState<boolean>(false)

  function getParticipants() {
    ParticipantsRoutes.getAll()
      .then((data) => {
        setParticipants(data)
      })
  }

  function getProducts() {
    ProductsRoutes.getAll()
      .then((data) => {
        setProducts(data)
      })
  }

  function getSales() {
    SalesRoutes.getAll()
      .then((data) => {
        setSales(data)
      })
  }

  function getSyncStatus() {
    SyncRoutes.status()
      .then((data) => {
        setSyncStatus(data)
        setOnline(true)
      })
      .catch(() => {
        setOnline(false)
      })
  }

  function getParticipantRoles() {
    ParticipantRolesRoutes.getAll()
      .then((data) => {
        setParticipantRoles(data)
      })
  }

  async function auth(password: string) {
    return await AuthRoutes.auth(password)
      .then(() => {
        setUserAuth(true)
        api.defaults.headers["x-admin-password"] = password
        return true
      })
      .catch(() => {
        setUserAuth(false)
        return false
      })
  }

  async function refresh() {
    Promise.all([
      getParticipants(),
      getProducts(),
      getSales(),
      getSyncStatus(),
      getParticipantRoles()
    ])
  }

  const value = useMemo<IDataContext>(
    () => ({
      participants,
      products,
      sales,
      syncStatus,
      online,
      participantRoles,
      userAuth,
      setUserAuth,
      getParticipantRoles,
      getParticipants,
      getProducts,
      getSales,
      getSyncStatus,
      refresh,
      auth
    }),
    [
      participants,
      products,
      sales,
      syncStatus,
      participantRoles,
      userAuth,
      setUserAuth,
      getParticipantRoles,
      getParticipants,
      getProducts,
      getSales,
      getSyncStatus,
      refresh,
      auth
    ],
  );

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}