"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"
import {
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarGroupAction,
  SidebarMenu,
} from "@/components/ui/sidebar"
import { SelectProjectDialog } from "@/features/project/components/dialog/select-project-dialog"
import { useProjectStore } from "@/features/project/store/project.store"
import { MenuItem } from "@/components/app-sidebar"
import { SidebarProjectMenuItem } from "@/components/sidebar/sidebar-project-menu-item"
import { iconMap } from "@/components/sidebar/icon-mapping"

interface SidebarProjectSectionProps {
  items: MenuItem[]
  userPermissions: string[]
}

export function SidebarProjectSection({
  items,
  userPermissions,
}: SidebarProjectSectionProps) {
  const project = useProjectStore((state) => state.project)
  const setProject = useProjectStore((state) => state.setProject)
  const FolderRootIcon = iconMap.FolderRoot
  const { data: session } = useSession()

  useEffect(() => {
    if (project && session && project.companyId !== session.user.companyId) {
      setProject(null)
    }
  }, [project, session, setProject])

  return (
    <>
      <SidebarGroupLabel>
        <span className="truncate w-10/12 block">
          Project: {project?.name || "Select project..."}
        </span>
      </SidebarGroupLabel>
      <SidebarGroupAction title="Select Project">
        <SelectProjectDialog>
          <FolderRootIcon width={16} />
        </SelectProjectDialog>
      </SidebarGroupAction>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarProjectMenuItem
              key={item.title}
              item={item}
              userPermissions={userPermissions}
              project={project}
            />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </>
  )
}
