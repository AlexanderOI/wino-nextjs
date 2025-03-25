"use client"

import Link from "next/link"

import { useState } from "react"
import { BookCheck, BookCopy, Loader, NotebookPen } from "lucide-react"

import { cn } from "@/lib/utils"

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TypographyP } from "@/components/ui/typography"
import { Button } from "@/components/ui/button"

import { FormSchema } from "@/features/form/interfaces/form.interface"
import { DialogConfirm } from "@/components/common/dialog/dialog-confirm"

interface Props {
  form: FormSchema
  projectFormId: string
  handleSelect: (formTaskId: string) => Promise<void>
  handleDuplicate: (formTaskId: string) => Promise<void>
  isLoading: boolean
}

export const CardForm = ({
  form,
  projectFormId,
  handleSelect,
  handleDuplicate,
  isLoading,
}: Props) => {
  const [isInternalLoading, setIsInternalLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const handleSelectInternal = async () => {
    setIsInternalLoading(true)
    await handleSelect(form._id)
    setIsInternalLoading(false)
  }

  const handleDuplicateInternal = async () => {
    setIsInternalLoading(true)
    await handleDuplicate(form._id)
    setIsInternalLoading(false)
  }

  return (
    <HoverCard openDelay={0} closeDelay={0} open={open} onOpenChange={setOpen}>
      <HoverCardTrigger asChild>
        <Card
          className={cn(
            "cursor-pointer dark:bg-purple-deep hover:border-purple-400",
            projectFormId === form._id && "border-purple-400",
            isLoading && "pointer-events-none"
          )}
        >
          <CardHeader className="bg-none pb-0 items-center justify-center">
            <CardTitle className="flex text-sm items-center">
              {!isInternalLoading ? (
                <BookCheck size={18} className="mr-2" />
              ) : (
                <Loader size={18} className="mr-2 animate-spin" />
              )}
              {form.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TypographyP className="text-sm text-center">
              <span className="font-bold">Project:</span>{" "}
              {form.projectName || "No project"}
            </TypographyP>
          </CardContent>
        </Card>
      </HoverCardTrigger>

      <HoverCardContent className="flex flex-col gap-2 bg-dark-800">
        <DialogConfirm
          title="Alert select form"
          description="If you select this form, all data in the task forms will be lost. Are you sure?"
          onConfirm={() => handleSelectInternal()}
        >
          <Button
            variant="purple"
            className="w-full"
            disabled={isLoading || !!form.projectName}
          >
            <BookCheck size={18} className="mr-2" />
            Select
          </Button>
        </DialogConfirm>

        <DialogConfirm
          title="Alert duplicate form"
          description="If you duplicate this form, all data in the task forms will be lost. Are you sure?"
          onConfirm={() => handleDuplicateInternal()}
        >
          <Button variant="purple" className="w-full" disabled={isLoading}>
            <BookCopy size={18} className="mr-2" />
            Duplicate and Select
          </Button>
        </DialogConfirm>

        <Link href={`/forms/edit/${form._id}`}>
          <Button variant="purple" className="w-full">
            <NotebookPen size={18} className="mr-2" />
            Edit
          </Button>
        </Link>
      </HoverCardContent>
    </HoverCard>
  )
}
