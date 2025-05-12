import { apiClient } from "@/utils/api-client"
import { CreateComment } from "@/features/tasks/interfaces/comment.interface"
import { JSONContent } from "@tiptap/react"

export const createComment = async (data: CreateComment) => {
  const response = await apiClient.post("/comments", data)
  return response.data
}

export const updateComment = async (id: string, content: JSONContent) => {
  const response = await apiClient.patch(`/comments/${id}`, { content })
  return response.data
}

export const deleteComment = async (id: string) => {
  const response = await apiClient.delete(`/comments/${id}`)
  return response.data
}

export const getByTask = async (taskId: string) => {
  const response = await apiClient.get(`/comments/task/${taskId}`)
  return response.data
}
