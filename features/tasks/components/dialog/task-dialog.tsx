"use client"

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { useEffect, useState } from "react"
import { useTaskDialog } from "@/features/tasks/hooks/use-task-dialog"
import { useTaskStore } from "../../store/task.store"
import DialogTaskContent from "./dialog-content"
import DialogTaskDetails from "./dialog-details"
import { SkeletonTaskDialog } from "../skeleton/skeleton-task-dialog"

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

  const { users, columns, loading, fetchInitialData } = useTaskDialog(id)

  useEffect(() => {
    if (isOpen) fetchInitialData()
  }, [isOpen, fetchInitialData])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}

      {isOpen && task && (
        <DialogContent
          className="max-w-7xl min-h-[400px] flex"
          aria-describedby={undefined}
        >
          {loading ? (
            <SkeletonTaskDialog />
          ) : (
            <>
              <DialogTaskContent />
              <DialogTaskDetails users={users} columns={columns} />
            </>
          )}
        </DialogContent>
      )}
    </Dialog>
  )
}
