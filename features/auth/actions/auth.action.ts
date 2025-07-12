"use server"

import { BACKEND_URL } from "@/constants/routes"
import { getSession } from "@/utils/get-session"
import { cookies } from "next/headers"

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

export const deleteSession = async () => {
  const cookieStore = await cookies()
  cookieStore.delete("next-auth.session-token")
  cookieStore.delete("next-auth.csrf-token")
}
