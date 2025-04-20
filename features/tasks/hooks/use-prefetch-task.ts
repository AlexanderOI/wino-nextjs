import { useQueryClient } from "@tanstack/react-query"

import { getTask } from "@/features/tasks/action/task.action"
import { getColumns } from "@/features/tasks/action/column.action"

export function usePrefetchTask(projectId: string) {
  const queryClient = useQueryClient()

  const handleMouseEnter = (id: string) => {
    queryClient.prefetchQuery({
      queryKey: ["task", id],
      queryFn: () => getTask(id, { fields: true }),
      staleTime: 1000 * 60 * 5,
    })

    queryClient.prefetchQuery({
      queryKey: ["columns", projectId],
      queryFn: () => getColumns(projectId),
      staleTime: 1000 * 60 * 5,
    })
  }

  return { handleMouseEnter }
}
