import { TableHead, TableHeader, TableRow } from "@/components/ui/datatable/table"
import { flexRender, HeaderGroup, Header, Table } from "@tanstack/react-table"

export function DataTableHeader<T>({ table }: { table: Table<T> }) {
  return (
    <TableHeader>
      {table.getHeaderGroups().map((headerGroup: HeaderGroup<T>) => (
        <TableRow key={headerGroup.id}>
          {headerGroup.headers.map((header: Header<T, unknown>) => {
            return (
              <TableHead key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(header.column.columnDef.header, header.getContext())}
              </TableHead>
            )
          })}
        </TableRow>
      ))}
    </TableHeader>
  )
}
