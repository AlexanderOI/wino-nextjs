"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  SidebarMenuButton,
  SidebarMenuItem as SidebarMenuItemUI,
} from "@/components/ui/sidebar"
import { MenuItem } from "@/components/app-sidebar"
import { iconMap } from "@/components/sidebar/icon-mapping"

interface SidebarProjectMenuItemProps {
  item: MenuItem
  userPermissions: string[]
  project: any
  projectId: string | null
}

export function SidebarProjectMenuItem({
  item,
  userPermissions,
  project,
  projectId,
}: SidebarProjectMenuItemProps) {
  const pathname = usePathname()

  const hasPermission = (permissions?: string[]) => {
    if (!permissions?.length) return true
    return permissions.some((permission) => userPermissions.includes(permission))
  }

  if (!hasPermission(item.permissions)) {
    return null
  }

  const isActive = pathname === item.url || pathname.includes(item.url + "/")
  const itemUrl = projectId ? item.url.replace("[projectId]", projectId) : item.url

  const IconComponent = iconMap[item.icon]

  return (
    <SidebarMenuItemUI>
      <SidebarMenuButton
        className={cn(
          !projectId ? "hover:bg-slate-600" : "",
          isActive ? "bg-purple-deep" : ""
        )}
        disabled={!projectId}
        asChild
      >
        {projectId ? (
          <Link href={itemUrl}>
            <IconComponent />
            <span>{item.title}</span>
          </Link>
        ) : (
          <div className="flex items-center gap-2">
            <IconComponent strokeWidth={1.5} className="text-gray-500" />
            <span className="text-gray-500">{item.title}</span>
          </div>
        )}
      </SidebarMenuButton>
    </SidebarMenuItemUI>
  )
}
