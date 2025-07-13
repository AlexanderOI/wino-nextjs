"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { MenuItem } from "@/components/app-sidebar"

import { SidebarProjectMenuItem } from "@/components/sidebar/sidebar-project-menu-item"
import { useProject } from "@/features/project/hooks/use-project"
import { Project } from "@/features/project/interfaces/project.interface"

interface SidebarProjectSectionProps {
  items: MenuItem[]
  userPermissions: string[]
}

export function SidebarProjectSection({
  items,
  userPermissions,
}: SidebarProjectSectionProps) {
  const { data: session } = useSession()
  const pathname = usePathname()
  const router = useRouter()
  const { projects } = useProject()
  const [internalProject, setInternalProject] = useState<Project | null>(null)

  useEffect(() => {
    const project = projects?.find(
      (project) => project.companyId == session?.user?.companyId
    )
    setInternalProject(project || null)
  }, [projects])

  const handleSelectProject = (project: Project) => {
    setInternalProject(project)

    if (pathname.startsWith("/tasks")) {
      const isList = pathname.includes("list")
      if (isList) {
        router.push(`/tasks/${project._id}/list`)
      } else {
        router.push(`/tasks/${project._id}`)
      }
    } else if (pathname.startsWith("/project")) {
      router.push(`/project/${project._id}`)
    }
  }

  return (
    <>
      <SidebarGroupLabel>
        <span className="truncate w-10/12 block">Project:</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
              {internalProject ? (
                <div className="flex items-center space-x-2">
                  <div
                    className={cn("w-4 h-4 rounded-full")}
                    style={{
                      backgroundColor: internalProject?.color,
                    }}
                  />
                  <span>{internalProject?.code}</span>
                  <ChevronDown className="h-4 w-4" />
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>Select project...</span>
                </div>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <ScrollArea
              style={{
                height: projects && projects.length > 4 ? "154px" : "auto",
              }}
            >
              {projects?.map((project) => (
                <DropdownMenuItem key={project._id} asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "justify-start text-gray-300 hover:text-white my-2 py-5 w-10/12",
                      internalProject?._id === project._id && "bg-gray-700"
                    )}
                    onClick={() => handleSelectProject(project)}
                  >
                    <div
                      className={cn("w-4 h-4 rounded-full")}
                      style={{
                        backgroundColor: project.color,
                      }}
                    />
                    <div className="flex flex-col text-left ml-2 w-10/12">
                      <div className="font-medium truncate">{project.code}</div>
                      <div className="text-xs text-gray-500 truncate">
                        {project.name || "No name"}
                      </div>
                    </div>
                  </Button>
                </DropdownMenuItem>
              ))}
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarProjectMenuItem
              key={item.title}
              item={item}
              userPermissions={userPermissions}
              project={internalProject}
              projectId={internalProject?._id || null}
            />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </>
  )
}
