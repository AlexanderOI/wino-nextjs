"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"

import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"

import {
  duplicateFormTask,
  getFormsTask,
  assignFormTaskToProject,
} from "@/features/form/actions/form.action"
import { useProjectStore } from "@/features/project/store/project.store"
import { CardForm } from "@/features/project/components/card/card-form"

export const SelectFormDialog = () => {
  const { data: forms, refetch } = useQuery({
    queryKey: ["forms"],
    queryFn: () => getFormsTask(),
  })

  const project = useProjectStore((state) => state.project)
  const setProject = useProjectStore((state) => state.setProject)

  const [isLoading, setIsLoading] = useState(false)

  const handleSelect = async (formTaskId: string) => {
    try {
      setIsLoading(true)

      await assignFormTaskToProject(formTaskId, project?._id || "")

      toast({
        title: "Form assigned",
        description: "Form assigned successfully",
        duration: 1000,
      })

      if (!project) return

      setProject({
        ...project,
        formTaskId: formTaskId,
      })

      await refetch()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign form task to project",
        variant: "destructive",
        duration: 1000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDuplicate = async (formTaskId: string) => {
    try {
      setIsLoading(true)
      const formDuplicate = await duplicateFormTask(formTaskId)

      toast({
        title: "Form duplicated",
        description: "Form duplicated successfully",
        duration: 1000,
      })

      await handleSelect(formDuplicate._id)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to duplicate form task",
        variant: "destructive",
        duration: 1000,
      })
    }
  }

  return (
    <DialogContent className="max-w-4xl" aria-describedby={undefined}>
      <DialogHeader className="flex justify-center items-center">
        <DialogTitle>Select Form</DialogTitle>
      </DialogHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-center gap-4">
        {forms?.map((form) => (
          <CardForm
            key={form._id}
            form={form}
            projectFormId={project?.formTaskId || ""}
            handleSelect={handleSelect}
            handleDuplicate={handleDuplicate}
            isLoading={isLoading}
          />
        ))}
      </div>

      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  )
}
