"use client"

import { useEffect, useState } from "react"

import { DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ToggleInput } from "@/components/common/form/toggle-input"

import { useTaskStore } from "@/features/tasks/store/task.store"
import { useColumnStore } from "@/features/tasks/store/column.store"

interface Props {
  sendChanges: (
    name: string,
    wasChanged: boolean,
    value?: string | Date | undefined
  ) => void
  hasPermissionEdit: boolean
}

export function DialogTaskContent({ sendChanges, hasPermissionEdit }: Props) {
  const [isUpdated, setIsUpdated] = useState({
    name: "",
    description: "",
  })

  const task = useTaskStore((state) => state.task)
  const updateTaskField = useTaskStore((state) => state.updateTaskField)
  const setOneTask = useColumnStore((state) => state.setOneTask)

  useEffect(() => {
    setIsUpdated({
      name: task?.name || "",
      description: task?.description || "",
    })
  }, [])

  if (!task) return null

  const handleInputChange = async (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    sendChange?: boolean
  ) => {
    if (!hasPermissionEdit) return

    const { name, value } = event.target

    updateTaskField(name, value)

    const isChanged =
      isUpdated.description !== task.description || isUpdated.name !== task.name

    if (sendChange && isChanged) {
      sendChanges(name, true, value)
      setOneTask(task.columnId, task, false)
      setIsUpdated((prev) => ({ ...prev, [name]: value }))
    }
  }

  return (
    <div className="w-7/12 pr-4">
      <DialogHeader className="mb-5">
        <DialogTitle className="flex items-center gap-2">
          Task:
          <ToggleInput
            name="name"
            value={task.name}
            onChange={handleInputChange}
            onBlur={(event) => handleInputChange(event, true)}
          />
        </DialogTitle>
      </DialogHeader>

      <Label>
        Description
        <Textarea
          name="description"
          value={task.description}
          onChange={handleInputChange}
          onBlur={(event) => handleInputChange(event, true)}
        />
      </Label>
    </div>
  )
}
