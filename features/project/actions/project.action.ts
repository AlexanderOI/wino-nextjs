import { apiClientServer } from "@/utils/api-client-server"

import { Project } from "@/features/project/interfaces/project.interface"
import { apiClient } from "@/utils/api-client"

interface GetProjectParams {
  withMembers?: boolean
}

export async function getProject(projectId: string, params?: GetProjectParams) {
  try {
    const response = await apiClientServer.get<Project>(`/projects/${projectId}`, {
      params,
    })
    return {
      ...response.data,
      startDate: new Date(response.data.startDate),
      endDate: new Date(response.data.endDate),
    }
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function getProjects() {
  const response = await apiClient.get<Project[]>("/projects")
  return response.data
}
