"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"
import { apiClient } from "@/utils/api-client"

import {
  Dialog,
  DialogHeader,
  DialogFooter,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { useProjectStore } from "@/features/project/store/project.store"
import { Project } from "@/features/project/interfaces/project.interface"

interface Props {
  children?: React.ReactNode
  id?: string
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

export function SelectProjectDialog({
  isOpen: externalIsOpen,
  onOpenChange,
  children,
}: Props) {
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  const isOpen = externalIsOpen ?? internalIsOpen
  const setIsOpen = onOpenChange ?? setInternalIsOpen

  const router = useRouter()
  const pathname = usePathname()

  const [projects, setProjects] = useState<Project[]>()
  const projectSelected = useProjectStore((state) => state.project)
  const setProject = useProjectStore((state) => state.setProject)

  useEffect(() => {
    const getProjects = async () => {
      const response = await apiClient.get<Project[]>("/projects")
      setProjects(response.data)
    }
    if (isOpen) getProjects()
  }, [isOpen])

  const handleSelectProject = (project: Project) => {
    setProject(project)
    setIsOpen(false)
    if (pathname.startsWith("/tasks")) {
      router.push(`/tasks/${project._id}`)
    } else {
      router.push(`/project/${project._id}`)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}

      {isOpen && projects && (
        <DialogContent className="max-w-4xl" aria-describedby={undefined}>
          <DialogHeader className="flex justify-between items-center">
            <DialogTitle>Select Project</DialogTitle>
          </DialogHeader>

          {projects.length > 0 ? (
            <div className="grid grid-cols-4 gap-4">
              {projects.map((project) => (
                <Card
                  key={project._id}
                  className={cn(
                    "cursor-pointer dark:bg-purple-deep hover:border-purple-400",
                    project._id === projectSelected?._id && "border-purple-400"
                  )}
                  onClick={() => handleSelectProject(project)}
                >
                  <CardHeader className="bg-none pb-0">
                    <CardTitle className="text-sm">{project.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{project.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <p className="text-sm mb-4">No projects found</p>
              <Link
                href="/manage-projects"
                className={buttonVariants({ variant: "purple" })}
                onClick={() => setIsOpen(false)}
              >
                Create Project
              </Link>
            </div>
          )}

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="secondary">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  )
}
