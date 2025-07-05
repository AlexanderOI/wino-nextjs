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

interface SidebarMenuItemProps {
  item: MenuItem
  userPermissions: string[]
}

export function SidebarMenuItem({ item, userPermissions }: SidebarMenuItemProps) {
  const pathname = usePathname()
  
  const hasPermission = (permissions?: string[]) => {
    if (!permissions?.length) return true
    return permissions.some((permission) => userPermissions.includes(permission))
  }

  if (!hasPermission(item.permissions)) {
    return null
  }

  const isActive = pathname === item.url || pathname.includes(item.url + "/")
  const IconComponent = iconMap[item.icon]

  return (
    <SidebarMenuItemUI>
      <SidebarMenuButton
        className={cn(isActive ? "bg-purple-deep" : "")}
        asChild
      >
        <Link href={item.url}>
          <IconComponent />
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItemUI>
  )
} 