import { Company } from "@/features/company/interfaces/company.interface"
import { User } from "@/features/user/interfaces/user.interface"

export interface Project {
  _id: string
  name: string
  description: string
  leaderId: string
  leader?: User
  membersId: string[]
  members?: User[]
  client: string
  status: string
  startDate: Date
  endDate: Date
  company?: Company
  companyId: string
  formTaskId: string
}
