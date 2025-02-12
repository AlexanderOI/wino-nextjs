"use client"

import {
  Home,
  Settings,
  UserCog,
  Users,
  Building,
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
import { usePathname } from "next/navigation"
import { SelectProjectDialog } from "@/features/project/components/select-project-dialog"
import { useProjectStore } from "@/features/project/store/project.store"
import { cn } from "@/lib/utils"
import { useEffect } from "react"

const itemsWorkspace = [
  {
    title: "Dashboard",
    url: "/dashboard",
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
    title: "Project",
    url: "/project",
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
  const project = useProjectStore((state) => state.project)
  const setProject = useProjectStore((state) => state.setProject)

  const pathname = usePathname()

  useEffect(() => {
    if (project && session && project.companyId !== session?.user.companyId) {
      setProject(null)
    }
  }, [project, session])

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarHeader>
          <div
            className={cn(
              "flex justify-center items-center border-b-2 h-14",
              open ? "text-4xl" : " text-[0.6rem]"
            )}
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
                      className={
                        pathname === item.url || pathname.includes(item.url + "/")
                          ? "bg-purple-deep"
                          : ""
                      }
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
          <SidebarGroupLabel className="truncate w-10/12">
            Project: {project?.name}
          </SidebarGroupLabel>
          <SidebarGroupAction title="Select Project">
            <SelectProjectDialog>
              <FolderRoot width={16} />
            </SelectProjectDialog>
          </SidebarGroupAction>

          <SidebarGroupContent>
            <SidebarMenu>
              {itemsProjects.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    className={cn(project ? "" : "hover:bg-slate-600")}
                    disabled={!project?._id}
                    asChild
                  >
                    {project?._id ? (
                      <Link
                        href={`${item.url}/${project?._id}`}
                        className={
                          pathname === item.url || pathname.includes(item.url + "/")
                            ? "bg-purple-deep"
                            : ""
                        }
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    ) : (
                      <span className="text-gray-500">{item.title}</span>
                    )}
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
