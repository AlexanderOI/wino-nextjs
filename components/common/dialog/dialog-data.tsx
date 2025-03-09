"use client"
import { useState } from "react"

import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { DialogProps } from "@/types/global"

export function DialogData({
  isOpen: externalIsOpen,
  onOpenChange,
  children,
  content,
}: DialogProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  const isOpen = externalIsOpen ?? internalIsOpen
  const setIsOpen = onOpenChange ?? setInternalIsOpen

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}

      {isOpen && content}
    </Dialog>
  )
}
