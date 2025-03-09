"use server"

import { apiClientServer } from "@/utils/api-client-server"
import { User } from "../interfaces/user.interface"
import { Role } from "@/features/roles/interfaces/role.interface"

export const getAllRoles = async () => {
  const response = await apiClientServer.get<Role[]>("/roles")
  return response.data
}

export const getPartialUserById = async (id?: string) => {
  if (!id) return null
  const response = await apiClientServer.get<User>(`/users/${id}`)
  const { name, roles, rolesId, userName, email, roleType, isInvited } = response.data
  return {
    name,
    roles,
    rolesId,
    userName,
    email,
    roleType,
    isInvited,
  }
}
