import { ColumnTask } from "@/features/tasks/interfaces/column.interface"
import { apiClientServer } from "@/utils/api-client-server"

export const getColumns = async (id: string) => {
  const response = await apiClientServer.get<ColumnTask[]>(`columns/project/${id}`)
  return response.data
}
