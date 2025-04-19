import { Task } from "@/features/tasks/interfaces/task.interface"
import { Field } from "@/features/tasks/interfaces/task.interface"
import { apiClientServer } from "@/utils/api-client-server"

export type GetTaskAllParams = {
  sort?: { id: string; desc: boolean }[]
  projectId?: string
  columnsId?: string[]
  assignedToId?: string[]
  search?: string
  fromUpdatedAt?: string
  toUpdatedAt?: string
  fromCreatedAt?: Date
  toCreatedAt?: Date
  limit?: number
  offset?: number
}

export const getAllTasks = async (params: GetTaskAllParams) => {
  const response = await apiClientServer.get<{ tasks: Task[]; total: number }>("/tasks", {
    params: {
      ...params,
      sort: JSON.stringify(params.sort),
    },
    paramsSerializer: {
      indexes: null,
    },
  })
  return response.data
}

export type GetTaskParams = {
  fields?: boolean
}

export const getTask = async (id: string, params?: GetTaskParams) => {
  const response = await apiClientServer.get<Task>(`tasks/${id}`, { params })
  return response.data
}

export const updateTask = async (id: string, data: Task) => {
  const response = await apiClientServer.put<Task>(`tasks/${id}`, data)
  return response.data
}

export const deleteTask = async (id: string) => {
  const response = await apiClientServer.delete<Task>(`tasks/${id}`)
  return response.data
}

export const createTask = async (data: Task) => {
  const response = await apiClientServer.post<Task>(`tasks`, data)
  return response.data
}

export const getTotalTasks = async () => {
  const response = await apiClientServer.get<number>(`tasks/total`)
  return response.data
}

export const createFieldTask = async (taskId: string, data: Omit<Field, "_id">) => {
  const response = await apiClientServer.post<Field>(`tasks/${taskId}/field`, data)
  return response.data
}

export const updateFieldTask = async (
  taskId: string,
  id: string,
  data: Omit<Field, "_id">
) => {
  const response = await apiClientServer.put<Field>(`tasks/${taskId}/field/${id}`, data)
  return response.data
}

export const deleteFieldTask = async (taskId: string, id: string) => {
  const response = await apiClientServer.delete<Field>(`tasks/${taskId}/field/${id}`)
  return response.data
}
