"use server"

import { getSession } from "@/utils/get-session"
import { AuthRedirect } from "./auth-redirect"

export async function AuthCheck({ children }: { children: React.ReactNode }) {
  const session = await getSession()

  return <AuthRedirect session={session}>{children}</AuthRedirect>
}
