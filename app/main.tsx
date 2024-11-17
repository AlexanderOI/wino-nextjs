"use client"
import { HeaderNav } from "@/components/HeaderNav"
import { useSession } from "next-auth/react"

export function Main({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()

  return (
    <div className="flex h-screen w-full">
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
