"use client"
import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === "loading") return // Si la sesión está cargando, no hacer nada.

    if (session) {
      router.replace("/dashboard")
    } else {
      router.replace("/auth/login")
    }
  }, [session, status, router])

  return <main className="">Loading</main>
}
