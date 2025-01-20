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
import { useTaskDialog } from "@/features/tasks/hooks/use-task-dialog"
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
import { ToggleInput } from "@/components/common/form/toggle-input"
import { UserIcon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Tooltip } from "@/components/ui/tooltip"
import { useSession } from "next-auth/react"
import { cn } from "@/lib/utils"
import { useTaskStore } from "../../store/task.store"
import DialogTaskContent from "./dialog-content"
import DialogTaskDetails from "./dialog-details"

interface Props {
  children?: React.ReactNode
  id?: string
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

export function TaskDialog({
  id,
  isOpen: externalIsOpen,
  onOpenChange,
  children,
}: Props) {
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  const isOpen = externalIsOpen ?? internalIsOpen
  const setIsOpen = onOpenChange ?? setInternalIsOpen

  const task = useTaskStore((state) => state.task)

  const { users, columns, fetchInitialData } = useTaskDialog(id)

  useEffect(() => {
    if (isOpen) fetchInitialData()
  }, [isOpen, fetchInitialData])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}

      {isOpen && task && (
        <DialogContent className="max-w-7xl flex" aria-describedby={undefined}>
          <DialogTaskContent />
          <DialogTaskDetails users={users} columns={columns} />
        </DialogContent>
      )}
    </Dialog>
  )
}
