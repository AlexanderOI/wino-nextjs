import { PERMISSIONS } from "@/features/permission/constants/permissions"
import { canPermission } from "@/features/permission/utils/can-permission"
import { redirect } from "next/navigation"

export default async function UsersLayout({ children }: { children: React.ReactNode }) {
  const hasPermission = await canPermission([PERMISSIONS.VIEW_USER])

  if (!hasPermission) {
    redirect("/dashboard")
  }

  return children
}
