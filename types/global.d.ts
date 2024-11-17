export interface LayoutProp {
  children: React.ReactNode
}

export interface Permissions {
  id: number
  name: string
  description: string
}

export interface Role {
  name: string
  description: string
  permissions: number[]
}

type Roles = {
  id: number
  name: string
  description: string
  createdBy: string
  updatedBy: string
}
