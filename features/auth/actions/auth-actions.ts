"use server"

import { BACKEND_URL } from "@/constants/routes"
import { apiClientServer } from "@/utils/api-client-server"
import { getSession } from "@/utils/get-session"

export const refreshToken = async () => {
  const session = await getSession()
  const res = await fetch(`${BACKEND_URL}/auth/refresh`, {
    method: "POST",
    headers: {
      authorization: `Refresh ${session?.backendTokens.refreshToken}`,
    },
  })

  const data = await res.json()

  return data
}
