import { ButtonSorted } from "./ButtonSorted"
import { ColumnDef } from "@tanstack/react-table"

export const createColumn = <T,>(
  accessorKey: string,
  buttonText?: string
): ColumnDef<T> => {
  const visible = accessorKey.toLocaleLowerCase() !== "id".toLocaleLowerCase()

  return {
    accessorKey,
    header: ({ column }) => (
      <ButtonSorted column={column} text={buttonText || String(accessorKey)} />
    ),
    cell: ({ row }) => {
      const value = row.getValue(accessorKey) as string
      return <div>{value}</div>
    },
    enableHiding: visible,
  }
}
