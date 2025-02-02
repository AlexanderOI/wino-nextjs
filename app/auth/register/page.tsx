"use client"
import { FormField } from "@/components/FormField"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRight } from "lucide-react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"

interface FormErrors {
  userName: string[]
  email: string[]
  password: string[]
  confirmPassword: string[]
}

export default function Register() {
  const router = useRouter()
  const { data: session } = useSession()
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
    router.replace("/dashboard")
  }

  const onSubmitRegister = handleSubmit(async (data) => {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    })

    if (response.ok) {
      router.push("/auth/login")
    } else {
      const responseErrors: FormErrors = await response.json()
      setFormErrors(responseErrors)
    }
  })

  return (
    <div className="flex flex-col justify-center items-center h-screen-40">
      <div className=" flex flex-col justify-center items-center w-full max-w-[30rem] py-7 border bg-dark-800 rounded-xl">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="sm:w-full sm:max-w-sm">
            <div className="flex justify-center items-center text-3xl md:text-4xl lg:text-5xl border-b-2 mb-5 pb-2">
              <span className=" text-sky-700">{"<"}</span>
              WINO
              <span className=" text-sky-700">/{">"}</span>
            </div>
            <h2 className="text-center text-2xl leading-9 tracking-tight">
              Create your account
            </h2>
          </div>
        </div>

        <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={onSubmitRegister}>
            <div className="mb-5">
              <Label>
                Username
                <Input
                  {...register("userName", { required: true })}
                  name="userName"
                  type="userName"
                />
                <FormError errors={formErrors.userName} />
              </Label>
            </div>

            <div className="mb-5">
              <Label>
                Email
                <Input
                  {...register("email", { required: true })}
                  name="email"
                  type="email"
                />
                <FormError errors={formErrors.email} />
              </Label>
            </div>

            <div className="mb-5">
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
            </div>

            <div className="mb-5">
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
            </div>

            <div>
              <Button className="w-full">Register</Button>
            </div>
          </form>
        </div>

        <div className="flex text-center mt-2">
          <p>Already registered?</p>
          <Link href="/auth/login" className={`px-3 text-sky-400 hover:underline`}>
            Sign in
          </Link>
        </div>
      </div>
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
