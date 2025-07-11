import { Role } from "@/features/roles/interfaces/role.interface"

export interface CompanyOwner {
  _id: string
  name: string
  avatar: string
  avatarColor: string
}

export interface Company {
  _id: string
  name: string
  address: string
  owner: CompanyOwner
  usersCompany: string[]
  rolesId: string[]
  isMain: boolean
  isActive: boolean
  roles?: Role[]
  roleType?: string
  invitePending?: boolean
  isInvited?: boolean
  createdAt: string
}
