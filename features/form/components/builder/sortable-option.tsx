import { Input } from "@/components/ui/input"
import { useSortable } from "@dnd-kit/sortable"
import { GripVertical, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CSS } from "@dnd-kit/utilities"
import { SelectOption } from "@/features/form/interfaces/form.interface"

interface Props {
  option: SelectOption
  onUpdate: (id: string, value: string) => void
  onRemove: (id: string) => void
}

export function SortableOption({ option, onUpdate, onRemove }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: option._id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-2">
      <div
        className="cursor-grab hover:bg-accent p-1 rounded"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </div>
      <Input
        value={option.value}
        onChange={(e) => onUpdate(option._id, e.target.value)}
        placeholder="Escribe una opción..."
        className="flex-1"
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-destructive"
        onClick={() => onRemove(option._id)}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}
