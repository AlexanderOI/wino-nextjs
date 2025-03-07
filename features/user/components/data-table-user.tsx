"use client"

import { DataTable } from "@/components/ui/datatable/DataTable"
import { ColumnDef } from "@tanstack/react-table"
import { createColumn } from "@/components/ui/datatable/createColumn"
import { TableAction } from "@/components/common/table-action"
import { DialogDelete } from "@/components/common/dialog/dialog-delete"
import { useState } from "react"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { DialogUser } from "./dialog-user"
import { User } from "../interfaces/user.interface"
import { PermissionClient } from "@/features/permission/permission-client"
import { PERMISSIONS } from "@/features/permission/constants/permissions"

const Columns = (
  handleEdit: (role: string) => void,
  handleDelete: (role: string) => void
) => {
  const columns: ColumnDef<User>[] = [
    createColumn("id"),
    createColumn("name"),
    createColumn("userName", "Username"),
    createColumn("email"),
    {
      accessorKey: "actions",
      header: () => <div>Action</div>,
      cell: ({ row }) => (
        <TableAction>
          <PermissionClient permissions={[PERMISSIONS.EDIT_USER]}>
            <DropdownMenuItem onClick={() => handleEdit(row.original._id)}>
              Editar
            </DropdownMenuItem>
          </PermissionClient>

          <PermissionClient permissions={[PERMISSIONS.DELETE_USER]}>
            <DropdownMenuItem onClick={() => handleDelete(row.original._id)}>
              Eliminar
            </DropdownMenuItem>
          </PermissionClient>
        </TableAction>
      ),
    },
  ]

  return columns
}

interface Props {
  users: User[]
}

export function DataTableUsers({ users }: Props) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<string>("")

  const handleEdit = (user: string) => {
    setSelectedUser(user)
    setIsEditModalOpen(true)
  }

  const handleDelete = (user: string) => {
    setSelectedUser(user)
    setIsDeleteModalOpen(true)
  }

  const handleEditModalChange = (open: boolean) => {
    setIsEditModalOpen(open)
    if (!open) {
      setSelectedUser("")
    }
  }

  return (
    <>
      <DataTable columns={Columns(handleEdit, handleDelete)} data={users} />

      <DialogUser
        id={selectedUser}
        isOpen={isEditModalOpen}
        onOpenChange={handleEditModalChange}
      />

      <DialogDelete
        id={selectedUser}
        url="/user"
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
      />
    </>
  )
}
