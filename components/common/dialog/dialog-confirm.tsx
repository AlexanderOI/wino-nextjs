"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Props {
  title?: string
  description?: string
  children?: React.ReactNode
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
  onConfirm?: () => void
}

export function DialogConfirm({
  title,
  description,
  children,
  isOpen: externalIsOpen,
  onOpenChange,
  onConfirm,
}: Props) {
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  const isOpen = externalIsOpen ?? internalIsOpen
  const setIsOpen = onOpenChange ?? setInternalIsOpen

  const handleConfirm = async (event: React.MouseEvent) => {
    event.preventDefault()

    onConfirm?.()
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      {isOpen && (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title || "Confirm action"}</DialogTitle>
            <DialogDescription>
              {description || "Are you sure you want to confirm this action?"}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleConfirm}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  )
}
