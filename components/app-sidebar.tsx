"use client"

import {
  Calendar,
  Home,
  Inbox,
  Search,
  Settings,
  Badge,
  BedSingle,
  Plus,
  PlusCircle,
  UserCog,
  Users,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { useSession } from "next-auth/react"

// Menu items.
const itemsProjects = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Projects",
    url: "/projects",
    icon: Badge,
  },
  {
    title: "Tasks",
    url: "/tasks",
    icon: BedSingle,
  },
  {
    title: "Manage Projects",
    url: "/manage-projects",
    icon: Settings,
  },
]

const itemsRoles = [
  {
    title: "Roles",
    url: "/roles",
    icon: UserCog,
  },
  {
    title: "Users",
    url: "/users",
    icon: Users,
  },
]

export function AppSidebar() {
  const { open } = useSidebar()
  const { data: session } = useSession()

  if (!session) return null

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarHeader>
          <div
            className={`flex justify-center items-center border-b-2 h-14
            ${open ? "text-4xl" : " text-sm"}`}
          >
            <span className=" text-sky-700">{"<"}</span>
            WINO
            <span className=" text-sky-700">{"/>"}</span>
          </div>
        </SidebarHeader>

        <SidebarGroup>
          <SidebarGroupLabel>Workspace: Personal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {itemsProjects.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>User Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {itemsRoles.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
