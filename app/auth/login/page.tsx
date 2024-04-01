"use client"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRight } from "lucide-react"
import { signIn, useSession } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
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

  if (session) {
    router.replace("/dashboard")
    return null
  }

  const onSubmitRegister = handleSubmit(async (data) => {
    console.log(data)
    const response = await signIn("credentials", {
      username: data.username,
      password: data.password,
      redirect: false,
    })
    console.log(response)

    if (response?.error) {
      setPasswordError("No matching credentials")
    } else {
      router.push("/dashboard")
      router.refresh()
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
                {...register("username", { required: true })}
                className="w-full"
                name="username"
                type="username"
              />
            </Label>

            <Label>
              Password
              <Input
                {...register("password", { required: true })}
                className="w-full"
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
      </div>

      <div className="absolute bottom-3 right-0 left-0 flex justify-center items-center">
        <p className="mr-5">Don't have an account?</p>
        <Link href="/auth/register" className={buttonVariants()}>
          Register <ArrowRight className="w-5" />
        </Link>
      </div>
    </div>
  )
}
