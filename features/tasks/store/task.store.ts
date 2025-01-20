import { create } from "zustand"
import { Task } from "@/app/tasks/[projectId]/page"
import { User } from "@/features/user/intefaces/user.interface"

interface TaskStore {
  task: Task | null
  setTask: (task: Task | null) => void
  isDialogOpen: boolean
  setIsDialogOpen: (isDialogOpen: boolean) => void
  handleInputChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void
  handleSelectDate: (date: Date | undefined, name: string) => void
  handleSelectChange: (value: string, name: string) => void
  handleSelectAssignChange: (value: string, users: User[]) => void
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  task: null,
  setTask: (task) => set({ task }),
  isDialogOpen: false,
  setIsDialogOpen: (isDialogOpen) => set({ isDialogOpen }),
  handleInputChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target
    set({ task: { ...get().task, [name]: value } as Task })
  },
  handleSelectDate: (date: Date | undefined, name: string) => {
    set({ task: { ...get().task, [name]: date } as Task })
  },
  handleSelectChange: (value: string, name: string) => {
    set({ task: { ...get().task, [name]: value } as Task })
  },
  handleSelectAssignChange: (value: string, users: User[]) => {
    const user = users.find((user) => user._id === value)
    set({ task: { ...get().task, assignedTo: user } as Task })
  },
}))
