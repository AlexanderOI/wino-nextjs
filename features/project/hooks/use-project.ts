import { useQuery, useQueryClient } from "@tanstack/react-query"
import { getProjects } from "../actions/project.action"
import { useSession } from "next-auth/react"

export const useProject = () => {
  const { data: session } = useSession()
  const queryClient = useQueryClient()

  const projectsQuery = useQuery({
    queryKey: ["projects", session?.user.companyId],
    queryFn: getProjects,
  })

  const invalidateProjects = () => {
    queryClient.invalidateQueries({ queryKey: ["projects", session?.user.companyId] })
  }

  return { projectsQuery, invalidateProjects }
}
