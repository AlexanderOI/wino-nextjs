"use client"

import { useState } from "react"
import { JSONContent } from "@tiptap/react"
import { FileText, CircleDot } from "lucide-react"

import { User } from "@/features/user/interfaces/user.interface"

import { Editor, EditorViewer } from "@/components/editor/editor"
import { EditableField } from "@/components/common/form/EditableField"
import { DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { Comments } from "@/features/tasks/components/comments/comments"
import { useTaskStore } from "@/features/tasks/store/task.store"
import { useColumnStore } from "@/features/tasks/store/column.store"

interface Props {
  sendChanges: (
    name: string,
    wasChanged: boolean,
    value?: string | Date | JSONContent | undefined
  ) => void
  hasPermissionEdit: boolean
  users: User[]
}

export function DialogTaskContent({ sendChanges, hasPermissionEdit, users }: Props) {
  const task = useTaskStore((state) => state.task)
  const updateTaskField = useTaskStore((state) => state.updateTaskField)
  const setOneTask = useColumnStore((state) => state.setOneTask)

  const [isSaving, setIsSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [description, setDescription] = useState<JSONContent | null>(
    task?.description || null
  )

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

  const handleUpdate = (value: JSONContent) => {
    setIsSaving(true)
    setDescription(value)
  }

  const handleSave = () => {
    if (!description) return
    sendChanges("description", true, description)
    setOneTask(task.columnId, task, false)
    setIsSaving(false)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setDescription(task.description)
    setIsSaving(false)
    setIsEditing(false)
  }

  return (
    <div className="w-7/12 pr-4 overflow-y-auto">
      <DialogHeader className="mb-5 sticky top-1 bg-background z-10">
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

      <div className="flex flex-col gap-2">
        {isEditing ? (
          <Editor
            users={users}
            value={description || ""}
            onUpdate={handleUpdate}
            className="min-h-[200px] pb-4"
            saveProps={{
              onClick: handleSave,
              className: "bg-accent/80 hover:bg-accent/90 hover:text-accent-foreground",
              disabled: !isSaving,
            }}
            cancelProps={{
              onClick: handleCancel,
              className: "bg-red-800/80 hover:bg-red-800 hover:text-white ml-auto",
            }}
          />
        ) : (
          <div onClick={() => setIsEditing(true)}>
            <EditorViewer
              content={description || ""}
              users={users}
              className="min-h-[200px] pb-4"
            />
          </div>
        )}
      </div>

      <Comments taskId={task._id} users={users} />
    </div>
  )
}
