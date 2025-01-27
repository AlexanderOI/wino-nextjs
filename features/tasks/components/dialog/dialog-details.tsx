import { DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { SelectItem } from "@/components/ui/select"
import { useTaskStore } from "../../store/task.store"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { useSession } from "next-auth/react"
import { User } from "@/features/user/interfaces/user.interface"
import SelectSimple from "@/components/common/form/select-simple"
import { DatePicker } from "@/components/ui/date-picker"
import { EditableField } from "@/components/common/form/EditableField"
import { format, isValid } from "date-fns"
import { ColumnTask } from "@/features/tasks/interfaces/column.interface"

interface Props {
  users: User[]
  columns: ColumnTask[]
  sendChanges: (
    name: string,
    value: string | Date | undefined,
    wasChanged: boolean
  ) => void
}

export default function DialogTaskDetails({ users, columns, sendChanges }: Props) {
  const task = useTaskStore((state) => state.task)
  const updateTaskField = useTaskStore((state) => state.updateTaskField)
  const { data: session } = useSession()

  if (!task) return null

  const handleSelectAssignChange = (value: string) => {
    if (value === task.assignedTo?._id) return

    const user = users.find((user) => user._id === value)
    updateTaskField("assignedTo", user)
  }

  const handleSelectColumnChange = (name: string, value: string) => {
    const column = columns.find((column) => column._id === value)
    updateTaskField(name, column)
  }

  return (
    <div className="flex flex-col gap-2 w-5/12 border p-5 mt-16 rounded-md">
      <DialogHeader className="mb-5">
        <DialogTitle className="flex items-center gap-2">Details :</DialogTitle>
      </DialogHeader>

      <DetailItemContainer>
        <Label>Status</Label>

        <EditableField
          value={task.column.name}
          className="w-7/12"
          onClose={(name, wasChanged) => sendChanges(name, task.column._id, wasChanged)}
        >
          <SelectSimple
            name="columnId"
            label="Status"
            onValueChange={handleSelectColumnChange}
            value={task.column._id}
            className=""
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
        <Label>User Assigned</Label>

        <div className="flex items-center gap-2 w-7/12">
          <Tooltip delayDuration={100}>
            <TooltipTrigger
              asChild
              className={cn(task.assignedTo ? "cursor-default" : "cursor-pointer")}
            >
              <Avatar
                className="w-7 h-7 "
                onClick={() => handleSelectAssignChange(session?.user?._id ?? "")}
              >
                <AvatarImage src={"/avatar.png"} />
                <AvatarFallback>{task.assignedTo?.name}</AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              {task.assignedTo ? `Assigned to ${task.assignedTo?.name}` : "Assign me"}
            </TooltipContent>
          </Tooltip>

          <EditableField
            value={task.assignedTo?.name}
            onClose={(name, wasChanged) =>
              sendChanges(name, task.assignedTo?._id, wasChanged)
            }
          >
            <SelectSimple
              name="assignedTo"
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

      <DetailItemContainer>
        <Label>Start Date</Label>

        <EditableField
          value={
            task.startDate && isValid(task.startDate)
              ? format(task.startDate, "PPP HH:mm")
              : "Pick a date"
          }
          onClose={(name, wasChanged) => sendChanges(name, task.startDate, wasChanged)}
          className="w-7/12"
        >
          <DatePicker
            name="startDate"
            selected={task.startDate}
            onSelect={updateTaskField}
            widthMinutes
          />
        </EditableField>
      </DetailItemContainer>

      <DetailItemContainer>
        <Label>End Date</Label>

        <EditableField
          value={
            task.endDate && isValid(task.endDate)
              ? format(task.endDate, "PPP HH:mm")
              : "Pick a date"
          }
          onClose={(name, wasChanged) => sendChanges(name, task.endDate, wasChanged)}
          className="w-7/12"
        >
          <DatePicker
            name="endDate"
            selected={task.endDate}
            onSelect={updateTaskField}
            widthMinutes
          />
        </EditableField>
      </DetailItemContainer>
    </div>
  )
}

function DetailItemContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-row items-center justify-between text-nowrap gap-2">
      {children}
    </div>
  )
}
