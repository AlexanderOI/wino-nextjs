import { useState, useCallback } from "react"
import { useToast } from "@/components/ui/use-toast"
import apiClient from "@/utils/api-client"
import { TASKS_URL, USERS_URL } from "@/constants/routes"
import { ColumnData, ColumnTask, Task } from "@/app/tasks/[projectId]/page"
import { useColumnStore } from "../store/column.store"
import { User } from "@/features/user/interfaces/user.interface"
import { useTaskStore } from "../store/task.store"

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
      const responseUsers = await apiClient.get<User[]>(USERS_URL)
      setUsers(responseUsers.data)

      const responseColumns = await apiClient.get(`/columns/project/${projectId}`)
      setColumns(responseColumns.data)

      if (id) {
        const taskResponse = await apiClient.get<Task>(`${TASKS_URL}/${id}`)

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

  const handleSubmit = async (event: React.FormEvent, onClose: () => void) => {
    event.preventDefault()

    try {
      if (id) {
        await apiClient.patch(`${TASKS_URL}/${id}`, task)
      } else {
        await apiClient.post(TASKS_URL, task)
      }
      setTask(null)
      onClose()
      toast({
        title: "Task saved",
        description: "Task has been saved successfully",
        duration: 1000,
      })
    } catch (error) {
      console.error("Error saving task:", error)
    }
  }

  return {
    task,
    users,
    columns,
    loading,
    setLoading,
    fetchInitialData,
    handleSubmit,
  }
}
