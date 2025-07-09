"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { BookmarkX, GripVertical } from "lucide-react"

import { PermissionClient } from "@/features/permission/permission-client"
import { PERMISSIONS } from "@/features/permission/constants/permissions"

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { DialogTrigger } from "@/components/ui/dialog"

import { useColumnStore } from "@/features/tasks/store/column.store"
import { ColumnData } from "@/features/tasks/interfaces/column.interface"
import { TaskColumn } from "@/features/tasks/components/board/task-column"
import { Task } from "../../interfaces/task.interface"

interface ColumnItemProps {
  column: ColumnData
  setActiveTask: (task: Task | null) => void
  dragOverInfo: {
    overColumnId: string | null
    insertPosition: number
  }
  activeTask: Task | null
}

export function ColumnItem({
  column,
  setActiveTask,
  dragOverInfo,
  activeTask,
}: ColumnItemProps) {
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

  const isBeingDraggedOver =
    dragOverInfo.overColumnId === column._id && activeTask !== null

  return (
    <div ref={setNodeRef} style={style} className="relative flex-shrink-0 w-[280px]">
      <PermissionClient permissions={[PERMISSIONS.DELETE_COLUMN]}>
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
              <p>Are you sure you want to delete this column?</p>
              <p>This action is irreversible</p>
              <p>All tasks in this column will be deleted.</p>
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
      </PermissionClient>

      <TaskColumn
        column={column}
        dragOverInfo={dragOverInfo}
        activeTask={activeTask}
        isBeingDraggedOver={isBeingDraggedOver}
      />

      <PermissionClient permissions={[PERMISSIONS.EDIT_COLUMN]}>
        {column.completed ? (
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <div className="cursor-pointer absolute left-2 top-4 w-6 h-6 flex items-center justify-center text-gray-500">
                <GripVertical size={20} />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Column is completed - you can't move it</p>
            </TooltipContent>
          </Tooltip>
        ) : (
          <div
            {...attributes}
            {...listeners}
            onClick={() => setActiveTask(null)}
            className="cursor-move absolute left-2 top-4 w-6 h-6 flex items-center justify-center"
          >
            <GripVertical size={20} />
          </div>
        )}
      </PermissionClient>
    </div>
  )
}
