"use client"

import { FileText, CircleDot } from "lucide-react"

import { EditableField } from "@/components/common/form/EditableField"
import { DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

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
  const task = useTaskStore((state) => state.task)
  const updateTaskField = useTaskStore((state) => state.updateTaskField)
  const setOneTask = useColumnStore((state) => state.setOneTask)

  if (!task) return null

  const handleInputChange = async (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    sendChange?: boolean
  ) => {
    if (!hasPermissionEdit) return

    const { name, value } = event.target

    updateTaskField(name, value)

    if (sendChange) {
      sendChanges(name, true, value)
      setOneTask(task.columnId, task, false)
    }
  }

  return (
    <div className="w-7/12 pr-4">
      <DialogHeader className="mb-5">
        <DialogTitle className="flex items-center gap-2">
          <div className="flex flex-row gap-2">
            <CircleDot className="w-4 h-4 text-purple-500" />
            Task:
          </div>
          <EditableField
            value={task.name}
            className="w-full"
            onClose={(name, wasChanged) => sendChanges(name, wasChanged)}
            disabled={!hasPermissionEdit}
          >
            <Input name="name" value={task.name} onChange={handleInputChange} />
          </EditableField>
        </DialogTitle>
      </DialogHeader>

      <Label className="mb-2 flex flex-row gap-2">
        <FileText className="w-4 h-4 text-purple-500" />
        Description
      </Label>

      <EditableField
        value={task.description}
        className="w-full h-auto"
        onClose={(name, wasChanged) => sendChanges(name, wasChanged)}
        disabled={!hasPermissionEdit}
        viewElement={
          <div className="text-sm">{task.description || "Write a description"}</div>
        }
      >
        <Textarea
          aria-label="Description"
          name="description"
          value={task.description}
          onChange={handleInputChange}
        />
      </EditableField>
    </div>
  )
}
