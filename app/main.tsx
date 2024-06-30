"use client"
import { AsideResposive } from "@/components/AsideResponsive"
import { HeaderNav } from "@/components/HeaderNav"
import { AsideProvider } from "@/context/AsideResponsiveProvider"
import SessionAuthProvider from "@/context/SessionAuthProvider"
import { useSession } from "next-auth/react"
import { ThemeProvider } from "next-themes"

export function Main({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()

  return (
    <div className="flex h-screen">
      <AsideResposive />
      <div className="flex-1">
        <HeaderNav />
        <main
          className={`overflow-auto p-5 w-full ${
            session ? "h-screen-80" : "h-screen"
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  )
}
