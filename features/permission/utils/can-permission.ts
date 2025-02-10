import { Session } from "next-auth"
import { getSession } from "@/utils/get-session"
export const canPermission = async (permissions: string[]) => {
  const session = await getSession()

  if (!session) return false
  return permissions.some((permission) => {
    return session.user.permissions.includes(permission)
  })
}

export const canPermissionSession = (permissions: string[], session: Session | null) => {
  if (!session) return false

  return permissions.some((permission) => {
    return session.user.permissions.includes(permission)
  })
}
