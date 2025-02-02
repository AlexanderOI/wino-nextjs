import { Company } from "@/features/company/interfaces/company.interface"
import { User } from "@/features/user/interfaces/user.interface"
import { Task } from "@/features/tasks/interfaces/task.interface"

export interface Activity {
  _id: string
  taskId: string
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
  task: Pick<Task, "_id" | "name" | "columnId" | "column" | "description">
}
