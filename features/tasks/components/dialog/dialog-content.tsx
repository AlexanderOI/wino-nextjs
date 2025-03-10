"use client"

import { DialogTitle } from "@/components/ui/dialog"
import { DialogHeader } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ToggleInput } from "@/components/common/form/toggle-input"

import { useTaskStore } from "../../store/task.store"
import { useState } from "react"
import { useColumnStore } from "../../store/column.store"
import { canPermission } from "@/features/permission/utils/can-permission"
import { PERMISSIONS } from "@/features/permission/constants/permissions"

interface Props {
  sendChanges: (
    name: string,
    wasChanged: boolean,
    value?: string | Date | undefined
  ) => void
}

export default function DialogTaskContent({ sendChanges }: Props) {
  const [isUpdated, setIsUpdated] = useState({
    name: false,
    description: false,
  })
  const task = useTaskStore((state) => state.task)
  const updateTaskField = useTaskStore((state) => state.updateTaskField)
  const setOneTask = useColumnStore((state) => state.setOneTask)

  if (!task) return null

  const handleInputChange = async (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    sendChange?: boolean
  ) => {
    const { name, value } = event.target
    const hasPermission = await canPermission([PERMISSIONS.EDIT_TASK])
    if (!hasPermission) return

    updateTaskField(name, value)

    setIsUpdated((prev) => ({ ...prev, [name]: true }))

    if (sendChange && isUpdated[name as keyof typeof isUpdated]) {
      sendChanges(name, true, value)
      setIsUpdated((prev) => ({ ...prev, [name]: false }))
      setOneTask(task.columnId, task, false)
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
