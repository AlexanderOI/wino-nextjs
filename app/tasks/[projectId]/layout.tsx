import { redirect } from "next/navigation"
import { PERMISSIONS } from "@/features/permission/constants/permissions"
import { canPermission } from "@/features/permission/utils/can-permission"

export default async function TasksLayout({ children }: { children: React.ReactNode }) {
  const hasPermission = await canPermission([PERMISSIONS.VIEW_TASK])

  if (!hasPermission) {
    redirect("/dashboard")
  }

  return children
}
