"use client"

import { useState, useRef, useEffect } from "react"
import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import TaskItem from "./TaskItem"
import { Input } from "@/components/ui/input"
import { Plus } from "lucide-react"
import { ColumnData } from "@/app/tasks/[projectId]/page"
import { cn } from "@/lib/utils"
import { useTaskStore } from "./store/useTaskStore"

interface TaskColumnProps {
  column: ColumnData
}

export default function TaskColumn({ column }: TaskColumnProps) {
  const { updateColumnTitle, addTask, updateTask, deleteTask } = useTaskStore()

  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [titleInput, setTitleInput] = useState(column.name)
  const [isAddingTask, setIsAddingTask] = useState(false)
  const [newTaskContent, setNewTaskContent] = useState("")
  const newTaskInputRef = useRef<HTMLInputElement>(null)

  const { isOver, setNodeRef } = useDroppable({
    id: column.id,
  })

  const handleTitleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    updateColumnTitle(column.id, titleInput)
    setIsEditingTitle(false)
  }

  const handleAddTask = () => {
    if (newTaskContent.trim()) {
      addTask(column.id, newTaskContent.trim())
      setNewTaskContent("")
    }
    setIsAddingTask(false)
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
      {isEditingTitle ? (
        <form onSubmit={handleTitleSubmit}>
          <Input
            className="ml-5 w-10/12 relative top-[-12px]"
            type="text"
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
            onBlur={() => setIsEditingTitle(false)}
            autoFocus
          />
        </form>
      ) : (
        <h2
          className="font-semibold pl-5 mb-4 cursor-text"
          onClick={() => setIsEditingTitle(true)}
        >
          {column.name}
        </h2>
      )}
      <div className="space-y-2 min-h-[100px] ">
        <SortableContext
          items={column.tasks.map((task) => task._id)}
          strategy={verticalListSortingStrategy}
        >
          {column.tasks.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              updateTask={(newContent) => updateTask(column.id, task._id, newContent)}
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
        <button
          onClick={() => setIsAddingTask(true)}
          className="mt-2 flex items-center text-gray-600 hover:text-gray-800"
        >
          <Plus size={20} />
          <span className="ml-1">Add new task</span>
        </button>
      )}
    </div>
  )
}
