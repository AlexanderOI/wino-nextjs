import { JSONContent } from "@tiptap/react"

import { User } from "@/features/user/interfaces/user.interface"

export interface Comment {
  _id: string
  taskId: string
  userId: string
  content: JSONContent
  parentId?: string
  isEdited: boolean
  createdAt: string
  updatedAt: string
  user?: Partial<User>
  parent?: Comment
  replies?: Comment[]
}

export interface CreateComment {
  taskId: string
  userId: string
  content: JSONContent
  parentId?: string
}

export interface UpdateComment {
  content: JSONContent
}
