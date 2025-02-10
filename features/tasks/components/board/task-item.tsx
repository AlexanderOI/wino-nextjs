"use client"

import { useState } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Trash2 } from "lucide-react"
import { useTaskStore } from "../../store/task.store"
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
import { canPermission } from "@/features/permission/utils/can-permission"
import { PERMISSIONS } from "@/features/permission/constants/permissions"
interface TaskItemProps {
  task: Task
  updateTask: (newContent: string) => void
  deleteTask: (taskId: string) => void
}

export default function TaskItem({ task, updateTask, deleteTask }: TaskItemProps) {
  const setTask = useTaskStore((state) => state.setTask)
  const setIsDialogOpen = useTaskStore((state) => state.setIsDialogOpen)

  const [isEditing, setIsEditing] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [isDialogDeleteOpen, setIsDialogDeleteOpen] = useState(false)

  const [editContent, setEditContent] = useState(task.name)
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({
      id: task._id,
      data: {
        type: "Task",
      },
    })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const handleSubmit = () => {
    updateTask(editContent)
    setIsEditing(false)
  }

  const handleClickEdit = async (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation()
    const hasPermission = await canPermission([PERMISSIONS.EDIT_TASK])
    if (hasPermission) {
      setIsEditing(true)
    }
  }

  const handleClickDialog = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation()
    setTask(task)
    setIsDialogOpen(true)
  }

  const handleOpenDialog = (open: boolean) => {
    setIsDialogDeleteOpen(open)

    if (!open) {
      setIsEditing(false)
      setIsHovering(false)
    }
  }

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={cn(
          "bg-purple-deep p-3 rounded shadow transition-all cursor-move",
          isDragging && "opacity-30"
        )}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onClick={handleClickEdit}
      >
        {isEditing ? (
          <form
            className="p-0 m-0 w-full h-auto"
            onSubmit={(e) => {
              e.preventDefault()
              handleSubmit()
            }}
          >
            <Input
              className="bg-purple-deep p-0 m-0 border-none h-auto overflow-hidden whitespace-normal break-words"
              type="text"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              onBlur={handleSubmit}
              autoFocus
            />
          </form>
        ) : (
          <div className="h-auto overflow-hidden flex justify-between items-center">
            <p
              onClick={handleClickDialog}
              className="p-0 m-0 text-primary underline-offset-4 hover:underline cursor-pointer"
            >
              {task.name}
            </p>

            {(isHovering || isDialogDeleteOpen) && (
              <Dialog open={isDialogDeleteOpen} onOpenChange={handleOpenDialog}>
                <DialogTrigger asChild>
                  <button
                    onClick={(event) => {
                      event.stopPropagation()
                      setIsDialogDeleteOpen(true)
                    }}
                  >
                    <Trash2 size={20} />
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Task</DialogTitle>
                  </DialogHeader>
                  <DialogDescription>
                    Are you sure you want to delete this task?
                  </DialogDescription>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <DialogClose asChild>
                      <Button variant="destructive" onClick={() => deleteTask(task._id)}>
                        Delete
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        )}
      </div>
    </>
  )
}
