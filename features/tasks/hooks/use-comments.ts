import { useState, useCallback } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

import { Comment, CreateComment } from "../interfaces/comment.interface"
import {
  createComment,
  updateComment,
  deleteComment,
  getByTask,
} from "../actions/comment.action"
import { JSONContent } from "@tiptap/react"

export const useComments = (taskId: string) => {
  const queryClient = useQueryClient()
  const [editingComment, setEditingComment] = useState<string | null>(null)

  const { data: comments = [], isLoading } = useQuery<Comment[]>({
    queryKey: ["comments", taskId],
    queryFn: () => getByTask(taskId),
  })

  const createMutation = useMutation({
    mutationFn: (data: CreateComment) => createComment({ ...data, taskId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", taskId] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, content }: { id: string; content: JSONContent }) =>
      updateComment(id, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", taskId] })
      setEditingComment(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteComment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", taskId] })
    },
  })

  const handleCreate = useCallback(
    (data: CreateComment) => {
      createMutation.mutate(data)
    },
    [createMutation]
  )

  const handleUpdate = useCallback(
    (id: string, content: JSONContent) => {
      updateMutation.mutate({ id, content })
    },
    [updateMutation]
  )

  const handleDelete = useCallback(
    (id: string) => {
      deleteMutation.mutate(id)
    },
    [deleteMutation]
  )

  return {
    comments,
    isLoading,
    editingComment,
    setEditingComment,
    handleCreate,
    handleUpdate,
    handleDelete,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}
