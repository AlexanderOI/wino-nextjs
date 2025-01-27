export interface Role {
  _id: string
  name: string
  description: string
  permissions: string[]
  createdAt?: Date
  updatedAt?: Date
}

export interface Permissions {
  _id: string
  name: string
  description: string
}
