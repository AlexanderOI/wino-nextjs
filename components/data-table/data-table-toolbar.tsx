"use client"

import type { Column, Table } from "@tanstack/react-table"
import { X } from "lucide-react"
import { useCallback, useMemo, useId, useState, ComponentProps } from "react"

import { DataTableDateFilter } from "@/components/data-table/data-table-date-filter"
import { DataTableFacetedFilter } from "@/components/data-table/data-table-faceted-filter"
import { DataTableSliderFilter } from "@/components/data-table/data-table-slider-filter"
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useDebouncedCallback } from "@/hooks/use-debounced-callback"

interface DataTableToolbarProps<TData> extends ComponentProps<"div"> {
  table: Table<TData>
  debounceMs?: number
  throttleMs?: number
}

export function DataTableToolbar<TData>({
  table,
  children,
  className,
  debounceMs = 300,
  throttleMs = 50,
  ...props
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  const columns = useMemo(
    () => table.getAllColumns().filter((column) => column.getCanFilter()),
    [table]
  )

  const onReset = useCallback(() => {
    table.resetColumnFilters()
  }, [table])

  return (
    <div
      role="toolbar"
      aria-orientation="horizontal"
      className={cn("flex w-full items-start justify-between gap-2 p-1", className)}
      {...props}
    >
      <div className="flex flex-1 flex-wrap items-center gap-2">
        {columns.map((column) => (
          <DataTableToolbarFilter
            key={column.id}
            column={column}
            debounceMs={debounceMs}
            throttleMs={throttleMs}
          />
        ))}
        {isFiltered && (
          <Button
            aria-label="Reset filters"
            variant="outline"
            size="sm"
            className="border-dashed"
            onClick={onReset}
          >
            <X />
            Reset
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        {children}
        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}
interface DataTableToolbarFilterProps<TData> {
  column: Column<TData>
  debounceMs?: number
  throttleMs?: number
}

function DataTableToolbarFilter<TData>({
  column,
  debounceMs = 300,
  throttleMs = 50,
}: DataTableToolbarFilterProps<TData>) {
  {
    const columnMeta = column.columnDef.meta

    const onFilterRender = useCallback(() => {
      if (!columnMeta?.variant) return null

      switch (columnMeta.variant) {
        case "text":
          const [inputValue, setInputValue] = useState(
            (column.getFilterValue() as string) ?? ""
          )

          const debouncedSetFilter = useDebouncedCallback((value: string) => {
            column.setFilterValue(value)
          }, debounceMs)

          const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            const value = event.target.value
            setInputValue(value)
            debouncedSetFilter(value)
          }
          return (
            <Input
              placeholder={columnMeta.placeholder ?? columnMeta.label}
              value={inputValue}
              onChange={handleChange}
              className="w-40 lg:w-56 m-0"
            />
          )

        case "number":
          return (
            <div className="relative">
              <Input
                type="number"
                inputMode="numeric"
                placeholder={columnMeta.placeholder ?? columnMeta.label}
                value={(column.getFilterValue() as string) ?? ""}
                onChange={(event) => column.setFilterValue(event.target.value)}
                className={cn("w-[120px]", columnMeta.unit && "pr-8")}
              />
              {columnMeta.unit && (
                <span className="absolute top-0 right-0 bottom-0 flex items-center rounded-r-md bg-accent px-2 text-muted-foreground text-sm">
                  {columnMeta.unit}
                </span>
              )}
            </div>
          )

        case "range":
          return (
            <DataTableSliderFilter
              column={column}
              title={columnMeta.label ?? column.id}
            />
          )

        case "date":
        case "dateRange":
          return (
            <DataTableDateFilter
              column={column}
              title={columnMeta.label ?? column.id}
              multiple={columnMeta.variant === "dateRange"}
            />
          )

        case "select":
        case "multiSelect":
          return (
            <DataTableFacetedFilter
              column={column}
              title={columnMeta.label ?? column.id}
              options={columnMeta.options ?? []}
              multiple={columnMeta.variant === "multiSelect"}
              numberCollapse={columnMeta.numberCollapse}
            />
          )

        default:
          return null
      }
    }, [column, columnMeta])

    return onFilterRender()
  }
}
