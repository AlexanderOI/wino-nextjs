"use client"
import { Pencil } from "lucide-react"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { User } from "../user/interfaces/user.interface"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useCompanyStore } from "../company/stores/company.store"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form"
import { apiClient } from "@/utils/api-client"
import { USERS_URL } from "@/constants/routes"
interface Props {
  user: User
}

const userSchema = z.object({
  userName: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email(),
  roleType: z.string().min(1),
})

export default function EditDialog({ user }: Props) {
  const company = useCompanyStore((state) => state.currentCompany)

  const form = useForm<User>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      userName: user?.userName || "",
      name: user?.name || "",
      email: user?.email || "",
      roleType: user?.roleType || "",
    },
  })

  const onSubmit = form.handleSubmit(async (values: User) => {
    try {
      const response = await apiClient.patch(`${USERS_URL}/${user?._id}`, values)
    } catch (error) {
      console.error(error)
    }
  })

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mt-0 h-8 w-8" variant="purple" size="icon">
          <Pencil className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={onSubmit} className="grid gap-5 pt-4">
            <FormField
              name="userName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Email" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            {company?.owner?._id === user?._id && (
              <FormField
                name="roleType"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position in the company</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Position" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}

            <div className="flex gap-2 justify-end">
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>

              <Button type="submit" variant="purple">
                Save
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
