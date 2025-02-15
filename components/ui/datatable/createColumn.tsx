import { ButtonSorted } from "./ButtonSorted"
import { ColumnDef } from "@tanstack/react-table"

export const createColumn = (
  accessorKey: string,
  buttonText?: string
): ColumnDef<any> => {
  const visible = accessorKey.toLocaleLowerCase() !== "id".toLocaleLowerCase()

  return {
    accessorKey: accessorKey,
    header: ({ column }) => (
      <ButtonSorted column={column} text={buttonText || accessorKey} />
    ),
    cell: ({ row }) => {
      const value = row.getValue(accessorKey) as string

      return <div>{value}</div>
    },
    enableHiding: visible,
  }
}
