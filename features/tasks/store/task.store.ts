import { create } from "zustand"
import { Task } from "@/features/tasks/interfaces/task.interface"

interface TaskStore {
  task: Task | null
  setTask: (task: Task | null) => void
  isDialogOpen: boolean
  setIsDialogOpen: (isDialogOpen: boolean) => void
  updateTaskField: (name: string, value: any) => void
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  task: null,
  setTask: (task) => set({ task }),
  isDialogOpen: false,
  setIsDialogOpen: (isDialogOpen) => set({ isDialogOpen }),

  updateTaskField: (name: string, value: any) => {
    set({ task: { ...get().task, [name]: value } as Task })
  },
}))
