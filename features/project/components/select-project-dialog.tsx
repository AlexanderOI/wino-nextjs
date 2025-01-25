"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import {
  Dialog,
  DialogHeader,
  DialogFooter,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { Project } from "../interfaces/project.interface"
import { useProjectStore } from "../store/project.store"
import apiClient from "@/utils/api-client"
import { cn } from "@/lib/utils"

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

  const [projects, setProjects] = useState<Project[]>([])
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
    router.push(`/project/${project._id}`)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}

      {isOpen && projects.length > 0 && (
        <DialogContent className="max-w-4xl" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Select Project</DialogTitle>
          </DialogHeader>

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
