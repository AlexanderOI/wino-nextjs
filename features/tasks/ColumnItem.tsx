"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import TaskColumn from "./TaskColumn"
import { ColumnData } from "@/app/tasks/[projectId]/page"
import { BookmarkX, GripVertical } from "lucide-react"
import { useTaskStore } from "./store/useTaskStore"

interface ColumnItemProps {
  column: ColumnData
}

export function ColumnItem({ column }: ColumnItemProps) {
  const { deleteColumn } = useTaskStore()

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: column.id,
    data: {
      type: "column",
    },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} className="relative flex-shrink-0 w-[280px]">
      <button
        onClick={() => deleteColumn(column.id)}
        className="absolute right-2 top-4 z-10 p-1 rounded-full hover:bg-gray-700"
      >
        <BookmarkX size={20} />
      </button>

      <TaskColumn column={column} />

      <div
        {...attributes}
        {...listeners}
        className="cursor-move absolute left-2 top-4 w-6 h-6 flex items-center justify-center"
      >
        <GripVertical size={20} />
      </div>
    </div>
  )
}
