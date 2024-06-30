import { Button } from "@/components/ui/button"
import { ChevronsUpDown } from "lucide-react"

interface ButtonSortedProps {
  column: any
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
