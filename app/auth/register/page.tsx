"use client"

import Link from "next/link"

import { useState } from "react"
import { signIn, useSession } from "next-auth/react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TypographyH2 } from "@/components/ui/typography"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { BACKEND_URL } from "@/constants/routes"
import { Loader2 } from "lucide-react"

interface FormErrors {
  userName: string[]
  email: string[]
  password: string[]
  confirmPassword: string[]
}

export default function Register() {
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [formErrors, setFormErrors] = useState<FormErrors>({
    userName: [],
    email: [],
    password: [],
    confirmPassword: [],
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  if (session) {
    window.location.href = "/dashboard"
  }

  const onSubmitRegister = handleSubmit(async (data) => {
    setIsLoading(true)
    const response = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    })

    if (response.ok) {
      const response = await signIn("credentials", {
        userName: data.userName,
        password: data.password,
        redirect: false,
      })
    } else {
      const responseErrors: FormErrors = await response.json()
      setFormErrors(responseErrors)
    }
    setIsLoading(false)
  })

  const handleBlurCheckUsername = async (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const response = await fetch(`${BACKEND_URL}/auth/check-user-data?${name}=${value}`)

    if (!response.ok) {
      const data = await response.json()
      setFormErrors((prev) => ({ ...prev, [name]: [data.message] }))
    } else {
      setFormErrors((prev) => ({ ...prev, [name]: [] }))
    }
  }

  return (
    <div className="flex flex-col justify-center items-center h-screen-40">
      <Card className="w-full max-w-[30rem] p-5">
        <CardHeader className="flex justify-center items-center flex-col gap-y-2">
          <div className="flex justify-center items-center text-3xl md:text-4xl lg:text-5xl border-b-2 mb-5 pb-2 w-full">
            <span className="text-purple-light">{"<"}</span>
            WINO
            <span className="text-purple-light">{"/>"}</span>
          </div>

          <TypographyH2>Create your account</TypographyH2>
        </CardHeader>

        <CardContent>
          <form className="space-y-4" onSubmit={onSubmitRegister}>
            <Label>
              Username
              <Input
                {...register("userName", { required: true })}
                name="userName"
                type="userName"
                onBlur={handleBlurCheckUsername}
              />
              <FormError errors={formErrors.userName} />
            </Label>

            <Label>
              Email
              <Input
                {...register("email", { required: true })}
                name="email"
                type="email"
                onBlur={handleBlurCheckUsername}
              />
              <FormError errors={formErrors.email} />
            </Label>

            <Label>
              Password
              <Input
                {...register("password", { required: true })}
                name="password"
                type="password"
                autoComplete="off"
              />
              <FormError errors={formErrors.password} />
            </Label>

            <Label>
              Confirm Password
              <Input
                {...register("confirmPassword", { required: true })}
                name="confirmPassword"
                type="password"
                autoComplete="off"
              />
              <FormError errors={formErrors.confirmPassword} />
            </Label>

            <Button variant="purple" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="animate-spin text-purple-600 mr-2" />}
              Register
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center items-center">
          <p>Already registered?</p>

          <Link href="/auth/login" className="px-3 text-purple-500 hover:underline">
            Sign in
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

export function FormError({ errors }: { errors: string[] }) {
  return (
    <div className="text-red-500">
      {errors && errors.map((error, index) => <span key={index}>{error}</span>)}
    </div>
  )
}
