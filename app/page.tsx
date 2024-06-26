"use client"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()
  const { data: session } = useSession()

  if (session) {
    router.replace("/dashboard")
  }
  router.replace("auth/login")

  return <main className="">Loading</main>
}
