import { PERMISSIONS } from "@/features/permission/constants/permissions"
import { canPermission } from "@/features/permission/utils/can-permission"
import { redirect } from "next/navigation"

export default async function RolesLayout({ children }: { children: React.ReactNode }) {
  const hasPermission = await canPermission([PERMISSIONS.VIEW_ROLE])
  console.log(hasPermission)

  if (!hasPermission) {
    redirect("/dashboard")
  }

  return children
}
