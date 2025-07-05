import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader,
  SidebarGroup,
} from "@/components/ui/sidebar"

import { SidebarLogo } from "./sidebar/sidebar-logo"
import { SidebarProjectSection } from "@/components/sidebar/sidebar-project-section"
import { SidebarSimpleSection } from "@/components/sidebar/sidebar-simple-section"
import { IconName } from "@/components/sidebar/icon-mapping"
import { PERMISSIONS } from "@/features/permission/constants/permissions"
import { getSession } from "@/utils/get-session"

interface MenuItem {
  title: string
  url: string
  icon: IconName
  permissions?: string[]
}

interface SidebarSection {
  label: string
  items: MenuItem[]
  action?: React.ReactNode
}

const workspaceItems: MenuItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: "Home",
    permissions: [PERMISSIONS.VIEW_DASHBOARD],
  },
  {
    title: "Manage Projects",
    url: "/manage-projects",
    icon: "Settings",
    permissions: [PERMISSIONS.MANAGE_PROJECT],
  },
]

const projectItems: MenuItem[] = [
  {
    title: "Project",
    url: "/project/[projectId]",
    icon: "FolderOpenDot",
    permissions: [PERMISSIONS.VIEW_PROJECT],
  },
  {
    title: "Task Board",
    url: "/tasks/[projectId]",
    icon: "FolderKanban",
    permissions: [PERMISSIONS.VIEW_TASK],
  },
  {
    title: "Task List",
    url: "/tasks/[projectId]/list",
    icon: "FolderCheck",
    permissions: [PERMISSIONS.VIEW_TASK],
  },
]

const formItems: MenuItem[] = [
  {
    title: "Forms",
    url: "/forms",
    icon: "BookMarked",
  },
]

const companyItems: MenuItem[] = [
  {
    title: "Company",
    url: "/company",
    icon: "Building",
    permissions: [PERMISSIONS.VIEW_COMPANY],
  },
]

const userItems: MenuItem[] = [
  {
    title: "Roles",
    url: "/roles",
    icon: "UserCog",
    permissions: [PERMISSIONS.VIEW_ROLE],
  },
  {
    title: "Users",
    url: "/users",
    icon: "Users",
    permissions: [PERMISSIONS.VIEW_USER],
  },
]

export async function AppSidebar() {
  const session = await getSession()
  
  if (!session) {
    return null
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarHeader>
          <SidebarLogo />
        </SidebarHeader>

        <SidebarGroup>
          <SidebarSimpleSection
            label={`Workspace: ${session.user.companyName}`}
            items={workspaceItems} 
            userPermissions={session.user.permissions}
          />
        </SidebarGroup>

        <SidebarGroup>
          <SidebarProjectSection 
            items={projectItems}
            userPermissions={session.user.permissions}
          />
        </SidebarGroup>

        <SidebarGroup>
          <SidebarSimpleSection
            label="Forms"
            items={formItems}
            userPermissions={session.user.permissions}
          />
        </SidebarGroup>

        <SidebarGroup>
          <SidebarSimpleSection
            label="Company Management"
            items={companyItems}
            userPermissions={session.user.permissions}
          />
        </SidebarGroup>

        <SidebarGroup>
          <SidebarSimpleSection
            label="User Management"
            items={userItems}
            userPermissions={session.user.permissions}
          />
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

export type { MenuItem, SidebarSection }
