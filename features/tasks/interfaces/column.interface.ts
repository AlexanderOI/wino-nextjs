import { Task } from "./task.interface"

export interface ColumnTask {
  _id: string
  name: string
  color?: string
  order?: number
  projectId?: string
  isActive?: boolean
}

export interface ColumnData extends ColumnTask {
  tasks: Task[]
}
