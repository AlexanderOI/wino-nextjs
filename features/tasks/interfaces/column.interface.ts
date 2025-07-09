import { Task } from "./task.interface"

export interface ColumnTask {
  _id: string
  name: string
  color?: string
  order?: number
  completed: boolean
  projectId?: string
  isActive?: boolean
}

export interface ColumnData extends ColumnTask {
  tasks: Task[]
}
