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
  Building,
  LucideBoxSelect,
  FolderKanban,
  FolderOpenDot,
  FolderRoot,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupAction,
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
import { usePathname, useRouter } from "next/navigation"

const itemsWorkspace = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Manage Projects",
    url: "/manage-projects",
    icon: Settings,
  },
]

const itemsCompany = [
  {
    title: "Company",
    url: "/company",
    icon: Building,
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

const itemsProjects = [
  {
    title: "Projects",
    url: "/projects",
    icon: FolderOpenDot,
  },
  {
    title: "Tasks",
    url: "/tasks",
    icon: FolderKanban,
  },
]

export function AppSidebar() {
  const { open } = useSidebar()
  const { data: session } = useSession()

  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarHeader>
          <div
            className={`flex justify-center items-center border-b-2 h-14
            ${open ? "text-4xl" : " text-sm"}`}
          >
            <span className=" text-purple-light">{"<"}</span>
            WINO
            <span className=" text-purple-light">{"/>"}</span>
          </div>
        </SidebarHeader>

        <SidebarGroup>
          <SidebarGroupLabel>Workspace: {session?.user.companyName}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {itemsWorkspace.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                      className={pathname === item.url ? "bg-purple-deep" : ""}
                    >
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
          <SidebarGroupLabel>Projects</SidebarGroupLabel>
          <SidebarGroupAction title="Select Project">
            <FolderRoot /> <span className="sr-only">Select Project</span>
          </SidebarGroupAction>

          <SidebarGroupContent>
            <SidebarMenu>
              {itemsProjects.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                      className={pathname === item.url ? "bg-purple-deep" : ""}
                    >
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
          <SidebarGroupLabel>Company Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {itemsCompany.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                      className={pathname === item.url ? "bg-purple-deep" : ""}
                    >
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
                    <Link
                      href={item.url}
                      className={pathname === item.url ? "bg-purple-deep" : ""}
                    >
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
