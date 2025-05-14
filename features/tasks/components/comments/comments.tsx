"use client"

import { useSession } from "next-auth/react"
import { JSONContent } from "@tiptap/react"
import { MessageCircle } from "lucide-react"

import { User } from "@/features/user/interfaces/user.interface"
import { useComments } from "@/features/tasks/hooks/use-comments"

import { CreateComment } from "@/features/tasks/interfaces/comment.interface"
import { CommentsList } from "@/features/tasks/components/comments/comments-list"
import { CommentEditor } from "@/features/tasks/components/comments/comment-editor"

interface CommentsListProps {
  taskId: string
  users: User[]
}

export const Comments = ({ taskId, users }: CommentsListProps) => {
  const { comments, isLoading, handleCreate, handleUpdate, handleDelete } =
    useComments(taskId)

  const { data: session } = useSession()

  if (isLoading) {
    return <div>Loading comments...</div>
  }

  const handleSave = (content: JSONContent, parentId?: string) => {
    const commentData: CreateComment = {
      taskId,
      content,
      userId: session?.user._id || "",
      parentId,
    }
    handleCreate(commentData)
  }

  return (
    <div className="space-y-6 pt-4">
      <div className="mt-6">
        <h3 className="flex items-center gap-2 text-lg font-medium mb-4">
          <MessageCircle className="w-4 h-4 text-purple-500" />
          Add a comment
        </h3>
        <CommentEditor
          users={users}
          onSave={(content) => handleSave(content)}
          placeholder="Add a comment..."
        />
      </div>
      <div className="space-y-2">
        {comments.map((comment) => (
          <CommentsList
            key={comment._id}
            comment={comment}
            users={users}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            onReply={handleSave}
          />
        ))}
      </div>
    </div>
  )
}
