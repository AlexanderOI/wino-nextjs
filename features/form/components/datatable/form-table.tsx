"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { format } from "date-fns"
import { ColumnDef } from "@tanstack/react-table"
import { BookCopy, NotebookPen, Search, Trash } from "lucide-react"

import { DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { DataTable } from "@/components/ui/datatable/DataTable"
import { TableAction } from "@/components/common/table-action"
import { DialogDelete } from "@/components/common/dialog/dialog-delete"

import { FormSchema } from "@/features/form/interfaces/form.interface"
import { duplicateFormTask } from "@/features/form/actions/form.action"
import { FieldCardHover } from "@/features/form/components/datatable/field-card-hover"

interface FormTableProps {
  forms: FormSchema[]
}

export function FormTable({ forms }: FormTableProps) {
  const router = useRouter()
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedForm, setSelectedForm] = useState<FormSchema | undefined>()

  const [filterText, setFilterText] = useState("")

  const handleDelete = (form: FormSchema) => {
    setSelectedForm(form)
    setIsDeleteModalOpen(true)
  }

  const handleDuplicate = async (form: FormSchema) => {
    const formDuplicate = await duplicateFormTask(form._id)

    toast({
      title: "Form duplicated",
      description: "Form duplicated successfully",
    })

    router.push(`/forms/edit/${formDuplicate._id}`)
  }

  return (
    <>
      <div className="relative flex-1 mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search form..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="pl-9 m-0"
        />
      </div>
      <Card>
        {forms && (
          <DataTable
            columns={Columns(handleDelete, handleDuplicate)}
            data={forms}
            options={{ inputSearch: false, valueGlobalFilter: filterText.trim() }}
          />
        )}
      </Card>

      <DialogDelete
        id={selectedForm?._id || ""}
        url="/forms-task"
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="Delete Form"
        description="Are you sure you want to delete this form?"
        toastSuccess={{
          id: "form-deleted",
          title: "Form deleted",
          description: "Form deleted successfully",
        }}
      />
    </>
  )
}

const Columns = (
  handleDelete: (form: FormSchema) => void,
  handleDuplicate: (form: FormSchema) => void
) => {
  const columns: ColumnDef<FormSchema>[] = [
    {
      id: "name",
      accessorFn: (row) => row.name,
      header: () => <div>Form Name</div>,
      cell: ({ row }) => <div>{row.original.name}</div>,
    },
    {
      id: "project",
      accessorFn: (row) => row.projectName,
      header: () => <div>Project</div>,
      cell: ({ row }) => <div>{row.original.projectName || "No assigned project"}</div>,
    },
    {
      id: "fields",
      accessorFn: (row) => `${row.fields.length}`,
      header: () => <div>Fields</div>,
      cell: ({ row }) => <FieldCardHover form={row.original} />,
    },
    {
      id: "createdAt",
      accessorFn: (row) => format(row.createdAt ?? "", "PPP"),
      header: () => <div>Created At</div>,
      cell: ({ row }) => <div>{format(row.original.createdAt ?? "", "PPP")}</div>,
    },
    {
      id: "updatedAt",
      accessorFn: (row) => format(row.updatedAt ?? "", "PPP"),
      header: () => <div>Updated At</div>,
      cell: ({ row }) => <div>{format(row.original.updatedAt ?? "", "PPP")}</div>,
    },
    {
      id: "actions",
      header: () => <div>Actions</div>,
      cell: ({ row }) => (
        <TableAction>
          <Link href={`/forms/edit/${row.original._id}`}>
            <DropdownMenuItem>
              <NotebookPen className="w-4 h-4 mr-2" />
              Edit Form
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem onClick={() => handleDuplicate(row.original)}>
            <BookCopy className="w-4 h-4 mr-2" />
            Duplicate Form
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => handleDelete(row.original)}
            className="text-red-400"
          >
            <Trash className="w-4 h-4 mr-2" />
            Delete Form
          </DropdownMenuItem>
        </TableAction>
      ),
    },
  ]

  return columns
}
