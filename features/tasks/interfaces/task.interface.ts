import { User } from "@/features/user/interfaces/user.interface"
import { ColumnTask } from "./column.interface"
import { Project } from "@/features/project/interfaces/project.interface"

export interface Task {
  _id: string
  name: string
  description: string
  startDate: Date
  endDate: Date
  order: number
  projectId: string
  columnId: string
  createdAt: string
  updatedAt: string
  assignedToId: string
  column: ColumnTask
  assignedTo: User
  project: Project

  fields?: Field[]
}

export interface Field {
  _id: string
  idField: string
  value: string
}
