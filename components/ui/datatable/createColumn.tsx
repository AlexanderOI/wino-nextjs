import { ButtonSorted } from "./ButtonSorted"

export const createColumn = (accessorKey: string, buttonText?: string) => {
  const visible = accessorKey.toLocaleLowerCase() !== "id".toLocaleLowerCase()
  return {
    accessorKey: accessorKey,
    header: ({ column }: any) => (
      <ButtonSorted column={column} text={buttonText || accessorKey} />
    ),
    cell: ({ row }: any) => <div>{row.getValue(accessorKey)}</div>,
    enableHiding: visible,
  }
}
