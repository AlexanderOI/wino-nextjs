"use client"
import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Loading from "@/components/common/loading"

export default function Home() {
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === "loading") return

    if (session) {
      router.replace("/dashboard")
    } else {
      router.replace("/auth/login")
    }
  }, [session, status, router])

  return (
    <main className="">
      <Loading />
    </main>
  )
}
