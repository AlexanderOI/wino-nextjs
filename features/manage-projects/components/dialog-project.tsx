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
import { useProjectDialog } from "@/features/manage-projects/hooks/use-project-dialog"
import { Textarea } from "@/components/ui/textarea"
import { DatePicker } from "@/components/ui/date-picker"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Props {
  children?: React.ReactNode
  id?: string
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

const statusOptions = ["Pending", "In Progress", "Completed"]

export function DialogProject({
  id,
  isOpen: externalIsOpen,
  onOpenChange,
  children,
}: Props) {
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  const isOpen = externalIsOpen ?? internalIsOpen
  const setIsOpen = onOpenChange ?? setInternalIsOpen

  const {
    project,
    users,
    fetchInitialData,
    handleInputChange,
    handleSubmit,
    handleSelectDate,
    handleSelectChange,
  } = useProjectDialog(id)

  useEffect(() => {
    if (isOpen) fetchInitialData()
  }, [isOpen, fetchInitialData])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}

      {isOpen && project && (
        <DialogContent className="max-w-4xl" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>{id ? "Edit Project" : "Create Project"}</DialogTitle>
          </DialogHeader>

          <form onSubmit={(e) => handleSubmit(e, () => setIsOpen(false))}>
            <div className="grid gap-4">
              <div className="flex gap-4">
                <Label className="w-2/3">
                  Name
                  <Input name="name" value={project.name} onChange={handleInputChange} />
                </Label>

                <Label className="w-1/4">
                  Owner
                  <Select
                    name="owner"
                    onValueChange={(value) => handleSelectChange(value, "owner")}
                    value={project.owner}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Owner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Users</SelectLabel>
                        {users.map((user) => (
                          <SelectItem key={user._id} value={user._id}>
                            {user.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Label>

                <Label className="w-1/4">
                  Status
                  <Select
                    name="status"
                    onValueChange={(value) => handleSelectChange(value, "status")}
                    value={project.status}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Status</SelectLabel>
                        {statusOptions.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Label>
              </div>

              <Label>
                Description
                <Textarea
                  name="description"
                  value={project.description}
                  onChange={handleInputChange}
                />
              </Label>

              <div className="flex gap-4">
                <Label className="w-2/3">
                  Client
                  <Input
                    name="client"
                    value={project.client}
                    onChange={handleInputChange}
                  />
                </Label>

                <Label className="flex flex-col">
                  Start Date
                  <DatePicker
                    selected={project.startDate}
                    onSelect={(date) => handleSelectDate(date, "startDate")}
                  />
                </Label>

                <Label className="flex flex-col">
                  End Date
                  <DatePicker
                    selected={project.endDate}
                    onSelect={(date) => handleSelectDate(date, "endDate")}
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
  )
}
