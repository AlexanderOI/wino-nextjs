"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { signIn } from "next-auth/react"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const formSchema = z.object({
  userName: z.string().min(1),
  password: z.string().min(4),
})

export default function Login() {
  const router = useRouter()
  const [passwordError, setPasswordError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm({
    defaultValues: {
      userName: "",
      password: "",
    },
    resolver: zodResolver(formSchema),
  })

  const onSubmitLogin = form.handleSubmit(async (data) => {
    setIsLoading(true)
    const response = await signIn("credentials", {
      userName: data.userName,
      password: data.password,
      redirect: false,
    })

    if (response?.ok) {
      router.replace("/dashboard")
      router.refresh()
    }

    if (response?.error) {
      setPasswordError("No matching credentials")
      setIsLoading(false)
    }
  })

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={onSubmitLogin}>
        <FormField
          control={form.control}
          name="userName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input {...field} type="userName" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input {...field} type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {passwordError && <span className="text-red-500">{passwordError}</span>}

        <Button variant="purple" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="animate-spin text-purple-600 mr-2" />}
          Login
        </Button>
      </form>
    </Form>
  )
}
