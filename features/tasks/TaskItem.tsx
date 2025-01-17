"use client"

import { useState } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Input } from "@/components/ui/input"
import { Task } from "@/app/tasks/[projectId]/page"
import { cn } from "@/lib/utils"

interface TaskItemProps {
  task: Task
  updateTask: (newContent: string) => void
}

export default function TaskItem({ task, updateTask }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false)
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "bg-purple-deep p-3 rounded shadow transition-all cursor-move",
        isDragging && "opacity-30"
      )}
    >
      {isEditing ? (
        <form
          className="p-0 m-0 w-full"
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmit()
          }}
        >
          <Input
            className="bg-purple-deep p-0 m-0 border-none h-auto overflow-hidden whitespace-normal break-words"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
            type="text"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            onBlur={handleSubmit}
            autoFocus
          />
        </form>
      ) : (
        <div
          className="h-auto overflow-hidden content-"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
          onClick={() => setIsEditing(true)}
        >
          <p className="p-0 m-0">{task.name}</p>
        </div>
      )}
    </div>
  )
}
