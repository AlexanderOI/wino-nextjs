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
import { PermissionCheckbox } from "@/features/roles/components/permission-check-box"
import { useEffect, useState } from "react"
import { useRoleDialog } from "@/features/roles/hooks/use-role-dialog"

interface Props {
  children?: React.ReactNode
  id?: string
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

export function DialogRole({
  id,
  isOpen: externalIsOpen,
  onOpenChange,
  children,
}: Props) {
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  const isOpen = externalIsOpen ?? internalIsOpen
  const setIsOpen = onOpenChange ?? setInternalIsOpen

  const {
    permissions,
    role,
    fetchInitialData,
    handleInputChange,
    handleCheckboxChange,
    handleSubmit,
  } = useRoleDialog(id)

  useEffect(() => {
    if (isOpen) fetchInitialData()
  }, [isOpen, fetchInitialData])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}

      {isOpen && permissions && (
        <DialogContent className="max-w-4xl" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>{id ? "Edit Role" : "Create Role"}</DialogTitle>
          </DialogHeader>

          <form onSubmit={(e) => handleSubmit(e, () => setIsOpen(false))}>
            <div className="grid gap-4">
              <Label>
                Name
                <Input name="name" value={role.name} onChange={handleInputChange} />
              </Label>

              <Label>
                Description
                <Input
                  name="description"
                  value={role.description}
                  onChange={handleInputChange}
                />
              </Label>

              <div className="flex flex-col gap-2">
                {permissions.map((perm) => (
                  <PermissionCheckbox
                    key={perm._id}
                    perm={perm}
                    isChecked={role.permissions.includes(perm._id)}
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
