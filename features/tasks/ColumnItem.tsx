"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import TaskColumn from "./TaskColumn"
import { ColumnData } from "@/app/tasks/[projectId]/page"
import { BookmarkX, GripVertical } from "lucide-react"

interface ColumnItemProps {
  column: ColumnData
  updateTask: (columnId: string, taskId: string, newContent: string) => void
  updateColumnTitle: (columnId: string, newTitle: string) => void
  addTaskToColumn: (columnId: string, content: string) => void
  onDelete: (columnId: string) => void
}

export function ColumnItem({
  column,
  updateTask,
  updateColumnTitle,
  addTaskToColumn,
  onDelete,
}: ColumnItemProps) {
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
        onClick={() => onDelete(column.id)}
        className="absolute right-2 top-4 z-10 p-1 rounded-full hover:bg-gray-700"
      >
        <BookmarkX size={20} />
      </button>

      <TaskColumn
        column={column}
        updateTask={updateTask}
        updateColumnTitle={updateColumnTitle}
        addTaskToColumn={addTaskToColumn}
      />

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
