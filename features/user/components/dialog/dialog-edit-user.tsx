"use client"

import { useRef, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DialogHeader,
  DialogFooter,
  DialogClose,
  DialogContent,
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

import { getPartialUserById } from "@/features/user/actions/action"
import { apiClient } from "@/utils/api-client"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { AxiosError } from "axios"

const userSchema = z.object({
  userName: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email(),
  roleType: z.string().min(1),
})

const defaultValues = {
  name: "",
  userName: "",
  email: "",
  roleType: "",
}

export const DialogEditUser = ({ id }: { id: string }) => {
  const router = useRouter()
  const closeRef = useRef<HTMLButtonElement>(null)

  const { data: user } = useQuery({
    queryKey: ["user", id],
    queryFn: () => getPartialUserById(id),
  })

  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: defaultValues,
  })

  useEffect(() => {
    if (!user) return

    form.reset({
      name: user?.name,
      userName: user?.userName,
      email: user?.email,
      roleType: user?.roleType,
    })
  }, [user])

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      let route = user?.isInvited ? `/users/invited-user/${id}` : `/users/${id}`
      let updateData = user?.isInvited ? { roleType: data.roleType } : data

      await apiClient.patch(route, updateData)

      toast({
        title: "User saved",
        description: "User has been saved successfully",
        duration: 1000,
      })

      router.refresh()
      closeRef.current?.click()
    } catch (error) {
      if (error instanceof AxiosError) {
        form.setError("root", { message: error.response?.data.message })
      }
    }
  })

  return (
    <DialogContent className="max-w-4xl" aria-describedby={undefined}>
      <DialogHeader>
        <DialogTitle>Edit User</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <div className="grid gap-4">
          {form.formState.errors.root && (
            <div className="text-red-500">{form.formState.errors.root.message}</div>
          )}
        </div>
        <form onSubmit={onSubmit} className="grid gap-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input type="text" disabled={user?.isInvited} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="userName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      autoComplete="username"
                      disabled={user?.isInvited}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" disabled={user?.isInvited} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="roleType"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role Type</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <DialogFooter>
            <Button type="submit">Save</Button>

            <DialogClose asChild>
              <Button variant="secondary" ref={closeRef}>
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  )
}
