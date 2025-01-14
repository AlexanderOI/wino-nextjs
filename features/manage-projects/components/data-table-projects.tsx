"use client"

import { DataTable } from "@/components/ui/datatable/DataTable"
import { Projects } from "@/types/global"
import { ColumnDef } from "@tanstack/react-table"
import { createColumn } from "@/components/ui/datatable/createColumn"
import { TableAction } from "@/components/common/table-action"
import { DialogDelete } from "@/components/common/dialog/dialog-delete"
import { useState } from "react"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { DialogProject } from "./dialog-project"
import { SheetTeamProject } from "./sheet-team-project"

const Columns = (
  handleEdit: (project: string) => void,
  handleDelete: (project: string) => void,
  handleUserTeamProject: (project: string) => void
) => {
  const columns: ColumnDef<Projects>[] = [
    createColumn("id"),
    createColumn("name"),
    createColumn("description"),
    createColumn("status", "Status"),
    createColumn("client", "Client"),
    {
      accessorKey: "startDate",
      header: () => <div className="text-nowrap">Start Date</div>,
      cell: ({ row }) => (
        <div>{new Date(row.original.startDate).toLocaleDateString()}</div>
      ),
    },
    {
      accessorKey: "endDate",
      header: () => <div className="text-nowrap">End Date</div>,
      cell: ({ row }) => <div>{new Date(row.original.endDate).toLocaleDateString()}</div>,
    },
    {
      accessorKey: "actions",
      header: () => <div>Action</div>,
      cell: ({ row }) => (
        <TableAction>
          <DropdownMenuItem onClick={() => handleEdit(row.original._id)}>
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleUserTeamProject(row.original._id)}>
            Team
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
  projects: Projects[]
}

export default function DataTableProjects({ projects }: Props) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isUserTeamProjectModalOpen, setIsUserTeamProjectModalOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<string>("")

  const handleEdit = (project: string) => {
    setSelectedProject(project)
    setIsEditModalOpen(true)
  }

  const handleDelete = (project: string) => {
    setSelectedProject(project)
    setIsDeleteModalOpen(true)
  }

  const handleUserTeamProject = (project: string) => {
    setSelectedProject(project)
    setIsUserTeamProjectModalOpen(true)
  }

  const handleEditModalChange = (open: boolean) => {
    setIsEditModalOpen(open)
    if (!open) {
      setSelectedProject("")
    }
  }

  return (
    <>
      <DataTable
        columns={Columns(handleEdit, handleDelete, handleUserTeamProject)}
        data={projects}
      />

      <DialogProject
        id={selectedProject}
        isOpen={isEditModalOpen}
        onOpenChange={handleEditModalChange}
      />

      <DialogDelete
        id={selectedProject}
        url="/projects"
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
      />

      <SheetTeamProject
        id={selectedProject}
        isOpen={isUserTeamProjectModalOpen}
        onOpenChange={setIsUserTeamProjectModalOpen}
      />
    </>
  )
}
