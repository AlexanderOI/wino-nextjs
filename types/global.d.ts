export interface LayoutProp {
  children: React.ReactNode
}

export interface Permissions {
  _id: string
  name: string
  description: string
}

export interface Role {
  name: string
  description: string
  permissions: string[]
}

type Roles = {
  _id: string
  name: string
  description: string
  createdBy: string
  updatedBy: string
}
