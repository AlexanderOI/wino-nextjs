import { useQuery } from "@tanstack/react-query"

import { getColumns } from "@/features/tasks/action/column.action"

export const useColumnsQuery = (id: string) => {
  const columnsQuery = useQuery({
    queryKey: ["columns", id],
    queryFn: () => getColumns(id),
  })

  return { columnsQuery }
}
