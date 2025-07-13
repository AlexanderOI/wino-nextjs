import { apiClientServer } from "@/utils/api-client-server"

import { Project } from "@/features/project/interfaces/project.interface"

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

interface GetProjectsParams {
  search?: string
  limit?: number
  page?: number
}

interface GetProjectsResponse {
  projects: Project[]
  total: number
}

export async function getProjects(params?: GetProjectsParams) {
  try {
    const response = await apiClientServer.get<GetProjectsResponse>("/projects", {
      params,
    })
    return response.data
  } catch (error) {
    console.error(error)
    return {
      projects: [],
      total: 0,
    }
  }
}
