import { ButtonSorted } from "./ButtonSorted"

export const createColumn = (accessorKey: string, buttonText?: string) => {
  const visible = accessorKey.toLocaleLowerCase() !== "id".toLocaleLowerCase()

  return {
    accessorKey: accessorKey,
    header: ({ column }: any) => (
      <ButtonSorted column={column} text={buttonText || accessorKey} />
    ),
    cell: ({ row }: any) => {
      const value = row.getValue(accessorKey)

      if (
        accessorKey.toLocaleLowerCase() === "createdby" ||
        accessorKey.toLocaleLowerCase() === "updatedby"
      ) {
        return <div>{value?.name || ""}</div>
      }

      return <div>{value}</div>
    },
    enableHiding: visible,
  }
}
