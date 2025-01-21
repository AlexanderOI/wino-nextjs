import { DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useTaskStore } from "../../store/task.store"
import { ColumnTask } from "@/app/tasks/[projectId]/page"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { useSession } from "next-auth/react"
import { User } from "@/features/user/intefaces/user.interface"
import SelectSimple from "@/components/common/form/select-simple"
import { DatePicker } from "@/components/ui/date-picker"
import { useToast } from "@/components/ui/use-toast"
import apiClient from "@/utils/api-client"

interface Props {
  users: User[]
  columns: ColumnTask[]
}

export default function DialogTaskDetails({ users, columns }: Props) {
  const toast = useToast()
  const task = useTaskStore((state) => state.task)
  const updateTaskField = useTaskStore((state) => state.updateTaskField)
  const { data: session } = useSession()

  if (!task) return null

  const handleSelectAssignChange = (value: string) => {
    if (value === task.assignedTo?._id) return

    const user = users.find((user) => user._id === value)
    updateTaskField("assignedTo", user)
    sendChanges("assignedTo", value)
  }

  const handleSelectColumnChange = (name: string, value: string) => {
    const column = columns.find((column) => column._id === value)
    updateTaskField(name, column)
    sendChanges(name, value)
  }

  const handleSelectDateChange = (
    name: string,
    value: Date | undefined,
    sendChange?: boolean
  ) => {
    updateTaskField(name, value)
    if (sendChange) {
      sendChanges(name, value)
    }
  }

  const sendChanges = async (name: string, value: string | Date | undefined) => {
    const response = await apiClient.patch(`/tasks/${task._id}`, {
      [name]: value,
    })

    if (response.status === 200) {
      toast.toast({
        title: "Task updated successfully",
        description: "Task updated successfully",
      })
    } else {
      toast.toast({
        title: "Failed to update task",
        description: "Failed to update task",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex flex-col gap-2 w-5/12">
      <DialogHeader className="mb-5">
        <DialogTitle className="flex items-center gap-2">Details</DialogTitle>
      </DialogHeader>

      <DetailItemContainer>
        <Label>Status</Label>

        <SelectSimple
          name="columnId"
          label="Status"
          onValueChange={handleSelectColumnChange}
          value={task.columnId._id}
          className="w-7/12"
        >
          {columns.map((column) => (
            <SelectItem key={column._id} value={column._id}>
              {column.name}
            </SelectItem>
          ))}
        </SelectSimple>
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
        </div>
      </DetailItemContainer>

      <DetailItemContainer>
        <Label>Start Date</Label>

        <DatePicker
          name="startDate"
          className="w-7/12"
          selected={task.startDate}
          onSelect={handleSelectDateChange}
          onClose={() => handleSelectDateChange("startDate", task.startDate, true)}
        />
      </DetailItemContainer>

      <DetailItemContainer>
        <Label>End Date</Label>

        <DatePicker
          name="endDate"
          className="w-7/12"
          selected={task.endDate}
          onSelect={handleSelectDateChange}
          widthMinutes
          onClose={() => handleSelectDateChange("endDate", task.endDate, true)}
        />
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
