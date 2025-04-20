"use server"

import { ColumnTask } from "@/features/tasks/interfaces/column.interface"
import { apiClientServer } from "@/utils/api-client-server"

export const getColumns = async (projectId: string) => {
  const response = await apiClientServer.get<ColumnTask[]>(`columns/project/${projectId}`)
  return response.data
}

interface GetColumnTaskCountParams {
  projectId?: string
}

export interface ColumnTaskCount extends ColumnTask {
  tasksCount: number
}

export const getColumnTaskCount = async (params?: GetColumnTaskCountParams) => {
  try {
    const response = await apiClientServer.get<ColumnTaskCount[]>(
      `columns/project/total-tasks`,
      { params }
    )
    return response.data
  } catch (error) {
    return []
  }
}
