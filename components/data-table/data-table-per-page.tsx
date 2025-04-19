import { Table } from "@tanstack/react-table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Props<T> {
  table: Table<T>
  pageSizeOptions?: number[]
}

export function DataTablePerPage<T>({
  table,
  pageSizeOptions = [10, 20, 30, 40, 50],
}: Props<T>) {
  return (
    <div className="">
      <Select
        value={`${table.getState().pagination.pageSize}`}
        onValueChange={(value) => {
          table.setPageSize(Number(value))
        }}
      >
        <SelectTrigger className="w-[4.5rem] m-0">
          <SelectValue placeholder={table.getState().pagination.pageSize} />
        </SelectTrigger>
        <SelectContent side="top">
          {pageSizeOptions.map((pageSize) => (
            <SelectItem key={pageSize} value={`${pageSize}`}>
              {pageSize}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
