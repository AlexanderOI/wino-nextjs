"use client"

import { useParams } from "next/navigation"

import { useEffect, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import {
  DndContext,
  DragOverlay,
  DragEndEvent,
  DragOverEvent,
  useSensors,
  useSensor,
  PointerSensor,
  closestCorners,
} from "@dnd-kit/core"
import {
  SortableContext,
  horizontalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable"

import { toast } from "@/components/ui/use-toast"
import { TypographyH1 } from "@/components/ui/typography"
import { ColorPicker } from "@/components/ui/color-picker"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TaskPreview } from "@/features/tasks/components/board/task-preview"
import { ColumnItem } from "@/features/tasks/components/board/column-item"
import { TaskDialog } from "@/features/tasks/components/dialog/task-dialog"

import { useColumnStore } from "@/features/tasks/store/column.store"
import { useTaskStore } from "@/features/tasks/store/task.store"

import { PermissionClient } from "@/features/permission/permission-client"
import { PERMISSIONS } from "@/features/permission/constants/permissions"
import { DialogData } from "@/components/common/dialog/dialog-data"
import { getFormTask } from "@/features/form/actions/form.action"

import { ColumnData } from "@/features/tasks/interfaces/column.interface"
import { Project } from "@/features/project/interfaces/project.interface"
import { Task } from "@/features/tasks/interfaces/task.interface"

interface Props {
  project: Project
  columnsTasks: ColumnData[]
}

export function TasksPageClient({ project, columnsTasks }: Props) {
  const columns = useColumnStore((state) => state.columns)
  const setColumns = useColumnStore((state) => state.setColumns)
  const setProjectId = useColumnStore((state) => state.setProjectId)
  const addColumn = useColumnStore((state) => state.addColumn)
  const moveTask = useColumnStore((state) => state.moveTask)
  const reorderTasks = useColumnStore((state) => state.reorderTasks)
  const reorderColumns = useColumnStore((state) => state.reorderColumns)

  const task = useTaskStore((state) => state.task)
  const isDialogOpen = useTaskStore((state) => state.isDialogOpen)
  const setIsDialogOpen = useTaskStore((state) => state.setIsDialogOpen)

  const { projectId } = useParams<{ projectId: string }>()
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [dragOverInfo, setDragOverInfo] = useState<{
    overColumnId: string | null
    insertPosition: number
  }>({
    overColumnId: null,
    insertPosition: -1,
  })
  const [editedColumn, setEditedColumn] = useState({
    title: "",
    color: "#33254a",
  })
  const queryClient = useQueryClient()

  useEffect(() => {
    setColumns(columnsTasks)
    setProjectId(projectId)
    queryClient.prefetchQuery({
      queryKey: ["formTask", project.formTaskId],
      queryFn: () => getFormTask(project.formTaskId),
      staleTime: 300000,
    })
  }, [projectId])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over || !active) {
      setDragOverInfo({
        overColumnId: null,
        insertPosition: -1,
      })
      return
    }

    const overId = over.id as string

    const overColumn = columns.find((col) => col._id === overId)
    if (overColumn) {
      setDragOverInfo({
        overColumnId: overId,
        insertPosition: overColumn.tasks.length,
      })
      return
    }

    const overColumnWithTask = columns.find((col) =>
      col.tasks.some((task) => task._id === overId)
    )

    if (overColumnWithTask) {
      const taskIndex = overColumnWithTask.tasks.findIndex((task) => task._id === overId)
      setDragOverInfo({
        overColumnId: overColumnWithTask._id,
        insertPosition: taskIndex,
      })
    }
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    setDragOverInfo({
      overColumnId: null,
      insertPosition: -1,
    })

    if (active.data.current?.type === "column") {
      const oldIndex = columns.findIndex((col) => col._id === activeId)
      const newIndex = columns.findIndex((col) => col._id === overId)

      const lastIndex = columns.length - 1
      const activeColumn = columns.find((col) => col._id === activeId)

      if (activeColumn && !activeColumn.completed && newIndex === lastIndex) {
        toast({
          title: "You cannot move this column to the completed column",
          variant: "destructive",
          duration: 3000,
        })
        return
      }

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
      const insertAfterTaskId = activeColumn.tasks[newIndex - 1]?._id

      const newTasks = arrayMove(activeColumn.tasks, oldIndex, newIndex)

      reorderTasks(activeColumn._id, newTasks, activeTask._id, insertAfterTaskId)
      return
    }

    moveTask(activeId, overId, activeColumn._id, overColumn._id, activeTask)
    setActiveTask(null)
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

  return (
    <div className="h-full overflow-x-hidden p-6 pt-4 scrollbar-hidden">
      <div className="flex justify-between items-center mb-4">
        <TypographyH1>Manage your tasks</TypographyH1>

        <PermissionClient permissions={[PERMISSIONS.CREATE_COLUMN]}>
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
        </PermissionClient>
      </div>

      <DndContext
        collisionDetection={closestCorners}
        sensors={sensors}
        onDragEnd={handleDragEnd}
        onDragStart={(event) => {
          if (event.active.data.current?.type === "Task") {
            setActiveTask({ ...event.active.data.current?.task })
          }
        }}
        onDragOver={handleDragOver}
        onDragCancel={() => {
          setActiveTask(null)
          setDragOverInfo({
            overColumnId: null,
            insertPosition: -1,
          })
        }}
      >
        <div className="flex space-x-4 overflow-x-auto scrollbar-hidden">
          <SortableContext
            items={columns.map((col) => col._id)}
            strategy={horizontalListSortingStrategy}
          >
            {columns.map((column) => (
              <ColumnItem
                key={column._id}
                column={column}
                setActiveTask={setActiveTask}
                dragOverInfo={dragOverInfo}
                activeTask={activeTask}
              />
            ))}
          </SortableContext>
        </div>

        {activeTask && (
          <DragOverlay>
            <TaskPreview task={activeTask} project={project} />
          </DragOverlay>
        )}
      </DndContext>

      <DialogData
        content={<TaskDialog id={task?._id || ""} />}
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  )
}
