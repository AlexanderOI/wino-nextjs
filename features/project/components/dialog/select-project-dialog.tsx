"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

import { cn } from "@/lib/utils"

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

import { Project } from "@/features/project/interfaces/project.interface"
import { useProject } from "@/features/project/hooks/use-project"
import { useCurrentProject } from "@/features/project/hooks/use-current-project"

interface Props {
  children?: React.ReactNode
}

export function SelectProjectDialog({ children }: Props) {
  const router = useRouter()
  const pathname = usePathname()

  const { projects } = useProject()
  const { projectId: currentProjectId } = useCurrentProject()

  const handleSelectProject = (project: Project) => {
    if (pathname.startsWith("/tasks")) {
      router.push(`/tasks/${project._id}`)
    } else {
      router.push(`/project/${project._id}`)
    }
  }

  return (
    <Dialog>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}

      {projects && (
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
                    project._id === currentProjectId && "border-purple-400"
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
              <DialogClose asChild>
                <Link
                  href="/manage-projects"
                  className={buttonVariants({ variant: "purple" })}
                >
                  Create Project
                </Link>
              </DialogClose>
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
