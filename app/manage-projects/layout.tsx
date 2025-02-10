import { PERMISSIONS } from "@/features/permission/constants/permissions"
import { canPermission } from "@/features/permission/utils/can-permission"
import { redirect } from "next/navigation"

export default async function ManageProjectsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const hasPermission = await canPermission([PERMISSIONS.VIEW_PROJECT])

  if (!hasPermission) {
    redirect("/dashboard")
  }

  return children
}
