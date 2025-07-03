"use client"
import { useSession } from "next-auth/react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { useEffect, useMemo } from "react"
import {
  Home,
  BookMarked,
  Settings,
  UserCog,
  Users,
  Building,
  FolderKanban,
  FolderOpenDot,
  FolderRoot,
  FolderCheck,
  LucideIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"

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

import { PERMISSIONS } from "@/features/permission/constants/permissions"
import { SelectProjectDialog } from "@/features/project/components/dialog/select-project-dialog"
import { useProjectStore } from "@/features/project/store/project.store"

interface MenuItem {
  title: string
  url: string
  icon: LucideIcon
  permissions?: string[]
}

interface SidebarSection {
  label: string
  items: MenuItem[]
  action?: React.ReactNode
}

export function AppSidebar() {
  const { open } = useSidebar()
  const { data: session, status } = useSession()
  const project = useProjectStore((state) => state.project)
  const setProject = useProjectStore((state) => state.setProject)
  const pathname = usePathname()

  const userPermissions = useMemo(() => {
    return session?.user?.permissions || []
  }, [session?.user?.permissions])

  const hasPermission = useMemo(() => {
    return (permissions?: string[]) => {
      if (status === "loading" || !session || !permissions?.length) return true
      return permissions.some((permission) => userPermissions.includes(permission))
    }
  }, [status, session, userPermissions])

  const sidebarSections: SidebarSection[] = useMemo(() => [
    {
      label: `Workspace: ${session?.user?.companyName || 'Loading...'}`,
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: Home,
          permissions: [PERMISSIONS.VIEW_DASHBOARD],
        },
        {
          title: "Manage Projects",
          url: "/manage-projects",
          icon: Settings,
          permissions: [PERMISSIONS.MANAGE_PROJECT],
        },
      ]
    },
    {
      label: `Project: ${project?.name || 'Select project...'}`,
      action: (
        <SelectProjectDialog>
          <FolderRoot width={16} />
        </SelectProjectDialog>
      ),
      items: [
        {
          title: "Project",
          url: "/project/[projectId]",
          icon: FolderOpenDot,
          permissions: [PERMISSIONS.VIEW_PROJECT],
        },
        {
          title: "Task Board",
          url: "/tasks/[projectId]",
          icon: FolderKanban,
          permissions: [PERMISSIONS.VIEW_TASK],
        },
        {
          title: "Task List",
          url: "/tasks/[projectId]/list",
          icon: FolderCheck,
          permissions: [PERMISSIONS.VIEW_TASK],
        },
      ]
    },
    {
      label: "Forms",
      items: [
        {
          title: "Forms",
          url: "/forms",
          icon: BookMarked,
        },
      ]
    },
    {
      label: "Company Management",
      items: [
        {
          title: "Company",
          url: "/company",
          icon: Building,
          permissions: [PERMISSIONS.VIEW_COMPANY],
        },
      ]
    },
    {
      label: "User Management",
      items: [
        {
          title: "Roles",
          url: "/roles",
          icon: UserCog,
          permissions: [PERMISSIONS.VIEW_ROLE],
        },
        {
          title: "Users",
          url: "/users",
          icon: Users,
          permissions: [PERMISSIONS.VIEW_USER],
        },
      ]
    }
  ], [session?.user?.companyName, project?.name, status])

  useEffect(() => {
    if (project && session && project.companyId !== session?.user.companyId) {
      setProject(null)
    }
  }, [project, session, setProject])

  const renderMenuItem = (item: MenuItem, isProjectItem = false) => {
    if (!hasPermission(item.permissions)) return null

    const isActive = pathname === item.url || pathname.includes(item.url + "/")
    const itemUrl = isProjectItem && project?._id 
      ? item.url.replace("[projectId]", project._id)
      : item.url

    return (
      <SidebarMenuItem key={item.title}>
        <SidebarMenuButton
          className={cn(
            isProjectItem && !project ? "hover:bg-slate-600" : "",
            isActive ? "bg-purple-deep" : ""
          )}
          disabled={isProjectItem && !project?._id}
          asChild
        >
          {isProjectItem && project?._id ? (
            <Link href={itemUrl}>
              <item.icon />
              <span>{item.title}</span>
            </Link>
          ) : isProjectItem ? (
            <div className="flex items-center gap-2">
              <item.icon strokeWidth={1.5} className="text-gray-500" />
              <span className="text-gray-500">{item.title}</span>
            </div>
          ) : (
            <Link href={itemUrl}>
              <item.icon />
              <span>{item.title}</span>
            </Link>
          )}
        </SidebarMenuButton>
      </SidebarMenuItem>
    )
  }

  const SidebarSkeleton = () => (
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

        {[1, 2, 3, 4, 5].map((_, index) => (
          <SidebarGroup key={index}>
            <SidebarGroupLabel>
              <div className="h-4 bg-gray-700 rounded animate-pulse w-24" />
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {[1, 2].map((_, itemIndex) => (
                  <SidebarMenuItem key={itemIndex}>
                    <div className="flex items-center gap-2 p-2">
                      <div className="h-4 w-4 bg-gray-700 rounded animate-pulse" />
                      <div className="h-4 bg-gray-700 rounded animate-pulse flex-1" />
                    </div>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  )

  if (status === "loading") {
    return <SidebarSkeleton />
  }

  if (status === "unauthenticated") {
    return null
  }

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

        {sidebarSections.map((section, index) => (
          <SidebarGroup key={section.label}>
            <SidebarGroupLabel>
              <span className={index === 1 ? "truncate w-10/12 block" : ""}>
                {section.label}
              </span>
            </SidebarGroupLabel>
            {section.action && (
              <SidebarGroupAction title="Select Project">
                {section.action}
              </SidebarGroupAction>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => 
                  renderMenuItem(item, index === 1)
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  )
}
