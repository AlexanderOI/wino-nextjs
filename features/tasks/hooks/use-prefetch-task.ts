import { useQueryClient } from "@tanstack/react-query"

import { getTask } from "@/features/tasks/action/task.action"
import { getColumns } from "@/features/tasks/action/column.action"
import { getByTask } from "@/features/tasks/actions/comment.action"

const STALE_TIME = 1000 * 60 * 5

export function usePrefetchTask(projectId: string) {
  const queryClient = useQueryClient()

  const handleMouseEnter = (id: string) => {
    queryClient.prefetchQuery({
      queryKey: ["task", id],
      queryFn: () => getTask(id, { fields: true }),
      staleTime: STALE_TIME,
    })

    queryClient.prefetchQuery({
      queryKey: ["columns", projectId],
      queryFn: () => getColumns(projectId),
      staleTime: STALE_TIME,
    })

    queryClient.prefetchQuery({
      queryKey: ["comments", id],
      queryFn: () => getByTask(id),
      staleTime: STALE_TIME,
    })
  }

  return { handleMouseEnter }
}
