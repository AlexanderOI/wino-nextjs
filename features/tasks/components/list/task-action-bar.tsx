"use client"

import type { Table } from "@tanstack/react-table"
import { Trash2 } from "lucide-react"

import {
  DataTableActionBar,
  DataTableActionBarAction,
  DataTableActionBarSelection,
} from "@/components/data-table/data-table-action-bar"
import { Separator } from "@/components/ui/separator"

import { DataTableRowActionMany } from "@/types/data-table"

import { Task } from "@/features/tasks/interfaces/task.interface"

interface TasksTableActionBarProps {
  table: Table<Task>
  setRowActionMany: (action: DataTableRowActionMany<Task> | null) => void
}

export function TasksTableActionBar({
  table,
  setRowActionMany,
}: TasksTableActionBarProps) {
  const rows = table.getFilteredSelectedRowModel().rows

  return (
    <DataTableActionBar table={table} visible={rows.length > 0}>
      <DataTableActionBarSelection table={table} />
      <Separator
        orientation="vertical"
        className="hidden data-[orientation=vertical]:h-5 sm:block"
      />
      <div className="flex items-center gap-1.5">
        <DataTableActionBarAction
          size="icon"
          tooltip="Delete tasks"
          onClick={() =>
            setRowActionMany({
              rows: rows.map((row) => row.original),
              variant: "delete-many",
            })
          }
        >
          <Trash2 />
        </DataTableActionBarAction>
      </div>
    </DataTableActionBar>
  )
}
