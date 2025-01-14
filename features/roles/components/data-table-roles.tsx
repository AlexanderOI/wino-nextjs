"use client"

import { DataTable } from "@/components/ui/datatable/DataTable"
import { Roles, Permissions } from "@/types/global"
import { ColumnDef } from "@tanstack/react-table"
import { createColumn } from "@/components/ui/datatable/createColumn"
import { DialogRole } from "./dialog-role"
import { TableAction } from "@/components/common/table-action"
import { DialogDelete } from "@/components/common/dialog/dialog-delete"
import { useState } from "react"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"

const Columns = (
  handleEdit: (role: string) => void,
  handleDelete: (role: string) => void,
  permissions: Permissions[]
) => {
  const columns: ColumnDef<Roles>[] = [
    createColumn("id"),
    createColumn("name"),
    createColumn("description"),
    {
      accessorKey: "permissions",
      header: () => <div>Permissions</div>,
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {permissions
            .filter((permission) => row.original.permissions.includes(permission._id))
            .map((permission) => {
              return (
                <span
                  className="text-sm rounded-md bg-purple-light text-white p-1"
                  key={permission._id}
                >
                  {permission.name}
                </span>
              )
            })}
        </div>
      ),
    },
    {
      accessorKey: "actions",
      header: () => <div>Action</div>,
      cell: ({ row }) => (
        <TableAction>
          <DropdownMenuItem onClick={() => handleEdit(row.original._id)}>
            Editar
          </DropdownMenuItem>
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
  roles: Roles[]
  permissions: Permissions[]
}

export default function DataTableRoles({ roles, permissions }: Props) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<string>("")

  const handleEdit = (role: string) => {
    setSelectedRole(role)
    setIsEditModalOpen(true)
  }

  const handleDelete = (role: string) => {
    setSelectedRole(role)
    setIsDeleteModalOpen(true)
  }

  const handleEditModalChange = (open: boolean) => {
    setIsEditModalOpen(open)
    if (!open) {
      setSelectedRole("")
    }
  }

  return (
    <>
      <DataTable columns={Columns(handleEdit, handleDelete, permissions)} data={roles} />

      <DialogRole
        id={selectedRole}
        isOpen={isEditModalOpen}
        onOpenChange={handleEditModalChange}
      />

      <DialogDelete
        id={selectedRole}
        url="/roles"
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
      />
    </>
  )
}
