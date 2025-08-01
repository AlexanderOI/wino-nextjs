"use client"

import { useSession } from "next-auth/react"

import { CircleDot, User2 } from "lucide-react"
import { cn } from "@/lib/utils"

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { SelectItem } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { SelectSimple } from "@/components/common/form/select-simple"
import { EditableField } from "@/components/common/form/editable-field"
import { toast } from "@/components/ui/use-toast"

import { UserAvatar } from "@/features/user/components/user-avatar"
import { FieldTask } from "@/features/tasks/components/form/field-task"
import { LabelField } from "@/features/tasks/components/form/label-field"

import { ColumnTask } from "@/features/tasks/interfaces/column.interface"
import { FormSchema } from "@/features/form/interfaces/form.interface"
import { User } from "@/features/user/interfaces/user.interface"

import { useColumnStore } from "@/features/tasks/store/column.store"
import { useTaskStore } from "@/features/tasks/store/task.store"
import { createFieldTask, updateFieldTask } from "@/features/tasks/actions/task.action"

interface Props {
  users: User[]
  columns: ColumnTask[]
  formTask?: FormSchema | null
  sendChanges: (
    name: string,
    wasChanged: boolean,
    value?: string | Date | undefined
  ) => void
  hasPermissionEdit: boolean
}

export function DialogTaskDetails({
  users,
  columns,
  formTask,
  sendChanges,
  hasPermissionEdit,
}: Props) {
  const { data: session } = useSession()

  const task = useTaskStore((state) => state.task)
  const updateTaskField = useTaskStore((state) => state.updateTaskField)
  const setOneTask = useColumnStore((state) => state.setOneTask)
  const handleFieldChange = useTaskStore((state) => state.handleFieldChange)
  const formData = useTaskStore((state) => state.formData)

  if (!task) return null

  const handleSelectAssignChange = (value: string, send: boolean = false) => {
    if (!hasPermissionEdit) return
    if (value === task.assignedTo?._id) return

    const user = users.find((user) => user._id === value)
    updateTaskField("assignedTo", user)
    updateTaskField("assignedToId", value)

    if (send) {
      let newTask = useTaskStore.getState().task
      if (!newTask) return
      sendChanges("assignedToId", true, value)
      setOneTask(task.columnId, newTask, false)
    }
  }

  const handleSelectColumnChange = (name: string, value: string) => {
    const column = columns.find((column) => column._id === value)
    updateTaskField("column", column)
    updateTaskField(name, column?._id)
    setOneTask(value, task)
  }

  const saveFormTask = (name: string, wasChanged: boolean) => {
    if (!wasChanged) return

    let data = useTaskStore.getState().formData?.[name]

    const field = task.fields?.find((field) => field.idField === name)
    const newData = { idField: name, value: data?.toString() ?? "" }

    if (!field) {
      createFieldTask(task._id, newData)
    } else {
      updateFieldTask(task._id, field._id, newData)
    }

    toast({
      title: "Success",
      description: "Field updated successfully",
      duration: 3000,
    })
  }

  return (
    <div className="flex flex-col gap-2 w-5/12 border p-5 mt-16 rounded-md">
      <DialogHeader className="mb-5">
        <DialogTitle className="flex items-center gap-2">Details :</DialogTitle>
      </DialogHeader>

      <DetailItemContainer>
        <div className="flex items-center gap-2 w-4/12">
          <CircleDot className="h-4 w-4 flex-shrink-0 text-sky-500" />
          <Label>Status</Label>
        </div>

        <EditableField
          value={task.column?.name}
          className="w-7/12"
          onClose={(name, wasChanged) => sendChanges(name, wasChanged)}
          disabled={!hasPermissionEdit}
        >
          <SelectSimple
            name="columnId"
            label="Status"
            onValueChange={handleSelectColumnChange}
            value={task.column?._id}
          >
            {columns.map((column) => (
              <SelectItem key={column._id} value={column._id}>
                {column.name}
              </SelectItem>
            ))}
          </SelectSimple>
        </EditableField>
      </DetailItemContainer>

      <DetailItemContainer>
        <div className="flex items-center gap-2 w-4/12">
          <User2 className="h-4 w-4 flex-shrink-0 text-sky-500" />
          <Label>User Assigned</Label>
        </div>

        <div className="flex items-center gap-2 w-7/12">
          <Tooltip delayDuration={100}>
            <TooltipTrigger
              asChild
              className={cn(task.assignedTo ? "cursor-default" : "cursor-pointer")}
            >
              <UserAvatar
                className="cursor-pointer"
                user={task.assignedTo}
                onClick={() => handleSelectAssignChange(session?.user?._id ?? "", true)}
              />
            </TooltipTrigger>
            <TooltipContent>
              {task.assignedTo ? `Assigned to ${task.assignedTo?.name}` : "Assign me"}
            </TooltipContent>
          </Tooltip>

          <EditableField
            value={task.assignedTo?.name}
            onClose={(name, wasChanged) => sendChanges(name, wasChanged)}
            disabled={!hasPermissionEdit}
          >
            <SelectSimple
              name="assignedToId"
              onValueChange={(_, value) => handleSelectAssignChange(value)}
              value={task.assignedTo?._id ?? ""}
              placeholder="Select User"
              label="Users"
            >
              {users.map((user) => (
                <SelectItem key={user._id} value={user._id}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectSimple>
          </EditableField>
        </div>
      </DetailItemContainer>

      {formTask &&
        formTask.fields?.map((field) => (
          <DetailItemContainer key={field._id}>
            <LabelField field={field} />
            <FieldTask
              field={field}
              handleChange={handleFieldChange}
              formData={formData ?? {}}
              onClose={(name, wasChanged) => saveFormTask(name, wasChanged)}
            />
          </DetailItemContainer>
        ))}
    </div>
  )
}

export function DetailItemContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-row items-center justify-between text-nowrap gap-2">
      {children}
    </div>
  )
}
