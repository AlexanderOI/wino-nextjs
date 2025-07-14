"use client"

import { useState } from "react"
import { signIn, useSession } from "next-auth/react"
import { Loader2 } from "lucide-react"
import axios from "axios"
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
import { BACKEND_URL } from "@/constants/routes"

const isDemo = process.env.NEXT_PUBLIC_ENV === "demo"

const formSchemaDemo = z.object({
  userName: z.string().min(1),
  password: z.string().min(4),
})

const formSchemaProd = z
  .object({
    userName: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(4),
    confirmPassword: z.string().min(4),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  })

const formSchema = isDemo ? formSchemaDemo : formSchemaProd

export default function Register() {
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm({
    defaultValues: {
      userName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(formSchema),
  })

  if (session) {
    window.location.href = "/dashboard"
  }

  const onSubmitRegister = form.handleSubmit(async (data) => {
    setIsLoading(true)
    const response = await axios.post("/api/auth/register", data)

    if (response.status === 200) {
      await signIn("credentials", {
        userName: data.userName,
        password: data.password,
        redirect: false,
      })
    }
    setIsLoading(false)
  })

  const handleBlurCheckUserData = async (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    try {
      await axios.get(`${BACKEND_URL}/auth/check-user-data?${name}=${value}`)
    } catch (error: any) {
      form.setError(name as keyof typeof form.formState.errors, {
        message: error.response.data.message,
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={onSubmitRegister} className="space-y-4">
        <FormField
          control={form.control}
          name="userName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  name="userName"
                  type="userName"
                  onBlur={handleBlurCheckUserData}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {!isDemo && (
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    name="email"
                    type="email"
                    onBlur={handleBlurCheckUserData}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input {...field} name="password" type="password" autoComplete="off" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {!isDemo && (
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    name="confirmPassword"
                    type="password"
                    autoComplete="off"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button variant="purple" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="animate-spin text-purple-600 mr-2" />}
          Register
        </Button>
      </form>
    </Form>
  )
}
