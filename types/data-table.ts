import type { DataTableConfig } from "@/config/data-table"
import type { FilterItemSchema } from "@/lib/parsers"
import type { ColumnSort, RowData } from "@tanstack/react-table"
import type { ReactNode } from "react"
declare module "@tanstack/react-table" {
  // biome-ignore lint/correctness/noUnusedVariables: <explanation>
  interface ColumnMeta<TData extends RowData, TValue> {
    label?: string
    placeholder?: string
    variant?: FilterVariant
    options?: Option[]
    range?: [number, number]
    unit?: string
    icon?: React.FC<React.SVGProps<SVGSVGElement>>
    numberCollapse?: number
  }
}

export interface Option {
  label: string
  value: string
  count?: number
  icon?: React.FC<React.SVGProps<SVGSVGElement>>
  iconColor?: string
  render?: ReactNode
}

export type FilterOperator = DataTableConfig["operators"][number]
export type FilterVariant = DataTableConfig["filterVariants"][number]
export type JoinOperator = DataTableConfig["joinOperators"][number]

export interface ExtendedColumnSort<TData> extends Omit<ColumnSort, "id"> {
  id: Extract<keyof TData, string>
}

export interface ExtendedColumnFilter<TData> extends FilterItemSchema {
  id: Extract<keyof TData, string>
}

export interface DataTableRowAction<TData> {
  row: TData
  variant: "update" | "delete" | "view" | "delete-many"
}

export interface DataTableRowActionMany<TData> {
  rows: TData[]
  variant: "delete-many" | "update-many"
}
