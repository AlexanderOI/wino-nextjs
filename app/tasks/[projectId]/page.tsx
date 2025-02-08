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
import { ColumnItem } from "@/features/tasks/components/board/column-item"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useParams } from "next/navigation"
import { useColumnStore } from "@/features/tasks/store/column.store"
import { useTaskStore } from "@/features/tasks/store/task.store"
import { TaskDialog } from "@/features/tasks/components/dialog/task-dialog"
import { SkeletonTaskBoard } from "@/features/tasks/components/skeleton/skeleton-task-board"
import ColorPicker from "@/components/ui/color-picker"
import { TypographyH1 } from "@/components/ui/typography"

export default function TasksPage() {
  const columns = useColumnStore((state) => state.columns)
  const fetchColumns = useColumnStore((state) => state.fetchColumns)
  const addColumn = useColumnStore((state) => state.addColumn)
  const moveTask = useColumnStore((state) => state.moveTask)
  const reorderTasks = useColumnStore((state) => state.reorderTasks)
  const reorderColumns = useColumnStore((state) => state.reorderColumns)

  const task = useTaskStore((state) => state.task)
  const isDialogOpen = useTaskStore((state) => state.isDialogOpen)
  const setIsDialogOpen = useTaskStore((state) => state.setIsDialogOpen)

  const { projectId } = useParams<{ projectId: string }>()
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null)
  const [overId, setOverId] = useState<string | null>(null)
  const [editedColumn, setEditedColumn] = useState({
    title: "",
    color: "#33254a",
  })

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
      const oldIndex = columns.findIndex((col) => col._id === activeId)
      const newIndex = columns.findIndex((col) => col._id === overId)
      const newColumns = arrayMove(columns, oldIndex, newIndex)
      reorderColumns(newColumns)
      return
    }

    const activeColumn = columns.find((col) =>
      col.tasks.some((task) => task._id === activeId)
    )
    const overColumn = columns.find(
      (col) => col.tasks.some((task) => task._id === overId) || col._id === overId
    )

    if (!activeColumn || !overColumn) return

    const activeTask = activeColumn.tasks.find((task) => task._id === activeId)
    if (!activeTask) return

    if (activeColumn._id === overColumn._id) {
      const oldIndex = activeColumn.tasks.findIndex((task) => task._id === activeId)
      const newIndex = activeColumn.tasks.findIndex((task) => task._id === overId)

      const newTasks = arrayMove(activeColumn.tasks, oldIndex, newIndex)
      reorderTasks(activeColumn._id, newTasks)
      return
    }

    moveTask(activeId, overId, activeColumn._id, overColumn._id, activeTask)
    setActiveTaskId(null)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!editedColumn.title) return

    await addColumn(editedColumn.title, editedColumn.color)

    setEditedColumn({
      title: "",
      color: "#33254a",
    })
  }

  const isLoading = columns.length === 0
  if (isLoading) return <SkeletonTaskBoard />

  return (
    <div className="h-full overflow-hidden p-6 pt-4">
      <div className="flex justify-between items-center mb-4">
        <TypographyH1>Manage your tasks</TypographyH1>

        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <div className="flex">
            <Input
              placeholder="Add a new column"
              className="w-[200px] rounded-r-none m-0"
              name="title"
              value={editedColumn.title}
              onChange={(e) =>
                setEditedColumn({ ...editedColumn, title: e.target.value })
              }
            />
            <ColorPicker
              value={editedColumn.color}
              onChange={(color) => setEditedColumn({ ...editedColumn, color })}
              className="rounded-l-none m-0"
            />
          </div>

          <Button type="submit" variant="purple">
            Add Column
          </Button>
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
        <div className="flex space-x-4 overflow-x-auto">
          <SortableContext
            items={columns.map((col) => col._id)}
            strategy={horizontalListSortingStrategy}
          >
            {columns.map((column) => (
              <ColumnItem
                key={column._id}
                column={column}
                setActiveTaskId={setActiveTaskId}
              />
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

      <TaskDialog isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} id={task?._id} />
    </div>
  )
}
