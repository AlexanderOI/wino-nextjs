import { useQuery } from "@tanstack/react-query"

import { getFormTask } from "@/features/form/actions/form.action"

export const useFormTask = (formTaskId: string) => {
  const formTaskQuery = useQuery({
    queryKey: ["formTask", formTaskId],
    queryFn: () => getFormTask(formTaskId),
    staleTime: 300000,
  })

  return { formTaskQuery }
}
