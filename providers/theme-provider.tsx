"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider, ThemeProviderProps } from "next-themes"
import { useSession } from "next-auth/react"
import { signOut } from "next-auth/react"
import { useEffect } from "react"
import Loading from "@/components/common/loading"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [isLoading, setIsLoading] = React.useState(true)
  const { data: session, status } = useSession()

  useEffect(() => {
    async function checkSession() {
      if (session?.backendTokens.statusCode === 401) {
        await signOut()
        setIsLoading(false)
      } else {
        setIsLoading(false)
      }
    }

    checkSession()
  }, [status])

  if (status === "loading" || isLoading) {
    return <Loading />
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
