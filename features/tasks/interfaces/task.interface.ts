import { User } from "@/features/user/interfaces/user.interface"
import { ColumnTask } from "./column.interface"

export interface Task {
  _id: string
  name: string
  description: string
  columnId: string
  column: ColumnTask
  assignedTo?: User
  order: number
  projectId: string
  startDate: Date
  endDate: Date
  createdAt: Date
  updatedAt: Date
  __v: number
}
