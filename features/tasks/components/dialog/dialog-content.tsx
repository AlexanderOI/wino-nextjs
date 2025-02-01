"use client"

import { DialogTitle } from "@/components/ui/dialog"
import { DialogHeader } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ToggleInput } from "@/components/common/form/toggle-input"

import { useTaskStore } from "../../store/task.store"
import { Task } from "../../interfaces/task.interface"

interface Props {
  sendChanges: (
    name: string,
    wasChanged: boolean,
    value?: string | Date | undefined
  ) => void
}

export default function DialogTaskContent({ sendChanges }: Props) {
  const task = useTaskStore((state) => state.task)
  const updateTaskField = useTaskStore((state) => state.updateTaskField)

  if (!task) return null

  const handleInputChange = async (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    sendChange?: boolean
  ) => {
    const { name, value } = event.target
    if (value === task[name as keyof Task]) return

    updateTaskField(name, value)

    if (sendChange) {
      sendChanges(name, true, value)
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
