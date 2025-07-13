import { useMemo } from "react"
import { usePathname, useParams } from "next/navigation"
import { useProject } from "@/features/project/hooks/use-project"

export const useCurrentProject = () => {
  const pathname = usePathname()
  const params = useParams()

  const projectId = extractProjectIdFromUrl(pathname, params)
  const { projects } = useProject()

  const project = useMemo(() => {
    return projects?.find((p) => p._id === projectId) ?? null
  }, [projects, projectId])

  return {
    project,
    projectId,
  }
}

function extractProjectIdFromUrl(pathname: string, params: any): string | null {
  if (pathname.startsWith("/project/")) {
    return params.id as string
  }

  if (pathname.startsWith("/tasks/")) {
    return params.projectId as string
  }

  return null
}
