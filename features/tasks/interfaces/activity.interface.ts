import { Company } from "@/features/company/interfaces/company.interface"
import { User } from "@/features/user/interfaces/user.interface"
import { Task } from "@/features/tasks/interfaces/task.interface"
import { ColumnTask } from "./column.interface"

export interface Activity {
  _id: string
  task: Task
  column: ColumnTask
  type: string
  text: string
  previousValue: string
  newValue: string
  userId: string
  projectId: string
  companyId: string
  createdAt: string
  updatedAt: string
  user: Pick<User, "_id" | "name" | "email" | "avatar">
  company: Pick<Company, "_id" | "name">
}
