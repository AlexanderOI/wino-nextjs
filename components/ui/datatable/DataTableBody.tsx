import { TableBody, TableCell, TableRow } from "@/components/ui/datatable/table"
import { flexRender, Table, ColumnDef, Row, Cell } from "@tanstack/react-table"

export function DataTableBody<T>({
  table,
  columns,
}: {
  table: Table<T>
  columns: ColumnDef<T>[]
}) {
  return (
    <TableBody>
      {table.getRowModel().rows?.length ? (
        table.getRowModel().rows.map((row: Row<T>) => (
          <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
            {row.getVisibleCells().map((cell: Cell<T, unknown>) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={columns.length} className="h-10 text-center">
            No results.
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  )
}
