"use client"

import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  FilterFn,
} from "@tanstack/react-table"

import { Input } from "@/components/ui/input"
import { Table } from "@/components/ui/datatable/table"
import { TableColumnsView } from "./TableColumnsView"
import { useState } from "react"
import { PaginationButton } from "./PaginationButton"
import { DataTableBody } from "./DataTableBody"
import { DataTableHeader } from "./DataTableHeader"

const globalFilterFunction: FilterFn<any> = (row, columnId, filterValue) => {
  const value = row.getValue(columnId)
  return String(value).toLowerCase().includes(String(filterValue).toLowerCase())
}

export function DataTable({ data, columns }: { data: any; columns: any }) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    id: false,
  })
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState("")

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    globalFilterFn: globalFilterFunction,

    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  })

  return (
    <div className="w-full h-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter all columns..."
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
        <TableColumnsView table={table} />
      </div>
      <div className="rounded-md border h-[75%]">
        <Table>
          <DataTableHeader table={table} />
          <DataTableBody table={table} columns={columns} />
        </Table>
      </div>
      <PaginationButton table={table} />
    </div>
  )
}
