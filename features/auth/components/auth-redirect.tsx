"use client"

import { Session } from "next-auth"
import { signOut } from "next-auth/react"

export function AuthRedirect({
  session,
  children,
}: {
  session: Session | null
  children: React.ReactNode
}) {
  if (session?.backendTokens.statusCode === 401) {
    signOut()
  }

  return children
}
