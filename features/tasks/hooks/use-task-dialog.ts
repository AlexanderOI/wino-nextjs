import { useEffect } from "react"
import { JSONContent } from "@tiptap/react"

import { apiClient } from "@/utils/api-client"
import { toast } from "@/components/ui/use-toast"

import { Task } from "@/features/tasks/interfaces/task.interface"

import { useTaskStore } from "@/features/tasks/store/task.store"
import { useColumnsQuery } from "@/features/tasks/hooks/use-colums-query"
import { useTaskQuery } from "@/features/tasks/hooks/use-task-query"
import { useFormTask } from "@/features/tasks/hooks/use-form-task-query"
import { useCurrentProject } from "@/features/project/hooks/use-current-project"

export function useTaskDialog(id: string) {
  const { project } = useCurrentProject()

  const { taskQuery } = useTaskQuery(id, { fields: true })
  const { columnsQuery } = useColumnsQuery(project?._id || "")
  const { formTaskQuery } = useFormTask(project?.formTaskId || "")

  const setTask = useTaskStore((state) => state.setTask)
  const setFormData = useTaskStore((state) => state.setFormData)

  useEffect(() => {
    if (taskQuery.data) {
      setTask({
        ...taskQuery.data,
        startDate: new Date(taskQuery.data.startDate),
        endDate: new Date(taskQuery.data.endDate),
      })

      const filteredData =
        taskQuery.data?.fields?.reduce((acc, field) => {
          acc[field.idField] = field.value
          return acc
        }, {} as Record<string, string | number | Date>) ?? {}

      setFormData({
        ...filteredData,
      })
    }
  }, [id, taskQuery.data])

  const sendChanges = async (
    name: string,
    wasChanged: boolean,
    value?: string | Date | JSONContent | undefined
  ) => {
    if (!wasChanged) return
    let valueToSend = null
    if (!value) {
      valueToSend = useTaskStore.getState().task?.[name as keyof Task]
    }

    const response = await apiClient.patch(`/tasks/${id}`, {
      [name]: value ?? valueToSend,
    })

    if (response.status === 200) {
      toast({
        title: "Task updated successfully",
        description: "Task updated successfully",
        duration: 1500,
      })
    } else {
      toast({
        title: "Failed to update task",
        description: "Failed to update task",
        variant: "destructive",
        duration: 1500,
      })
    }
  }

  return {
    taskQuery,
    columnsQuery,
    formTaskQuery,
    sendChanges,
  }
}
