import { useQuery } from "@tanstack/react-query"

import { useProjectStore } from "@/features/project/store/project.store"
import { getFormTask } from "@/features/form/actions/form.action"

export const useFormTask = () => {
  const project = useProjectStore((state) => state.project)
  const formTaskQuery = useQuery({
    queryKey: ["formTask", project?.formTaskId],
    queryFn: () => getFormTask(project?.formTaskId ?? ""),
    staleTime: 300000,
  })

  return { formTaskQuery }
}
