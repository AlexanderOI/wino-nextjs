"use client"

import { DataTable } from "@/components/ui/datatable/DataTable"
import { Roles } from "@/types/global"
import { ColumnDef } from "@tanstack/react-table"
import { createColumn } from "@/components/ui/datatable/createColumn"
import { DialogRole } from "./dialog-role"
import { TableAction } from "@/components/common/table-action"
import { DropdownActionItem } from "@/components/common/dropdown-action-Item"
import { DialogDelete } from "@/components/common/dialog/dialog-delete"
import { useState } from "react"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"

const Columns = (
  handleEdit: (role: string) => void,
  handleDelete: (role: string) => void
) => {
  const columns: ColumnDef<Roles>[] = [
    createColumn("id"),
    createColumn("name"),
    createColumn("description"),
    createColumn("createdBy", "Created By"),
    createColumn("updatedBy", "Updated By"),
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
}

export default function DataTableRoles({ roles }: Props) {
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
      <DataTable columns={Columns(handleEdit, handleDelete)} data={roles} />

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
