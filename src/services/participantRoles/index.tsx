import { CreateParticipantRole, Role } from "@/types/roles"
import { api } from "../api"

const ROUTE = '/roles'

const getAll = async () => {
  return api.get<Role[]>(ROUTE).then(({ data }) => data)
}

const create = async (body: CreateParticipantRole) => {
  return api.post<Role>('/admin' + ROUTE, body).then(({ data }) => data)
}

const update = async (id: string, body: CreateParticipantRole) => {
  return api.put<Role>('/admin' + ROUTE + '/' + id, body).then(({ data }) => data)
}

export const ParticipantRolesRoutes = {
  getAll,
  create,
  update
}