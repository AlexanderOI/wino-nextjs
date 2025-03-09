"use client"

import { useRouter } from "next/navigation"

import { useRef, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { EyeOffIcon, EyeIcon } from "lucide-react"
import { AxiosError } from "axios"
import { z } from "zod"

import { cn } from "@/lib/utils"
import { apiClient } from "@/utils/api-client"

import { Button } from "@/components/ui/button"
import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormLabel,
  FormControl,
  FormItem,
  FormField,
  FormMessage,
} from "@/components/ui/form"
import { toast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"

import { getPartialUserById } from "@/features/user/actions/action"

const passwordSchema = z
  .object({
    password: z.string().min(4),
    confirmPassword: z.string().min(4),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  })

export const DialogChangePassword = ({ id }: { id: string }) => {
  const router = useRouter()
  const cancelRef = useRef<HTMLButtonElement>(null)
  const [showPassword, setShowPassword] = useState(false)

  const { data: user } = useQuery({
    queryKey: ["user", id],
    queryFn: () => getPartialUserById(id),
  })

  const form = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      const { password, confirmPassword } = data

      await apiClient.patch(`/users/${id}`, {
        password,
        confirmPassword,
      })

      toast({
        title: "Password changed successfully",
        description: "The password of the user has been changed successfully",
        duration: 2000,
      })

      router.refresh()
      cancelRef.current?.click()
    } catch (error) {
      if (error instanceof AxiosError) {
        toast({
          title: "Error",
          description: error.response?.data.message,
          duration: 2000,
        })
      }
    }
  })

  return (
    <DialogContent className="max-w-2xl" aria-describedby={undefined}>
      <DialogHeader>
        <DialogTitle>
          Change Password: {user?.name} - ( {user?.userName} )
        </DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <div className="grid gap-4">
          {form.formState.errors.root && (
            <div className="text-red-500">{form.formState.errors.root.message}</div>
          )}
        </div>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="flex flex-col gap-4">
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <div className="flex items-center">
                    <FormControl>
                      <Input
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        className="rounded-r-none"
                        {...field}
                      />
                    </FormControl>
                    <ViewPassword
                      showPassword={showPassword}
                      setShowPassword={setShowPassword}
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="confirmPassword"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <div className="flex items-center">
                    <FormControl>
                      <Input
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        className="rounded-r-none"
                        {...field}
                      />
                    </FormControl>
                    <ViewPassword
                      showPassword={showPassword}
                      setShowPassword={setShowPassword}
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button ref={cancelRef} variant="outline">
                Cancel
              </Button>
            </DialogClose>

            <Button onClick={handleSubmit}>Change Role</Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  )
}

const ViewPassword = ({
  showPassword,
  setShowPassword,
}: {
  showPassword: boolean
  setShowPassword: (showPassword: boolean) => void
}) => {
  return (
    <Button
      variant="outline"
      className="flex items-center gap-2 cursor-pointer my-1 mb-2 rounded-l-none"
      onClick={() => setShowPassword(!showPassword)}
    >
      <EyeIcon className={cn("w-4 h-4", showPassword ? "hidden" : "")} />
      <EyeOffIcon className={cn("w-4 h-4", !showPassword ? "hidden" : "")} />
    </Button>
  )
}
