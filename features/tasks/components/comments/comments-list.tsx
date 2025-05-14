"use client"
import { useState } from "react"
import { format } from "date-fns"
import { useSession } from "next-auth/react"
import { JSONContent } from "@tiptap/react"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

import { User } from "@/features/user/interfaces/user.interface"
import { Comment as CommentType } from "@/features/tasks/interfaces/comment.interface"
import { CommentEditor } from "@/features/tasks/components/comments/comment-editor"

interface CommentProps {
  comment: CommentType
  users: User[]
  onUpdate: (id: string, content: JSONContent) => void
  onDelete: (id: string) => void
  onReply: (content: JSONContent, parentId: string) => void
}

export const CommentsList = ({
  comment,
  users,
  onUpdate,
  onDelete,
  onReply,
}: CommentProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [isReplying, setIsReplying] = useState(false)
  const { data: session } = useSession()

  if (!session) return null

  const isOwner = session?.user?._id === comment.userId

  return (
    <div className="space-y-2 pb-4">
      <Card className="dark:bg-transparent border-none">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={comment.user?.avatar} />
              <AvatarFallback>{comment.user?.name?.[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{comment.user?.name}</p>
              <p className="text-sm text-muted-foreground">
                {format(new Date(comment.createdAt), "PPP HH:mm")}
              </p>
            </div>
          </div>
          {isOwner && !isEditing && (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => setIsReplying(true)}>
                Reply
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                Edit
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onDelete(comment._id)}>
                Delete
              </Button>
            </div>
          )}
        </div>

        <div className="mt-2">
          <CommentEditor
            content={comment.content}
            users={users}
            onSave={(content) => {
              onUpdate(comment._id, content)
              setIsEditing(false)
            }}
            disabled={!isEditing}
            isEditing={isEditing}
            onCancel={() => setIsEditing(false)}
          />
        </div>

        {isReplying && (
          <div className="mt-2">
            <CommentEditor
              users={users}
              onSave={(content) => {
                onReply(content, comment._id)
                setIsReplying(false)
              }}
              onCancel={() => setIsReplying(false)}
              isEditing={isReplying}
            />
          </div>
        )}
      </Card>

      {comment.replies && comment.replies.length > 0 && (
        <Reply
          comment={comment}
          users={users}
          onDelete={onDelete}
          onUpdate={onUpdate}
          onReply={onReply}
          space={true}
        />
      )}
    </div>
  )
}

interface ReplyProps {
  comment: CommentType
  users: User[]
  space?: boolean
  onDelete: (id: string) => void
  onUpdate: (id: string, content: JSONContent) => void
  onReply: (content: JSONContent, parentId: string) => void
}

const Reply = ({ comment, users, onDelete, onUpdate, onReply, space }: ReplyProps) => {
  const { data: session } = useSession()
  const [isEditing, setIsEditing] = useState(false)
  const [isReplying, setIsReplying] = useState(false)

  if (!session) return null

  return (
    <div className={cn("space-y-2", space && "pl-10")}>
      {comment?.replies?.map((reply) => {
        const isOwner = session?.user?._id === reply.userId

        return (
          <div key={reply._id}>
            <Card className="pt-4 dark:bg-transparent border-none">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={reply.user?.avatar} />
                    <AvatarFallback>
                      {reply.user?.name?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{reply.user?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(reply.createdAt), "PPP HH:mm")}
                    </p>
                  </div>
                </div>
                {isOwner && !isEditing && (
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setIsReplying(true)}>
                      Reply
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onDelete(reply._id)}>
                      Delete
                    </Button>
                  </div>
                )}
              </div>

              <div className="mt-2">
                <CommentEditor
                  content={reply.content}
                  users={users}
                  onSave={(content) => {
                    onUpdate(reply._id, content)
                    setIsEditing(false)
                  }}
                  disabled={!isEditing}
                  isEditing={isEditing}
                  onCancel={() => setIsEditing(false)}
                />
              </div>

              {isReplying && (
                <div className="mt-2">
                  <CommentEditor
                    users={users}
                    onSave={(content) => {
                      onReply(content, reply._id)
                      setIsReplying(false)
                    }}
                    onCancel={() => setIsReplying(false)}
                    isEditing={isReplying}
                  />
                </div>
              )}
            </Card>

            {reply.replies && reply.replies.length > 0 && (
              <Reply
                comment={reply}
                users={users}
                onDelete={onDelete}
                onUpdate={onUpdate}
                onReply={onReply}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
