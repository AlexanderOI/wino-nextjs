import { create } from "zustand"
import { Task } from "@/features/tasks/interfaces/task.interface"

interface TaskStore {
  task: Task | null
  formData: Record<string, string | number | Date> | null
  setTask: (task: Task | null) => void
  isDialogOpen: boolean
  setIsDialogOpen: (isDialogOpen: boolean) => void
  updateTaskField: (name: string, value: any) => void
  setFormData: (formData: Record<string, string | number | Date>) => void
  handleFieldChange: (fieldId: string, value: string | number | Date) => void
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  task: null,
  formData: null,
  setTask: (task) => set({ task }),
  isDialogOpen: false,
  setIsDialogOpen: (isDialogOpen) => set({ isDialogOpen }),

  updateTaskField: (name: string, value: any) => {
    set({ task: { ...get().task, [name]: value } as Task })
  },

  setFormData: (formData: Record<string, string | number | Date>) => {
    set({ formData })
  },

  handleFieldChange: (fieldId: string, value: string | number | Date) => {
    set({ formData: { ...get().formData, [fieldId]: value } })
  },
}))
