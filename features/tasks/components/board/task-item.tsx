"use client"

import { useState } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Trash2 } from "lucide-react"
import { useTaskStore } from "../../store/task.store"
import { Task } from "@/features/tasks/interfaces/task.interface"
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

  const handleClickEdit = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation()
    setIsEditing(true)
  }

  const handleClickDialog = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation()
    setTask(task)
    setIsDialogOpen(true)
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
              className="p-0 m-0 text-primary underline-offset-4 hover:underline cursor-pointer w-10/12"
            >
              {task.name}
            </p>

            {isHovering && (
              <button onClick={() => deleteTask(task._id)}>
                <Trash2 size={20} />
              </button>
            )}
          </div>
        )}
      </div>
    </>
  )
}
