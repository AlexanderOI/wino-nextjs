import { apiClientServer } from "@/utils/api-client-server"
import { Activity } from "@/features/tasks/interfaces/activity.interface"

export interface GetRecentActivitiesParams {
  projectId: string
  taskId?: string
  userId?: string
  limit?: number
  offset?: number
}

export const getRecentActivities = async (params: GetRecentActivitiesParams) => {
  try {
    const resentActivitiesResponse = await apiClientServer.get<Activity[]>(
      `tasks/activity/recent`,
      { params }
    )
    return resentActivitiesResponse.data
  } catch (error) {
    console.error(error)
    return []
  }
}
