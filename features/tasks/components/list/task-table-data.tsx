import { CalendarIcon, CircleDashed, Pencil, Text, User } from "lucide-react"
import { Column, ColumnDef, Row } from "@tanstack/react-table"
import { format } from "date-fns"

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { TableAction } from "@/components/common/table-action"

import { FormField, FormSchema } from "@/features/form/interfaces/form.interface"
import { Project } from "@/features/project/interfaces/project.interface"
import { Task } from "@/features/tasks/interfaces/task.interface"

import { ColumnTaskCount } from "@/features/tasks/action/column.action"

export const getTaskTableData = (
  columnTaskCount: ColumnTaskCount[],
  project: Project,
  formTask: FormSchema | null
): ColumnDef<Task>[] => {
  const columns: ColumnDef<Task>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-0.5"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-0.5 m-2"
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 40,
    },
    {
      id: "task",
      accessorFn: (row) => `${row.name}`,
      header: ({ column }) => <DataTableColumnHeader title="Task" column={column} />,
      cell: ({ row }) => (
        <div className="flex flex-col gap-2 w-full">
          <span className="font-semibold truncate w-[250px]">{row.original.name}</span>
          <span className="text-sm text-gray-400 truncate w-[250px]">
            {row.original.description}
          </span>
        </div>
      ),
      meta: {
        label: "Title",
        placeholder: "Search titles or description...",
        variant: "text",
        icon: Text,
      },
      enableColumnFilter: true,
    },
    {
      id: "assignedTo",
      accessorKey: "assignedTo",
      header: ({ column }) => (
        <DataTableColumnHeader title="Assigned To" column={column} />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={row.original.assignedTo?.avatar || ""} />
            <AvatarFallback>{row.original.assignedTo?.name[0] || "N"}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold flex items-center gap-2">
              {row.original.assignedTo?.name || "No assigned"}
            </div>
            <div className="text-sm text-gray-400">
              {row.original.assignedTo?.email || "No email"}
            </div>
          </div>
        </div>
      ),
      meta: {
        label: "Assigned To",
        variant: "multiSelect",
        options: project?.members?.map((member) => ({
          render: (
            <Avatar className="w-6 h-6">
              <AvatarImage src={member.avatar || ""} />
              <AvatarFallback>{member.name[0] || "N"}</AvatarFallback>
            </Avatar>
          ),
          label: member.name,
          value: member._id,
        })),
        icon: User,
        numberCollapse: 7,
      },
      enableColumnFilter: true,
    },
    {
      id: "status",
      accessorKey: "status",
      header: ({ column }) => <DataTableColumnHeader title="Status" column={column} />,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div
            className="p-2 rounded-full"
            style={{ backgroundColor: row.original.column.color }}
          />
          <Badge variant="outline" className="p-2 rounded-md">
            {row.original.column.name}
          </Badge>
        </div>
      ),
      meta: {
        label: "Status",
        variant: "multiSelect",
        options: columnTaskCount.map((status) => ({
          label: status.name,
          value: status._id,
          count: status.tasksCount,
          icon: CircleDashed,
        })),
        icon: CircleDashed,
      },
      enableColumnFilter: true,
    },
    {
      id: "createdAt",
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader title="Created At" column={column} />
      ),
      cell: ({ row }) => (
        <div className="text-center">{format(row.original.createdAt, "PPP")}</div>
      ),
      meta: {
        label: "Created At",
        variant: "dateRange",
        icon: CalendarIcon,
      },
      enableColumnFilter: true,
    },
    ...createTaskFieldsColumns(formTask),
    {
      accessorKey: "actions",
      header: () => <div></div>,
      cell: ({ row }) => (
        <div>No action</div>
        // <TableAction>
        //   <Button variant="purple">
        //     <Pencil className="w-4 h-4 mr-2" />
        //     Edit Task
        //   </Button>
        // </TableAction>
      ),
      size: 40,
      enableSorting: false,
    },
  ]

  return columns
}

export const createTaskFieldsColumns = (formTask: FormSchema | null) => {
  if (!formTask) return []

  return formTask.fields.map((field) => ({
    id: field.label,
    accessorKey: field.label,
    header: ({ column }: { column: Column<Task> }) => (
      <DataTableColumnHeader title={field.label} column={column} />
    ),
    cell: ({ row }: { row: Row<Task> }) => (
      <div>{createCellContent(row.original, field)}</div>
    ),
    enableColumnFilter: true,
    enableSorting: false,
  }))
}

export const createCellContent = (task: Task, field: FormField) => {
  const fieldValue = task.fields?.find((f) => f.idField === field._id)?.value
  if (field.type === "text") {
    return fieldValue ? fieldValue : "No text"
  }
  if (field.type === "date") {
    return fieldValue ? format(fieldValue, "PPP") : "No date"
  }
  if (field.type === "number") {
    return fieldValue ? fieldValue : "No number"
  }
  if (field.type === "select") {
    const option = field.options?.find((opt) => opt._id === fieldValue)
    return option?.value || "No select"
  }
  if (field.type === "email") {
    return fieldValue ? fieldValue : "No email"
  }
}
