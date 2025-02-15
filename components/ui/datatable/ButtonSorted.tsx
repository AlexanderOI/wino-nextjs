import { Button } from "@/components/ui/button"
import { ChevronsUpDown } from "lucide-react"
import { Column } from "@tanstack/react-table"
interface ButtonSortedProps {
  column: Column<any>
  text: string
  className?: string
}
export function ButtonSorted({ column, text, className }: ButtonSortedProps) {
  return (
    <Button
      variant="ghost"
      className={`capitalize ${className}`}
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {text}
      <ChevronsUpDown className="ml-2 h-4 w-4 ${className}" />
    </Button>
  )
}
