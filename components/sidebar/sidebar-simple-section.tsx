"use client"

import { 
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
} from "@/components/ui/sidebar"
import { MenuItem } from "@/components/app-sidebar"
import { SidebarMenuItem } from "@/components/sidebar/sidebar-menu-item"

interface Props {
  label: string
  items: MenuItem[]
  userPermissions: string[]
}

export function SidebarSimpleSection({ 
  label,
  items, 
  userPermissions 
}: Props) {
  return (
    <>
      <SidebarGroupLabel>
        {label}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem
              key={item.title}
              item={item}
              userPermissions={userPermissions}
            />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </>
  )
} 