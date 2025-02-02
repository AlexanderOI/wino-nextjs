"use client"

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
import { useToast } from "@/components/ui/use-toast"
import apiClient from "@/utils/api-client"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface Props {
  id: string
  url: string
  title?: string
  description?: string
  children?: React.ReactNode
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

export function DialogDelete({
  id,
  url,
  title,
  description,
  children,
  isOpen: externalIsOpen,
  onOpenChange,
}: Props) {
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  const isOpen = externalIsOpen ?? internalIsOpen
  const setIsOpen = onOpenChange ?? setInternalIsOpen

  const { toast } = useToast()
  const router = useRouter()

  const handleDelete = async (event: React.MouseEvent) => {
    event.preventDefault()

    try {
      const res = await apiClient.delete(`${url}/${id}`)

      if (res.status === 200) {
        router.refresh()
        toast({
          title: "Deleted",
          description: "Item has been deleted successfully",
          duration: 1500,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive",
        duration: 1500,
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      {isOpen && (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title || "Delete"}</DialogTitle>
            <DialogDescription>
              {description || "Are you sure you want to delete this?"}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  )
}
