import { create } from "zustand"
import { apiClient } from "@/utils/api-client"
import { ColumnData } from "../interfaces/column.interface"
import { Task } from "../interfaces/task.interface"

interface ColumnStore {
  columns: ColumnData[]
  projectId: string
  setColumns: (columns: ColumnData[]) => void
  setProjectId: (projectId: string) => void
  addColumn: (name: string, color: string) => Promise<void>
  updateColumn: (columnId: string, name?: string, color?: string) => Promise<void>
  deleteColumn: (columnId: string) => Promise<void>
  addTask: (columnId: string, name: string, insertAfterTaskId?: string) => Promise<void>
  updateTask: (columnId: string, taskId: string, newName: string) => Promise<void>
  setOneTask: (columnId: string, task: Task, move?: boolean) => void
  deleteTask: (taskId: string) => Promise<void>
  reorderTasks: (
    columnId: string,
    newTasks: Task[],
    taskId: string,
    insertAfterTaskId?: string
  ) => Promise<void>
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
  setProjectId: (projectId) => set({ projectId }),
  addColumn: async (name: string, color: string) => {
    const response = await apiClient.post<ColumnData>(
      `/columns/project/${get().projectId}`,
      { name, color }
    )
    if (response.status === 201) {
      set((state) => {
        const completedColumns = state.columns.find((col) => col.completed === true)
        const otherColumns = state.columns.filter((col) => col.completed === false)
        const newColumns = [
          ...otherColumns,
          { ...response.data, tasks: [] },
          ...(completedColumns ? [completedColumns] : []),
        ]
        return { columns: newColumns }
      })
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

  addTask: async (columnId: string, name: string, insertAfterTaskId?: string) => {
    const url = insertAfterTaskId ? "/tasks/position" : "/tasks"
    const params = insertAfterTaskId ? { insertAfterTaskId } : {}

    const response = await apiClient.post<Task>(
      url,
      {
        name,
        columnId,
        projectId: get().projectId,
      },
      { params }
    )

    if (response.status === 201) {
      set((state) => ({
        columns: state.columns.map((col) => {
          if (col._id === columnId) {
            const tasks = [...col.tasks, { ...response.data }].sort(
              (a, b) => a.order - b.order
            )

            return { ...col, tasks }
          }
          return col
        }),
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

  reorderTasks: async (
    columnId: string,
    newTasks: Task[],
    taskId: string,
    insertAfterTaskId?: string
  ) => {
    apiClient.put(`/tasks/${taskId}/move-to-position`, {
      insertAfterTaskId: insertAfterTaskId,
    })

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
          const insertAfterTaskId =
            activeTaskId === overTaskId ? overTaskId : col.tasks[overTaskIndex - 1]?._id
          const newTasks = [...col.tasks]

          apiClient.put(`/tasks/${activeTask._id}/move-to-column`, {
            newColumnId: overColumnId,
            insertAfterTaskId: insertAfterTaskId,
          })

          if (overTaskIndex === -1) {
            newTasks.push(activeTask)
          } else {
            newTasks.splice(overTaskIndex, 0, activeTask)
          }

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
