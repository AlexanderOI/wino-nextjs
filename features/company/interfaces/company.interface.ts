import { Role } from "@/features/roles/interfaces/role.interface"

export interface Company {
  _id: string
  name: string
  address: string
  owner: {
    _id: string
    name: string
    avatar: string
  }
  usersCompany: string[]
  rolesId: string[]
  isMain: boolean

  roles?: Role[]
}
