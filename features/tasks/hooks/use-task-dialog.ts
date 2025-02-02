import { useState, useCallback } from "react"
import { useToast } from "@/components/ui/use-toast"
import apiClient from "@/utils/api-client"
import { TASKS_URL, USERS_URL } from "@/constants/routes"
import { useColumnStore } from "../store/column.store"
import { User } from "@/features/user/interfaces/user.interface"
import { useTaskStore } from "../store/task.store"
import { ColumnTask } from "../interfaces/column.interface"
import { Task } from "../interfaces/task.interface"

export function useTaskDialog(id?: string) {
  const { toast } = useToast()

  const [loading, setLoading] = useState(true)

  const projectId = useColumnStore((state) => state.projectId)
  const task = useTaskStore((state) => state.task)
  const setTask = useTaskStore((state) => state.setTask)

  const [columns, setColumns] = useState<ColumnTask[]>([])
  const [users, setUsers] = useState<User[]>([])

  const fetchInitialData = useCallback(async () => {
    setLoading(true)
    try {
      // const responseUsers = await apiClient.get<User[]>(USERS_URL)

      const responseColumns = await apiClient.get(`/columns/project/${projectId}`)
      setColumns(responseColumns.data)

      if (id) {
        const taskResponse = await apiClient.get<Task>(`${TASKS_URL}/${id}`)
        setUsers(taskResponse.data.project?.members ?? [])

        setTask({
          ...taskResponse.data,
          startDate: new Date(taskResponse.data.startDate),
          endDate: new Date(taskResponse.data.endDate),
        })

        setLoading(false)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }, [id])

  const sendChanges = async (
    name: string,
    wasChanged: boolean,
    value?: string | Date | undefined
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
    task,
    users,
    columns,
    loading,
    setLoading,
    fetchInitialData,
    sendChanges,
  }
}
