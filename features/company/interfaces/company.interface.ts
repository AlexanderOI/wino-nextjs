import { User } from "@/features/user/interfaces/user.interface"

export interface Company {
  _id: string
  name: string
  address: string
  owner: User
  users: string[]
  roles: string[]
  isMain: boolean
}
