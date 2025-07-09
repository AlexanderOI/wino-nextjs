"use client"

import { useState } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Pencil, Trash2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { canPermission } from "@/features/permission/utils/can-permission"
import { PERMISSIONS } from "@/features/permission/constants/permissions"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

import { UserAvatar } from "@/features/user/components/user-avatar"
import { usePrefetchTask } from "@/features/tasks/hooks/use-prefetch-task"
import { Project } from "@/features/project/interfaces/project.interface"
import { Task } from "@/features/tasks/interfaces/task.interface"
import { useTaskStore } from "@/features/tasks/store/task.store"

interface TaskItemProps {
  task: Task
  project: Project | null
  updateTask: (newContent: string) => void
  deleteTask: (taskId: string) => void
}

export function TaskItem({ task, project, updateTask, deleteTask }: TaskItemProps) {
  const { handleMouseEnter } = usePrefetchTask(project?._id || "")
  const setTask = useTaskStore((state) => state.setTask)
  const setIsDialogOpen = useTaskStore((state) => state.setIsDialogOpen)

  const [isEditing, setIsEditing] = useState(false)
  const [isDialogDeleteOpen, setIsDialogDeleteOpen] = useState(false)

  const [editContent, setEditContent] = useState(task.name)
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({
      id: task._id,
      data: {
        type: "Task",
        task: task,
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

  const handleClickEdit = async (event: React.MouseEvent<SVGSVGElement>) => {
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
          "bg-purple-deep p-3 rounded shadow transition-all cursor-move group",
          isDragging && "opacity-30"
        )}
        onMouseEnter={() => handleMouseEnter(task._id)}
      >
        <div className="flex flex-col gap-2">
          <div className="h-auto overflow-hidden flex justify-between items-center relative">
            {isEditing ? (
              <form
                className="p-0 m-0 w-full h-auto pr-7"
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSubmit()
                }}
              >
                <Textarea
                  className="bg-purple-deep p-0 border-none h-auto resize-none outline-none"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleSubmit()
                    }
                  }}
                  onBlur={handleSubmit}
                  autoFocus
                />
              </form>
            ) : (
              <p
                onClick={handleClickDialog}
                className="p-0 m-0 pr-7 text-sm text-primary underline-offset-4 hover:underline cursor-pointer"
              >
                {task.name}
                <Pencil
                  size={16}
                  className="text-gray-400 hidden group-hover:inline-block cursor-pointer hover:text-gray-500"
                  onClick={handleClickEdit}
                />
              </p>
            )}

            <DeleteTaskDialog
              isDialogDeleteOpen={isDialogDeleteOpen}
              handleOpenDialog={handleOpenDialog}
              deleteTask={deleteTask}
              task={task}
            />
          </div>

          <div className="flex items-center justify-between gap-2">
            <p className="text-xs text-gray-400">
              {project?.code}-{task.code}
            </p>

            <UserAvatar user={task.assignedTo} />
          </div>
        </div>
      </div>
    </>
  )
}

interface DeleteTaskDialogProps {
  isDialogDeleteOpen: boolean
  handleOpenDialog: (open: boolean) => void
  deleteTask: (taskId: string) => void
  task: Task
}

const DeleteTaskDialog = ({
  isDialogDeleteOpen,
  handleOpenDialog,
  deleteTask,
  task,
}: DeleteTaskDialogProps) => {
  return (
    <Dialog open={isDialogDeleteOpen} onOpenChange={handleOpenDialog}>
      <DialogTrigger asChild>
        <button
          className="p-0 m-0 text-gray-400 absolute right-0 top-0 size-7 justify-center hidden group-hover:flex"
          onClick={(event) => {
            event.stopPropagation()
            handleOpenDialog(true)
          }}
        >
          <Trash2 size={16} />
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Task</DialogTitle>
        </DialogHeader>
        <DialogDescription>Are you sure you want to delete this task?</DialogDescription>
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
  )
}
