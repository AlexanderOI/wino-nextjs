"use client"

import { TableAction } from "@/components/common/table-action"
import { AvatarImage } from "@/components/ui/avatar"
import { Avatar } from "@/components/ui/avatar"
import { AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/ui/datatable/DataTable"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Task } from "@/features/tasks/interfaces/task.interface"
import { User } from "@/features/user/interfaces/user.interface"
import { ColumnDef } from "@tanstack/react-table"
import { format, isValid } from "date-fns"

interface Props {
  tasks: Task[]
}

export default function TasksTable({ tasks }: Props) {
  return <DataTable columns={Columns()} data={tasks} />
}

const Columns = () => {
  const columns: ColumnDef<Task>[] = [
    {
      accessorKey: "task",
      header: () => <div>Task</div>,
      cell: ({ row }) => (
        <div className="">
          <p>{row.original.name}</p>
        </div>
      ),
    },
    {
      accessorKey: "assignedTo",
      header: () => <div>Assigned To</div>,
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={row.original.assignedTo?.avatar || "/avatar.png"} />
            <AvatarFallback>{row.original.assignedTo?.name[0] || ""}</AvatarFallback>
          </Avatar>
          <span>{row.original.assignedTo?.name || "No assigned"}</span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: () => <div>Status</div>,
      cell: ({ row }) => (
        <div>
          <Badge variant="secondary">{row.original.column.name}</Badge>
        </div>
      ),
    },
    {
      accessorKey: "dueDate",
      header: () => <div>Due Date</div>,
      cell: ({ row }) => (
        <div>
          {isValid(row.original.endDate)
            ? format(row.original.endDate, "MMM dd, yyyy")
            : "No end date"}
        </div>
      ),
    },
  ]

  return columns
}
