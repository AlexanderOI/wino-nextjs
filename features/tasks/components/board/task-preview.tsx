"use client"

import { Pencil, Trash2 } from "lucide-react"

import { UserAvatar } from "@/features/user/components/user-avatar"
import { Project } from "@/features/project/interfaces/project.interface"
import { Task } from "@/features/tasks/interfaces/task.interface"
import { cn } from "@/lib/utils"

interface Props {
  task: Task
  project: Project | null
  className?: string
}

export function TaskPreview({ task, project, className }: Props) {
  return (
    <div
      className={cn(
        "bg-purple-deep p-3 rounded shadow transition-all cursor-move group opacity-70",
        className
      )}
    >
      <div className="flex flex-col gap-2">
        <div className="h-auto overflow-hidden flex justify-between items-center relative">
          <p className="p-0 m-0 pr-7 text-sm text-primary underline-offset-4 hover:underline cursor-pointer">
            {task.name}
            <Pencil
              size={16}
              className="text-gray-400 hidden group-hover:inline-block cursor-pointer hover:text-gray-500"
            />
          </p>

          <button className="p-0 m-0 text-gray-400 absolute right-0 top-0 size-7 justify-center hidden group-hover:flex">
            <Trash2 size={16} />
          </button>
        </div>

        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-gray-400">
            {project?.code}-{task.code}
          </p>

          <UserAvatar user={task.assignedTo} />
        </div>
      </div>
    </div>
  )
}
