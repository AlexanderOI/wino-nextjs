import { useQuery } from "@tanstack/react-query"

import { getColumns } from "@/features/tasks/actions/column.action"

export const useColumnsQuery = (projectId: string) => {
  const columnsQuery = useQuery({
    queryKey: ["columns", projectId],
    queryFn: () => getColumns(projectId),
  })

  return { columnsQuery }
}
