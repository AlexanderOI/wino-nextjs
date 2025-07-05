"use client"

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
  userPermissions 
}: SidebarProjectSectionProps) {
  const project = useProjectStore((state) => state.project)
  const FolderRootIcon = iconMap.FolderRoot
  
  return (
    <>
      <SidebarGroupLabel>
        <span className="truncate w-10/12 block">
          Project: {project?.name || 'Select project...'}
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