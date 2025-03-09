"use client"

import { useRouter } from "next/navigation"

import { useEffect, useRef } from "react"
import { useQuery } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { apiClient } from "@/utils/api-client"
import { Company } from "@/features/company/interfaces/company.interface"

import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormField,
  FormLabel,
  FormControl,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { toast } from "@/components/ui/use-toast"

import { getCompanyById } from "@/features/company/actions/action"
import { useCompanyStore } from "@/features/company/stores/company.store"

const companySchema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
})

export function DialogCompany({ id }: { id?: string }) {
  const router = useRouter()
  const setCompanies = useCompanyStore((state) => state.setCompanies)

  const refClose = useRef<HTMLButtonElement>(null)

  const { data: company } = useQuery({
    queryKey: ["company", id],
    queryFn: () => getCompanyById(id),
  })

  const form = useForm<z.infer<typeof companySchema>>({
    defaultValues: {
      name: "",
      address: "",
    },
    resolver: zodResolver(companySchema),
  })

  useEffect(() => {
    if (!company) return

    const { name, address } = company
    form.reset({ name, address })
  }, [company])

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      let newData

      if (id) {
        newData = await apiClient.patch<Company>(`company/${id}`, data)
      } else {
        newData = await apiClient.post<Company>("/company", data)
      }

      setCompanies(newData.data)

      toast({
        title: "Company Saved",
        description: id ? "Company updated successfully" : "Company created successfully",
        duration: 1000,
      })

      router.refresh()
      refClose.current?.click()
    } catch (error) {
      toast({
        title: "Error",
        description: "Error saving company",
        duration: 1000,
      })
    }
  })

  return (
    <DialogContent className="" aria-describedby={undefined}>
      <DialogHeader>
        <DialogTitle>{id ? "Edit Company" : "Create Company"}</DialogTitle>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={handleSubmit}>
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button ref={refClose} variant="secondary">
                Close
              </Button>
            </DialogClose>

            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  )
}
