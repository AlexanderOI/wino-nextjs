import { apiClientServer } from "@/utils/api-client-server"

import { Project } from "@/features/project/interfaces/project.interface"

interface GetProjectParams {
  withMembers?: boolean
}

export async function getProject(projectId: string, params?: GetProjectParams) {
  const project = await apiClientServer.get<Project>(`/projects/${projectId}`, {
    params,
  })
  return project.data
}
