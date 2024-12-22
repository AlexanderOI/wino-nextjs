"use client"

import {
  Dialog,
  DialogHeader,
  DialogFooter,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
import { useUserDialog } from "@/features/user/hooks/use-user-dialog"
import { RoleCheckbox } from "./role-check-box"

interface Props {
  children?: React.ReactNode
  id?: string
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

export function DialogUser({
  id,
  isOpen: externalIsOpen,
  onOpenChange,
  children,
}: Props) {
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  const isOpen = externalIsOpen ?? internalIsOpen
  const setIsOpen = onOpenChange ?? setInternalIsOpen

  const {
    roles,
    user,
    fetchInitialData,
    handleInputChange,
    handleCheckboxChange,
    handleSubmit,
  } = useUserDialog(id)

  useEffect(() => {
    if (isOpen) fetchInitialData()
  }, [isOpen, fetchInitialData])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}

      {isOpen && roles && (
        <DialogContent className="max-w-4xl" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>{id ? "Edit User" : "Create User"}</DialogTitle>
          </DialogHeader>

          <form onSubmit={(e) => handleSubmit(e, () => setIsOpen(false))}>
            <div className="flex flex-col gap-4">
              <div className="flex gap-2">
                <Label className="w-1/2">
                  Name
                  <Input
                    type="text"
                    name="name"
                    value={user.name}
                    onChange={handleInputChange}
                  />
                </Label>

                <Label className="w-1/2">
                  User Name
                  <Input
                    type="text"
                    autoComplete="username"
                    name="userName"
                    value={user.userName}
                    onChange={handleInputChange}
                  />
                </Label>
              </div>

              <div className="flex gap-2">
                <Label className="w-1/2">
                  Email
                  <Input
                    type="email"
                    name="email"
                    value={user.email}
                    onChange={handleInputChange}
                  />
                </Label>

                <Label className="w-1/2">
                  Role Type
                  <Input
                    type="text"
                    name="roleType"
                    value={user.roleType}
                    onChange={handleInputChange}
                  />
                </Label>
              </div>

              <div className="flex gap-2">
                <Label className="w-1/2">
                  Password
                  <Input
                    autoComplete="new-password"
                    type="password"
                    name="password"
                    value={user.password}
                    onChange={handleInputChange}
                  />
                </Label>

                <Label className="w-1/2">
                  Confirm Password
                  <Input
                    autoComplete="new-password"
                    type="password"
                    name="confirmPassword"
                    value={user.confirmPassword}
                    onChange={handleInputChange}
                  />
                </Label>
              </div>

              <div className="flex flex-col gap-2">
                {roles.map((role) => (
                  <RoleCheckbox
                    key={role._id}
                    role={role}
                    isChecked={user.roles.includes(role._id)}
                    onChange={handleCheckboxChange}
                  />
                ))}
              </div>
            </div>

            <DialogFooter>
              <Button type="submit">Save</Button>

              <DialogClose asChild>
                <Button variant="secondary">Close</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      )}
    </Dialog>
  )
}
