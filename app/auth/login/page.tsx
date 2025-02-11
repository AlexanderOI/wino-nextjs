"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

import { useEffect, useState } from "react"
import { signIn, useSession } from "next-auth/react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { TypographyH2 } from "@/components/ui/typography"
import { Loader2 } from "lucide-react"

export default function Login() {
  const router = useRouter()
  const { data: session } = useSession()
  const [passwordError, setPasswordError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  useEffect(() => {
    if (session) {
      router.replace("/dashboard")
      router.refresh()
    }
  }, [session])

  const onSubmitRegister = handleSubmit(async (data) => {
    setIsLoading(true)
    const response = await signIn("credentials", {
      userName: data.userName,
      password: data.password,
      redirect: false,
    })

    if (response?.error) {
      setPasswordError("No matching credentials")
      setIsLoading(false)
    }
  })

  return (
    <div className="flex flex-col justify-center items-center h-screen-40">
      <Card className="w-full max-w-[30rem] p-5">
        <CardHeader className="flex justify-center items-center flex-col gap-y-2">
          <div className="flex justify-center items-center text-3xl md:text-4xl lg:text-5xl border-b-2 mb-5 pb-2 w-full">
            <span className="text-purple-light">{"<"}</span>
            WINO
            <span className="text-purple-light">{"/>"}</span>
          </div>

          <TypographyH2>Login to your account</TypographyH2>
        </CardHeader>

        <CardContent>
          <form className="space-y-4" onSubmit={onSubmitRegister}>
            <Label>
              Username
              <Input
                {...register("userName", { required: true })}
                name="userName"
                type="userName"
              />
            </Label>

            <Label>
              Password
              <Input
                {...register("password", { required: true })}
                name="password"
                type="password"
                autoComplete="off"
              />
            </Label>

            {passwordError && <span className="text-red-500">{passwordError}</span>}

            <Button variant="purple" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="animate-spin text-purple-600 mr-2" />}
              Login
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center items-center">
          <p>Don't have an account?</p>
          <Link href="/auth/register" className="px-3 text-purple-500 hover:underline">
            Register
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
