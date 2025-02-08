"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import TaskColumn from "./task-column"
import { BookmarkX, GripVertical } from "lucide-react"
import { useColumnStore } from "../../store/column.store"
import { ColumnData } from "@/features/tasks/interfaces/column.interface"
import { Task } from "@/features/tasks/interfaces/task.interface"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface ColumnItemProps {
  column: ColumnData
  setActiveTaskId: (id: string | null) => void
}

export function ColumnItem({ column, setActiveTaskId }: ColumnItemProps) {
  const { deleteColumn } = useColumnStore()

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: column._id,
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
      <Dialog>
        <DialogTrigger asChild>
          <button className="absolute right-2 top-4 z-10 p-1 rounded-full hover:bg-gray-700">
            <BookmarkX size={20} />
          </button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Column</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Are you sure you want to delete this column?
          </DialogDescription>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" onClick={() => deleteColumn(column._id)}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <TaskColumn column={column} />

      <div
        {...attributes}
        {...listeners}
        onClick={() => setActiveTaskId(null)}
        className="cursor-move absolute left-2 top-4 w-6 h-6 flex items-center justify-center"
      >
        <GripVertical size={20} />
      </div>
    </div>
  )
}
