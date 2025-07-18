import { useQuery, useQueryClient } from "@tanstack/react-query"
import { getProjects } from "../actions/project.action"
import { useSession } from "next-auth/react"

const STALE_TIME = 3600000

export const useProject = () => {
  const { data: session } = useSession()
  const queryClient = useQueryClient()

  const projectsQuery = useQuery({
    queryKey: ["projects", session?.user.companyId],
    queryFn: () => getProjects(),
    staleTime: STALE_TIME,
  })

  const invalidateProjects = () => {
    queryClient.invalidateQueries({
      queryKey: ["projects", session?.user.companyId],
    })
  }

  return {
    projects: projectsQuery.data?.projects,
    total: projectsQuery.data?.total,
    projectsQuery,
    invalidateProjects,
  }
}
