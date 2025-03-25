"use client"

import { TypographyP } from "@/components/ui/typography"
import { Task } from "@/features/tasks/interfaces/task.interface"

export function TaskCard({ task }: { task: Task }) {
  return (
    <div className="flex justify-between gap-2">
      <div className="w-2/3">
        <TypographyP>{task.name}</TypographyP>
        <TypographyP className="text-sm">{task.description}</TypographyP>
      </div>
      <div className="w-1/3">
        <TypographyP>{task.assignedTo?.name}</TypographyP>
        <TypographyP>{task.column.name}</TypographyP>
      </div>
    </div>
  )
}
