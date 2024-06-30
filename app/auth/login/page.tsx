"use client"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRight } from "lucide-react"
import { signIn, useSession } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

export default function Login() {
  const router = useRouter()
  const { data: session } = useSession()
  const [passwordError, setPasswordError] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  useEffect(() => {
    if (session) {
      router.replace("/dashboard")
    }
  }, [session])

  const onSubmitRegister = handleSubmit(async (data) => {
    const response = await signIn("credentials", {
      userName: data.userName,
      password: data.password,
      redirect: false,
    })

    if (response?.error) {
      setPasswordError("No matching credentials")
    }
  })

  return (
    <div className="flex flex-col justify-center items-center h-screen-40">
      <div className=" flex flex-col justify-center items-center w-full max-w-[30rem] py-7 border bg-dark-800 rounded-xl">
        <div className="sm:w-full sm:max-w-sm">
          <div className="flex justify-center items-center text-3xl md:text-4xl lg:text-5xl border-b-2 mb-5 pb-2">
            <span className=" text-sky-700">{"<"}</span>
            WINO
            <span className=" text-sky-700">/{">"}</span>
          </div>
          <h2 className="text-center text-2xl leading-9 tracking-tight">
            Login
          </h2>
        </div>

        <div className="mt-5 w-full max-w-96">
          <form className="space-y-6" onSubmit={onSubmitRegister}>
            <Label className=" py-8">
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
              />
            </Label>

            {passwordError && (
              <span className="text-red-500">{passwordError}</span>
            )}

            <div>
              <Button className="w-full mt-4">Login</Button>
            </div>
          </form>
        </div>

        <div className="flex text-center mt-2">
          <p>Don't have an account?</p>
          <Link
            href="/auth/register"
            className={`px-3 text-sky-400 hover:underline`}
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  )
}
