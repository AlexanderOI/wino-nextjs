import { useQuery } from "@tanstack/react-query"

import { getPartialUserById } from "@/features/user/actions/action"

export const useUserTaskQuery = () => {
  const userQuery = useQuery({
    queryKey: ["user"],
    queryFn: () => getPartialUserById(),
  })

  return { userQuery }
}
