import { useQuery } from "@tanstack/react-query"

import { getTask, GetTaskParams } from "@/features/tasks/action/task.action"

export const useTaskQuery = (id: string, params?: GetTaskParams) => {
  const taskQuery = useQuery({
    queryKey: ["task", id],
    queryFn: () => getTask(id, params),
  })

  return { taskQuery }
}
