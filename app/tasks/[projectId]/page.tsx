"use client"

import { use, useEffect, useState } from "react"
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
import { v4 as uuidv4 } from "uuid"
import { SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable"
import { ColumnItem } from "@/features/tasks/ColumnItem"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import apiClient from "@/utils/api-client"
import { useParams } from "next/navigation"

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
  const { projectId } = useParams<{ projectId: string }>()
  const [columns, setColumns] = useState<ColumnData[]>([])
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null)
  const [overId, setOverId] = useState<string | null>(null)

  useEffect(() => {
    if (!projectId) return
    const getColumns = async () => {
      const columns = await apiClient.get(`/columns/project/${projectId}`)
      console.log(columns.data)
      setColumns(columns.data)
    }

    getColumns()
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
      const newOrder = newColumns.map((col, index) => ({ id: col.id, order: index }))
      apiClient.put(`/columns/project/${projectId}/reorder`, newOrder)

      setColumns(newColumns)
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
      const newOrder = newTasks.map((task, index) => ({
        id: task._id,
        order: index,
      }))
      apiClient.put(`/tasks/reorder`, newOrder)

      setColumns(
        columns.map((col) => {
          if (col.id === activeColumn.id) {
            return {
              ...col,
              tasks: newTasks,
            }
          }
          return col
        })
      )
      return
    }

    setColumns(
      columns.map((col) => {
        if (col.id === activeColumn.id) {
          return {
            ...col,
            tasks: col.tasks.filter((task) => task._id !== activeId),
          }
        }
        if (col.id === overColumn.id) {
          const overTaskIndex = col.tasks.findIndex((task) => task._id === overId)
          const newTasks = [...col.tasks]

          apiClient.patch(`/tasks/${activeTask._id}`, {
            columnId: overColumn.id,
          })

          if (overTaskIndex === -1) {
            newTasks.push(activeTask)
          } else {
            newTasks.splice(overTaskIndex, 0, activeTask)
          }

          const newOrder = newTasks.map((task, index) => ({
            id: task._id,
            order: index,
          }))

          apiClient.put(`/tasks/reorder`, newOrder)

          return {
            ...col,
            tasks: newTasks,
          }
        }
        return col
      })
    )

    setActiveTaskId(null)
  }

  const addTaskToColumn = async (columnId: string, name: string) => {
    const order = columns.find((col) => col.id === columnId)?.tasks.length ?? 0
    const newTask = await apiClient.post<Task>(`/tasks`, {
      name,
      order,
      columnId,
      projectId,
    })

    if (newTask.status === 201) {
      setColumns(
        columns.map((col) =>
          col.id === columnId ? { ...col, tasks: [...col.tasks, newTask.data] } : col
        )
      )
    }
  }

  const updateTask = async (columnId: string, taskId: string, newName: string) => {
    const newTask = await apiClient.patch<Task>(`/tasks/${taskId}`, {
      name: newName,
      columnId,
    })

    if (newTask.status === 200) {
      setColumns(
        columns.map((col) =>
          col.id === columnId
            ? {
                ...col,
                tasks: col.tasks.map((task) =>
                  task._id === taskId ? { ...task, name: newName } : task
                ),
              }
            : col
        )
      )
    }
  }

  const updateColumnTitle = async (columnId: string, newTitle: string) => {
    const newColumn = await apiClient.patch<ColumnData>(`/columns/${columnId}`, {
      name: newTitle,
    })

    if (newColumn.status === 200) {
      setColumns(
        columns.map((col) => (col.id === columnId ? { ...col, name: newTitle } : col))
      )
    }
  }

  const handleDeleteColumn = async (columnId: string) => {
    const deletedColumn = await apiClient.delete<ColumnData>(`/columns/${columnId}`)
    if (deletedColumn.status === 200) {
      setColumns(columns.filter((col) => col.id !== columnId))
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.target as HTMLFormElement)
    const title = formData.get("title") as string

    if (!title) return

    const newColumn = await apiClient.post<ColumnData>(`/columns/project/${projectId}`, {
      name: title,
    })

    if (newColumn.status === 201) {
      setColumns([...columns, { ...newColumn.data, id: newColumn.data.id, tasks: [] }])
    }
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
              <ColumnItem
                key={column.id}
                column={column}
                updateTask={updateTask}
                updateColumnTitle={updateColumnTitle}
                addTaskToColumn={addTaskToColumn}
                onDelete={handleDeleteColumn}
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
    </div>
  )
}
