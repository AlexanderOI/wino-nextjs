"use client"

import { DataTable } from "@/components/ui/datatable/DataTable"
import { ColumnDef } from "@tanstack/react-table"
import { createColumn } from "@/components/ui/datatable/createColumn"
import { TableAction } from "@/components/common/table-action"
import { DialogDelete } from "@/components/common/dialog/dialog-delete"
import { useState } from "react"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { User } from "@/features/user/intefaces/user.interface"

const Columns = (handleDelete: (user: string) => void) => {
  const columns: ColumnDef<User>[] = [
    createColumn("id"),
    createColumn("name"),
    createColumn("email"),
    createColumn("role", "Role"),
    createColumn("totalTasks", "Total Tasks"),
    createColumn("totalProjects", "Total Projects"),
    {
      accessorKey: "actions",
      header: () => <div>Action</div>,
      cell: ({ row }) => (
        <TableAction>
          <DropdownMenuItem onClick={() => handleDelete(row.original._id)}>
            Eliminar
          </DropdownMenuItem>
        </TableAction>
      ),
    },
  ]

  return columns
}

interface Props {
  users: User[]
}

export default function DataTableUsersTeam({ users }: Props) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<string>("")

  const handleDelete = (user: string) => {
    setSelectedProject(user)
    setIsDeleteModalOpen(true)
  }

  return (
    <>
      <DataTable columns={Columns(handleDelete)} data={users} />

      <DialogDelete
        id={selectedProject}
        url="/users"
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
      />
    </>
  )
}
