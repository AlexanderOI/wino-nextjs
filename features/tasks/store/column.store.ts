import { create } from "zustand"
import { apiClient } from "@/utils/api-client"
import { ColumnData } from "../interfaces/column.interface"
import { Task } from "../interfaces/task.interface"

interface ColumnStore {
  columns: ColumnData[]
  projectId: string
  setColumns: (columns: ColumnData[]) => void
  fetchColumns: (projectId: string) => Promise<boolean>
  addColumn: (name: string, color: string) => Promise<void>
  updateColumn: (columnId: string, name?: string, color?: string) => Promise<void>
  deleteColumn: (columnId: string) => Promise<void>
  addTask: (columnId: string, name: string) => Promise<void>
  updateTask: (columnId: string, taskId: string, newName: string) => Promise<void>
  setOneTask: (columnId: string, task: Task, move?: boolean) => void
  deleteTask: (taskId: string) => Promise<void>
  reorderTasks: (columnId: string, tasks: Task[]) => Promise<void>
  moveTask: (
    activeTaskId: string,
    overTaskId: string,
    activeColumnId: string,
    overColumnId: string,
    activeTask: Task
  ) => Promise<void>
  reorderColumns: (newColumns: ColumnData[]) => Promise<void>
}

export const useColumnStore = create<ColumnStore>((set, get) => ({
  columns: [],
  projectId: "",
  setColumns: (columns) => set({ columns }),

  fetchColumns: async (projectId: string) => {
    try {
      const response = await apiClient.get(`/columns/project/${projectId}?withTasks=true`)
      set({ projectId })
      set({ columns: response.data })
      return true
    } catch (error) {
      console.error(error)
      return false
    }
  },

  addColumn: async (name: string, color: string) => {
    const response = await apiClient.post<ColumnData>(
      `/columns/project/${get().projectId}`,
      { name, color }
    )
    if (response.status === 201) {
      set((state) => ({
        columns: [...state.columns, { ...response.data, tasks: [] }],
      }))
    }
  },

  updateColumn: async (columnId: string, name?: string, color?: string) => {
    const response = await apiClient.patch<ColumnData>(`/columns/${columnId}`, {
      name,
      color,
    })

    if (response.status === 200) {
      set((state) => ({
        columns: state.columns.map((col) =>
          col._id === columnId
            ? { ...col, name: name ?? col.name, color: color ?? col.color }
            : col
        ),
      }))
    }
  },

  deleteColumn: async (columnId: string) => {
    const response = await apiClient.delete<ColumnData>(`/columns/${columnId}`)
    if (response.status === 200) {
      set((state) => ({
        columns: state.columns.filter((col) => col._id !== columnId),
      }))
    }
  },

  addTask: async (columnId: string, name: string) => {
    const order = get().columns.find((col) => col._id === columnId)?.tasks.length ?? 0
    const response = await apiClient.post<Task>("/tasks", {
      name,
      order,
      columnId,
      projectId: get().projectId,
    })

    if (response.status === 201) {
      set((state) => ({
        columns: state.columns.map((col) =>
          col._id === columnId ? { ...col, tasks: [...col.tasks, response.data] } : col
        ),
      }))
    }
  },

  updateTask: async (columnId: string, taskId: string, newName: string) => {
    const response = await apiClient.patch<Task>(`/tasks/${taskId}`, {
      name: newName,
      columnId,
    })

    if (response.status === 200) {
      set((state) => ({
        columns: state.columns.map((col) =>
          col._id === columnId
            ? {
                ...col,
                tasks: col.tasks.map((task) =>
                  task._id === taskId ? { ...task, name: newName } : task
                ),
              }
            : col
        ),
      }))
    }
  },

  setOneTask: (newColumnId: string, task: Task, move: boolean = true) => {
    set((state) => ({
      columns: state.columns.map((col) =>
        col._id === newColumnId
          ? { ...col, tasks: col.tasks.map((t) => (t._id === task._id ? task : t)) }
          : col
      ),
    }))

    if (move) get().moveTask(task._id, task._id, task.columnId, newColumnId, task)
  },

  reorderTasks: async (columnId: string, newTasks: Task[]) => {
    const newOrder = newTasks.map((task, index) => ({
      id: task._id,
      order: index,
    }))
    apiClient.put("/tasks/reorder", newOrder)

    set((state) => ({
      columns: state.columns.map((col) =>
        col._id === columnId ? { ...col, tasks: newTasks } : col
      ),
    }))
  },

  deleteTask: async (taskId: string) => {
    const response = await apiClient.delete<Task>(`/tasks/${taskId}`)
    if (response.status === 200) {
      set((state) => ({
        columns: state.columns.map((col) => ({
          ...col,
          tasks: col.tasks.filter((task) => task._id !== taskId),
        })),
      }))
    }
  },

  moveTask: async (
    activeTaskId: string,
    overTaskId: string,
    activeColumnId: string,
    overColumnId: string,
    activeTask: Task
  ) => {
    set((state) => ({
      columns: state.columns.map((col) => {
        if (col._id === activeColumnId) {
          return {
            ...col,
            tasks: col.tasks.filter((task) => task._id !== activeTaskId),
          }
        }
        if (col._id === overColumnId) {
          const overTaskIndex = col.tasks.findIndex((task) => task._id === overTaskId)
          const newTasks = [...col.tasks]

          apiClient.patch(`/tasks/${activeTask._id}`, {
            columnId: overColumnId,
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

          apiClient.put("/tasks/reorder", newOrder)

          return {
            ...col,
            tasks: newTasks,
          }
        }
        return col
      }),
    }))
  },

  reorderColumns: async (newColumns: ColumnData[]) => {
    const newOrder = newColumns.map((col, index) => ({
      id: col._id,
      order: index,
    }))
    apiClient.put(`/columns/project/${get().projectId}/reorder`, newOrder)
    set({ columns: newColumns })
  },
}))
