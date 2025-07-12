"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { TypographyH2 } from "@/components/ui/typography"

export function AuthLayoutContent() {
  const pathname = usePathname()

  const isRegister = pathname.includes("/register")

  return (
    <TypographyH2>
      {isRegister ? "Create your account" : "Login to your account"}
    </TypographyH2>
  )
}

export function AuthLayoutContentFooter() {
  const pathname = usePathname()

  const isRegister = pathname.includes("/register")

  return (
    <>
      <p>{isRegister ? "Already registered?" : "Don't have an account?"}</p>
      <Link
        href={isRegister ? "/auth/login" : "/auth/register"}
        className="px-3 text-purple-500 hover:underline"
      >
        {isRegister ? "Sign in" : "Sign up"}
      </Link>
    </>
  )
}
