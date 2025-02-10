"use server"
import { getSession } from "@/utils/get-session"

interface Props {
  children: React.ReactNode
  permissions?: string[]
  partialPermissions?: boolean
}

export async function PermissionServer({ children, permissions }: Props) {
  const session = await getSession()

  if (!session) return null

  if (permissions?.length) {
    const userPermissions = session.user.permissions

    const hasPermission = permissions.some((permission) =>
      userPermissions.includes(permission)
    )

    if (!hasPermission) return null
  }

  return <>{children}</>
}
