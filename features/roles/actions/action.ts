"use server"

import { apiClientServer } from "@/utils/api-client-server"
import { Role } from "../interfaces/role.interface"

export const getRoles = async () => {
  const roles = await apiClientServer.get<Role[]>("/roles")
  return roles
}
