"use client"
import { useEffect, useState } from "react"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCompanyDialog } from "../hooks/use-company-dialog"

interface Props {
  children: React.ReactNode
  id?: string
}

export function DialogCompany({ children, id }: Props) {
  const [isOpen, setIsOpen] = useState(false)

  const { company, fetchInitialData, handleInputChange, handleSubmit } =
    useCompanyDialog(id)

  useEffect(() => {
    if (isOpen) fetchInitialData()
  }, [isOpen, fetchInitialData])

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        {isOpen && (
          <DialogContent className="" aria-describedby={undefined}>
            <DialogHeader>
              <DialogTitle>Create Company</DialogTitle>
            </DialogHeader>
            <form onSubmit={(e) => handleSubmit(e, () => setIsOpen(false))}>
              <div className="flex items-center space-x-2">
                <div className="grid flex-1 gap-2">
                  <Label>
                    Name
                    <Input
                      name="name"
                      value={company.name || ""}
                      onChange={handleInputChange}
                    />
                  </Label>

                  <Label>
                    Address
                    <Input
                      name="address"
                      value={company.address || ""}
                      onChange={handleInputChange}
                    />
                  </Label>
                </div>
              </div>

              <DialogFooter className="mt-4">
                <Button type="submit">Save</Button>
                <DialogClose asChild>
                  <Button variant="secondary">Close</Button>
                </DialogClose>
              </DialogFooter>
            </form>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}
