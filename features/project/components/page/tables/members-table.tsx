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

interface Props {
  tasks: Task[]
  members: User[]
}

export default function MembersTable({ tasks, members }: Props) {
  return <DataTable columns={Columns(tasks)} data={members} />
}

const Columns = (tasks: Task[]) => {
  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "member",
      header: () => <div>Member</div>,
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={row.original.avatar} />
            <AvatarFallback>{row.original.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{row.original.name}</p>
            <p className="text-sm text-muted-foreground">{row.original.email}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "role",
      header: () => <div className="text-center">Role</div>,
      cell: ({ row }) => <Badge variant="secondary">{row.original.roleType}</Badge>,
    },
    {
      accessorKey: "totalTasks",
      header: () => <div className="text-center">Total Tasks</div>,
      cell: ({ row }) => (
        <div className="text-center">
          {tasks.filter((task) => task.assignedTo?._id === row.original._id).length}
        </div>
      ),
    },
    // {
    //   accessorKey: "actions",
    //   header: () => <div>Action</div>,
    //   cell: ({ row }) => (
    //     <TableAction>
    //       <DropdownMenuItem onClick={() => console.log(row.original._id)}>
    //         Eliminar
    //       </DropdownMenuItem>
    //     </TableAction>
    //   ),
    // },
  ]

  return columns
}
