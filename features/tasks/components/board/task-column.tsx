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

interface TaskColumnProps {
  column: ColumnData
}

export default function TaskColumn({ column }: TaskColumnProps) {
  const { updateColumn, addTask, updateTask, deleteTask } = useColumnStore()

  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [editedColumn, setEditedColumn] = useState(column)
  const [isAddingTask, setIsAddingTask] = useState(false)
  const [newTaskContent, setNewTaskContent] = useState("")
  const newTaskInputRef = useRef<HTMLInputElement>(null)

  const { isOver, setNodeRef } = useDroppable({
    id: column._id,
  })

  const handleTitleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    updateColumn(column._id, editedColumn.name, editedColumn.color)
    setIsEditingTitle(false)
  }

  const handleAddTask = () => {
    if (newTaskContent.trim()) {
      addTask(column._id, newTaskContent.trim())
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
      <div className="space-y-2 min-h-[100px] ">
        <SortableContext
          items={column.tasks.map((task) => task._id)}
          strategy={verticalListSortingStrategy}
        >
          {column.tasks.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              updateTask={(newContent) => updateTask(column._id, task._id, newContent)}
              deleteTask={deleteTask}
            />
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
          <Input
            ref={newTaskInputRef}
            type="text"
            value={newTaskContent}
            onChange={(e) => setNewTaskContent(e.target.value)}
            onBlur={handleAddTask}
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
