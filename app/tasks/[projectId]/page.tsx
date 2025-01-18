"use client"

import { useEffect, useState } from "react"
import {
  DndContext,
  DragOverlay,
  DragEndEvent,
  useSensors,
  useSensor,
  PointerSensor,
  closestCorners,
} from "@dnd-kit/core"
import { arrayMove } from "@dnd-kit/sortable"
import { SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable"
import { ColumnItem } from "@/features/tasks/ColumnItem"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import apiClient from "@/utils/api-client"
import { useParams } from "next/navigation"
import { useTaskStore } from "@/features/tasks/store/useTaskStore"

export interface Task {
  _id: string
  name: string
  description: string
  columnId: string
  assignedTo: string
  order: number
  projectId: string
}

export interface ColumnData {
  id: string
  name: string
  order: number
  projectId: string
  isActive: boolean
  tasks: Task[]
}

export default function TasksPage() {
  const columns = useTaskStore((state) => state.columns)
  const fetchColumns = useTaskStore((state) => state.fetchColumns)
  const addColumn = useTaskStore((state) => state.addColumn)
  const moveTask = useTaskStore((state) => state.moveTask)
  const reorderTasks = useTaskStore((state) => state.reorderTasks)
  const reorderColumns = useTaskStore((state) => state.reorderColumns)

  const { projectId } = useParams<{ projectId: string }>()
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null)
  const [overId, setOverId] = useState<string | null>(null)

  useEffect(() => {
    if (!projectId) return
    fetchColumns(projectId)
  }, [projectId])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    if (active.data.current?.type === "column") {
      const oldIndex = columns.findIndex((col) => col.id === activeId)
      const newIndex = columns.findIndex((col) => col.id === overId)
      const newColumns = arrayMove(columns, oldIndex, newIndex)
      reorderColumns(newColumns)
      return
    }

    const activeColumn = columns.find((col) =>
      col.tasks.some((task) => task._id === activeId)
    )
    const overColumn = columns.find(
      (col) => col.tasks.some((task) => task._id === overId) || col.id === overId
    )

    if (!activeColumn || !overColumn) return

    const activeTask = activeColumn.tasks.find((task) => task._id === activeId)
    if (!activeTask) return

    if (activeColumn.id === overColumn.id) {
      const oldIndex = activeColumn.tasks.findIndex((task) => task._id === activeId)
      const newIndex = activeColumn.tasks.findIndex((task) => task._id === overId)

      const newTasks = arrayMove(activeColumn.tasks, oldIndex, newIndex)
      reorderTasks(activeColumn.id, newTasks)
      return
    }

    moveTask(activeId, overId, activeColumn.id, overColumn.id, activeTask)
    setActiveTaskId(null)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.target as HTMLFormElement
    const formData = new FormData(form)
    const title = formData.get("title") as string

    if (!title) return

    addColumn(title)

    form.reset()
  }

  return (
    <div className="h-full overflow-hidden">
      <div className="flex justify-between items-center mb-4 px-4 pt-4">
        <h1 className="text-2xl font-bold">Add your tasks</h1>
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <Input placeholder="Add a new column" className="w-[200px]" name="title" />
          <Button type="submit">Add Column</Button>
        </form>
      </div>
      <DndContext
        collisionDetection={closestCorners}
        sensors={sensors}
        onDragEnd={handleDragEnd}
        onDragStart={(event) => {
          if (event.active.data.current?.type === "Task") {
            setActiveTaskId(event.active.id as string)
          }
        }}
        onDragOver={(event) => {
          setOverId((event.over?.id as string) ?? null)
        }}
        onDragCancel={() => {
          setActiveTaskId(null)
          setOverId(null)
        }}
      >
        <div className="flex space-x-4 overflow-x-auto px-4 pb-4">
          <SortableContext
            items={columns.map((col) => col.id)}
            strategy={horizontalListSortingStrategy}
          >
            {columns.map((column) => (
              <ColumnItem key={column.id} column={column} />
            ))}
          </SortableContext>
        </div>

        {activeTaskId && (
          <DragOverlay>
            <div className="bg-purple-deep p-3 rounded shadow opacity-80">
              {
                columns
                  .map((col) => col.tasks.find((task) => task._id === activeTaskId)?.name)
                  .filter(Boolean)[0]
              }
            </div>
          </DragOverlay>
        )}
      </DndContext>
    </div>
  )
}
