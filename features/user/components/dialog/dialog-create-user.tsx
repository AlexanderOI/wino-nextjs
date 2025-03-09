"use client"

import { useRouter } from "next/navigation"

import { ChangeEvent, useRef } from "react"
import { useQuery } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { AxiosError } from "axios"
import { z } from "zod"

import { apiClient } from "@/utils/api-client"

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
import { toast } from "@/components/ui/use-toast"

import { RoleCheckbox } from "@/features/user/components/role-check-box"
import { getAllRoles } from "@/features/user/actions/action"

const userSchema = z
  .object({
    userName: z.string().min(1),
    name: z.string().min(1),
    email: z.string().email(),
    roleType: z.string().min(1),
    password: z.string().min(4),
    confirmPassword: z.string().min(4),
    rolesId: z.array(z.string()).min(1),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  })

const defaultValues = {
  name: "",
  userName: "",
  email: "",
  roleType: "",
  rolesId: [],
  password: "",
  confirmPassword: "",
}

export const DialogCreateUser = () => {
  const router = useRouter()
  const closeRef = useRef<HTMLButtonElement>(null)

  const { data: roles } = useQuery({
    queryKey: ["roles"],
    queryFn: getAllRoles,
  })

  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: defaultValues,
  })

  const onChangeRole = (event: ChangeEvent<HTMLInputElement>, roleId: string) => {
    const currentRoles = form.getValues("rolesId")
    if (event.target.checked) {
      currentRoles.push(roleId)
    } else {
      currentRoles.splice(currentRoles.indexOf(roleId), 1)
    }
    form.setValue("rolesId", currentRoles)
  }

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await apiClient.post("/users", data)

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
        <DialogTitle>Create User</DialogTitle>
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
                    <Input type="text" {...field} />
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
                    <Input type="text" autoComplete="username" {...field} />
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
                    <Input type="email" {...field} />
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

          <div className="grid sm:grid-cols-2 gap-4">
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" autoComplete="new-password" {...field} />
                  </FormControl>
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
                  <FormControl>
                    <Input type="password" autoComplete="new-password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            name="rolesId"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Roles</FormLabel>
                <FormControl>
                  <div className="grid sm:grid-cols-4 gap-2">
                    {roles?.map((role) => (
                      <RoleCheckbox
                        key={role._id}
                        role={role}
                        isChecked={field.value.includes(role._id)}
                        onChange={(checked) => onChangeRole(checked, role._id)}
                        className="flex-row"
                      />
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
