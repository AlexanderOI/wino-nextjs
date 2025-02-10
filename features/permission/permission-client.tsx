"use client"

import { useSession } from "next-auth/react"

interface Props {
  children: React.ReactNode
  permissions?: string[]
}

export function PermissionClient({ children, permissions }: Props) {
  const { data: session } = useSession()

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
