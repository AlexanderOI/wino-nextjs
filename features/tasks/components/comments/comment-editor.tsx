"use client"

import { useEffect, useState } from "react"
import { JSONContent } from "@tiptap/react"

import { toast } from "@/components/ui/use-toast"
import { EditorViewer, Editor } from "@/components/editor/editor"

import { User } from "@/features/user/interfaces/user.interface"

interface CommentEditorProps {
  users: User[]
  onSave: (content: JSONContent) => void
  onCancel?: () => void
  disabled?: boolean
  isEditing?: boolean
  content?: JSONContent
}

export const CommentEditor = ({
  users,
  disabled = false,
  isEditing = false,
  content,
  onSave,
  onCancel,
}: CommentEditorProps) => {
  const [isInternalEditing, setIsInternalEditing] = useState(isEditing)

  useEffect(() => {
    setIsInternalEditing(isEditing)
  }, [isEditing])

  const [contentInternal, setContentInternal] = useState<JSONContent | undefined>(content)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = () => {
    if (contentInternal) {
      if (!contentInternal) {
        toast({
          title: "Error",
          description: "El comentario no puede estar vacío",
          variant: "destructive",
        })
        return
      }
      onSave(contentInternal)
      setIsInternalEditing(false)
      setIsSaving(false)
    }
  }

  useEffect(() => {
    if (isEditing) {
      setContentInternal(content)
    }
  }, [isEditing])

  return (
    <>
      {isInternalEditing ? (
        <Editor
          users={users}
          value={contentInternal || ""}
          onUpdate={(contentUpdated) => {
            setIsSaving(true)
            setContentInternal(contentUpdated)
          }}
          saveProps={{
            onClick: handleSave,
            className: "bg-accent/80 hover:bg-accent/90 hover:text-accent-foreground",
            disabled: !isSaving,
          }}
          cancelProps={{
            onClick: () => {
              onCancel?.()
              setIsInternalEditing(false)
            },
            className: "bg-red-800/80 hover:bg-red-800 hover:text-white ml-auto",
          }}
        />
      ) : (
        <div
          onClick={() => {
            if (!disabled) setIsInternalEditing(true)
          }}
        >
          <EditorViewer content={content || ""} users={users} />
        </div>
      )}
    </>
  )
}
