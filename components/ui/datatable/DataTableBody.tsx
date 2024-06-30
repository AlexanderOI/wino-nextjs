import { TableBody, TableCell, TableRow } from "@/components/ui/datatable/table"
import { flexRender } from "@tanstack/react-table"

export function DataTableBody({
  table,
  columns,
}: {
  table: any
  columns: any
}) {
  return (
    <TableBody>
      {table.getRowModel().rows?.length ? (
        table.getRowModel().rows.map((row: any) => (
          <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
            {row.getVisibleCells().map((cell: any) => (
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
