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
  ColumnDef,
  GlobalFilterColumn,
} from "@tanstack/react-table"

import { Input } from "@/components/ui/input"
import { Table } from "@/components/ui/datatable/table"
import { TableColumnsView } from "./TableColumnsView"
import { useState } from "react"
import { PaginationTableButton } from "./PaginationButton"
import { DataTableBody } from "./DataTableBody"
import { DataTableHeader } from "./DataTableHeader"
import { User } from "../../../features/user/interfaces/user.interface"

type DatatableOptions = {
  inputSearch?: boolean
  valueGlobalFilter?: string
}

interface Props<T> {
  data: T[]
  columns: ColumnDef<T>[]
  options?: DatatableOptions
}

const defaultOptions: DatatableOptions = {
  inputSearch: true,
  valueGlobalFilter: "",
}

export function DataTable<T>({ data, columns, options = defaultOptions }: Props<T>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    id: false,
  })
  const [rowSelection, setRowSelection] = useState({})
  const [globalInternalFilter, setGlobalInternalFilter] = useState("")

  let globalFilter = options?.valueGlobalFilter || globalInternalFilter

  const table = useReactTable<T>({
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
      {options?.inputSearch && (
        <div className="flex items-center py-4">
          <Input
            placeholder="Filter all columns..."
            value={globalInternalFilter}
            onChange={(event) => setGlobalInternalFilter(event.target.value)}
            className="max-w-sm dark:bg-dark-800"
          />
          <TableColumnsView table={table} />
        </div>
      )}
      <div className="rounded-md border h-[75%]">
        <Table className="dark:bg-dark-800">
          <DataTableHeader table={table} />
          <DataTableBody table={table} columns={columns} />
        </Table>
      </div>
      <PaginationTableButton table={table} />
    </div>
  )
}
