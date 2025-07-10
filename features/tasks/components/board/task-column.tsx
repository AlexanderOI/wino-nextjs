"use client"

import { useState, useRef, useEffect } from "react"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { useDroppable } from "@dnd-kit/core"
import { Plus } from "lucide-react"

import { cn } from "@/lib/utils"
import { PERMISSIONS } from "@/features/permission/constants/permissions"
import { canPermission } from "@/features/permission/utils/can-permission"
import { PermissionClient } from "@/features/permission/permission-client"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { ColorPicker } from "@/components/ui/color-picker"

import { ColumnData } from "@/features/tasks/interfaces/column.interface"
import { TaskItem } from "@/features/tasks/components/board/task-item"
import { useProjectStore } from "@/features/project/store/project.store"
import { useColumnStore } from "@/features/tasks/store/column.store"
import { Task } from "../../interfaces/task.interface"
import { TaskPreview } from "./task-preview"

interface TaskColumnProps {
  column: ColumnData
  dragOverInfo: {
    overColumnId: string | null
    insertPosition: number
  }
  activeTask: Task | null
  isBeingDraggedOver: boolean
}

export function TaskColumn({
  column,
  dragOverInfo,
  activeTask,
  isBeingDraggedOver,
}: TaskColumnProps) {
  const { updateColumn, addTask, updateTask, deleteTask } = useColumnStore()
  const project = useProjectStore((state) => state.project)

  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [editedColumn, setEditedColumn] = useState(column)
  const [isAddingTask, setIsAddingTask] = useState(false)
  const [newTaskContent, setNewTaskContent] = useState("")
  const newTaskInputRef = useRef<HTMLTextAreaElement>(null)

  const { setNodeRef: setDroppableRef } = useDroppable({
    id: column._id,
    data: {
      type: "column",
      column,
    },
  })

  const handleTitleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    updateColumn(column._id, editedColumn.name, editedColumn.color)
    setIsEditingTitle(false)
  }

  const handleAddTask = (insertAfterTaskId?: string) => {
    if (newTaskContent.trim()) {
      addTask(column._id, newTaskContent.trim(), insertAfterTaskId)
      setNewTaskContent("")
    }
    setIsAddingTask(false)
  }

  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleColorChange = (newColor: string) => {
    if (column.color === newColor) return

    setEditedColumn((prev) => ({ ...prev, color: newColor }))

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      updateColumn(column._id, column.name, newColor)
    }, 500)
  }

  const handleEditingTitle = async () => {
    const hasPermission = await canPermission([PERMISSIONS.EDIT_COLUMN])
    if (hasPermission) {
      setIsEditingTitle(true)
    }
  }

  useEffect(() => {
    if (isAddingTask) {
      newTaskInputRef.current?.focus()
    }
  }, [isAddingTask])

  const DropIndicator = ({ position }: { position: number }) => {
    const shouldShow = isBeingDraggedOver && dragOverInfo.insertPosition === position

    if (!shouldShow) return null

    return activeTask && activeTask.columnId !== column._id ? (
      <TaskPreview task={activeTask} project={project} className="mt-1" />
    ) : null
  }

  return (
    <div
      ref={setDroppableRef}
      className={cn(
        "p-4 rounded-lg bg-dark-800 border transition-all duration-200",
        isBeingDraggedOver
          ? "bg-purple-900/30 border-purple-500/50 shadow-lg shadow-purple-500/20"
          : "border-gray-700"
      )}
    >
      <div className="flex items-center">
        <ColorPicker
          value={column.color}
          onChange={(color) => handleColorChange(color)}
          className="ml-5 mb-4 mt-0 rounded-full w-5 h-5"
        />

        {isEditingTitle ? (
          <form onSubmit={handleTitleSubmit}>
            <Input
              className="ml-3 w-10/12 relative top-[-12px]"
              type="text"
              value={editedColumn.name}
              onChange={(e) => setEditedColumn({ ...editedColumn, name: e.target.value })}
              onBlur={() => setIsEditingTitle(false)}
              autoFocus
            />
          </form>
        ) : (
          <h2
            className="font-semibold pl-3 mb-4 cursor-text"
            onClick={handleEditingTitle}
          >
            {column.name}
          </h2>
        )}
      </div>
      <div className="min-h-[100px]">
        <SortableContext
          items={column.tasks.map((task) => task._id)}
          strategy={verticalListSortingStrategy}
        >
          <DropIndicator position={0} />

          {column.tasks.map((task, index) => (
            <div key={task._id}>
              <TaskItem
                task={task}
                project={project}
                updateTask={(newContent) => updateTask(column._id, task._id, newContent)}
                deleteTask={deleteTask}
              />

              <DropIndicator position={index + 1} />

              <AddTaskItem
                insertAfterTaskId={task._id}
                handleAddTask={handleAddTask}
                newTaskContent={newTaskContent}
                setNewTaskContent={setNewTaskContent}
              />
            </div>
          ))}
        </SortableContext>
      </div>

      {isAddingTask ? (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleAddTask()
          }}
          className="mt-2"
        >
          <Textarea
            ref={newTaskInputRef}
            className="bg-purple-deep p-3 border-gray-500 h-auto resize-none outline-none"
            value={newTaskContent}
            onChange={(e) => setNewTaskContent(e.target.value)}
            onBlur={() => handleAddTask()}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddTask()
              }
            }}
            placeholder="Add new task"
          />
        </form>
      ) : (
        <PermissionClient permissions={[PERMISSIONS.CREATE_TASK]}>
          <button
            onClick={() => setIsAddingTask(true)}
            className="mt-2 flex items-center text-gray-600 hover:text-gray-800"
          >
            <Plus size={20} />
            <span className="ml-1">Add new task</span>
          </button>
        </PermissionClient>
      )}
    </div>
  )
}

interface AddTaskItemProps {
  insertAfterTaskId?: string
  handleAddTask: (insertAfterTaskId?: string) => void
  newTaskContent: string
  setNewTaskContent: (value: string) => void
}

const AddTaskItem = ({
  insertAfterTaskId,
  handleAddTask,
  newTaskContent,
  setNewTaskContent,
}: AddTaskItemProps) => {
  const newTaskInputRef = useRef<HTMLTextAreaElement>(null)
  const [isAddingTask, setIsAddingTask] = useState(false)

  const handleSubmitAddTask = () => {
    handleAddTask(insertAfterTaskId)
    setIsAddingTask(false)
  }

  useEffect(() => {
    if (isAddingTask) {
      newTaskInputRef.current?.focus()
    }
  }, [isAddingTask])

  return (
    <>
      {isAddingTask ? (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmitAddTask()
          }}
          className="my-2"
        >
          <Textarea
            ref={newTaskInputRef}
            className="bg-purple-deep border border-gray-500 h-auto resize-none outline-none p-3"
            value={newTaskContent}
            onChange={(e) => setNewTaskContent(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmitAddTask()
              }
            }}
            onBlur={handleSubmitAddTask}
            placeholder="Add new task"
          />
        </form>
      ) : (
        <div
          className="group relative"
          onClick={() => {
            setIsAddingTask(true)
          }}
        >
          <Plus
            size={16}
            className="absolute hidden group-hover:block z-90 -left-4 top-1/2 -translate-y-1/2 text-gray-900 cursor-pointer bg-purple-500 rounded-full"
          />
          <Separator className="h-1 bg-transparent group-hover:bg-purple-500 cursor-pointer" />
        </div>
      )}
    </>
  )
}
