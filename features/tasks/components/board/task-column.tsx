"use client"

import { useState, useRef, useEffect } from "react"
import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import TaskItem from "./task-item"
import { Input } from "@/components/ui/input"
import { Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { useColumnStore } from "../../store/column.store"
import { ColumnData } from "@/features/tasks/interfaces/column.interface"
import ColorPicker from "@/components/ui/color-picker"
import { PERMISSIONS } from "@/features/permission/constants/permissions"
import { canPermission } from "@/features/permission/utils/can-permission"
import { PermissionClient } from "@/features/permission/permission-client"
import { useProjectStore } from "@/features/project/store/project.store"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"

interface TaskColumnProps {
  column: ColumnData
}

export default function TaskColumn({ column }: TaskColumnProps) {
  const { updateColumn, addTask, updateTask, deleteTask } = useColumnStore()
  const project = useProjectStore((state) => state.project)

  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [editedColumn, setEditedColumn] = useState(column)
  const [isAddingTask, setIsAddingTask] = useState(false)
  const [newTaskContent, setNewTaskContent] = useState("")
  const newTaskInputRef = useRef<HTMLTextAreaElement>(null)

  const { isOver, setNodeRef } = useDroppable({
    id: column._id,
  })

  const handleTitleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    updateColumn(column._id, editedColumn.name, editedColumn.color)
    setIsEditingTitle(false)
  }

  const handleAddTask = (order: number) => {
    if (newTaskContent.trim()) {
      addTask(column._id, newTaskContent.trim(), order)
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

  return (
    <div
      className={cn(
        "p-4 rounded-lg bg-dark-800 border transition-colors",
        isOver ? "bg-purple-900/20" : ""
      )}
      ref={setNodeRef}
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
      <div className="min-h-[100px] ">
        <SortableContext
          items={column.tasks.map((task) => task._id)}
          strategy={verticalListSortingStrategy}
        >
          {column.tasks.map((task) => (
            <div key={task._id}>
              <TaskItem
                task={task}
                project={project}
                updateTask={(newContent) => updateTask(column._id, task._id, newContent)}
                deleteTask={deleteTask}
              />

              <AddTaskItem
                handleAddTask={handleAddTask}
                order={task.order}
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
            handleAddTask(0)
          }}
          className="mt-2"
        >
          <Textarea
            ref={newTaskInputRef}
            className="bg-purple-deep p-3 border-gray-500 h-auto resize-none outline-none"
            value={newTaskContent}
            onChange={(e) => setNewTaskContent(e.target.value)}
            onBlur={() => handleAddTask(0)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddTask(0)
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
  handleAddTask: (orden: number) => void
  order: number
  newTaskContent: string
  setNewTaskContent: (value: string) => void
}

const AddTaskItem = ({
  handleAddTask,
  order,
  newTaskContent,
  setNewTaskContent,
}: AddTaskItemProps) => {
  const newTaskInputRef = useRef<HTMLTextAreaElement>(null)
  const [isAddingTask, setIsAddingTask] = useState(false)

  const handleSubmitAddTask = () => {
    handleAddTask(order)
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
