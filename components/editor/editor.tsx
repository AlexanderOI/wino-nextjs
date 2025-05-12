"use client"

import React, { useEffect } from "react"
import { EditorContent, useEditor, UseEditorOptions, JSONContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Mention from "@tiptap/extension-mention"
import Highlight from "@tiptap/extension-highlight"
import TextAlign from "@tiptap/extension-text-align"

import { cn } from "@/lib/utils"

import { MenuBar } from "@/components/editor/menu-bar"
import { SuggestionUsers } from "@/components/editor/suggestion"
import { CustomImage } from "@/components/editor/extensions/resizable-image"

import "@/components/editor/style/style.css"

import { User } from "@/features/user/interfaces/user.interface"

import { ButtonProps } from "@/components/ui/button"

interface EditorProps {
  users: User[]
  value: string | JSONContent
  uploadImage?: (file: File) => Promise<void>
  onUpdate: (value: JSONContent) => void
  saveProps?: ButtonProps
  cancelProps?: ButtonProps
  className?: string
}

const configFn = (users: User[], className?: string): UseEditorOptions => {
  return {
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
          HTMLAttributes: {
            class: "tracking-tight",
          },
        },
      }),
      Highlight.configure({
        HTMLAttributes: {
          class: "bg-yellow-200 dark:bg-yellow-500/30",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      CustomImage.configure({
        HTMLAttributes: {
          class: "rounded-lg",
        },
      }),
      Mention.configure({
        HTMLAttributes: {
          class: "bg-gray-800/90 rounded shadow text-sm",
        },
        suggestion: SuggestionUsers(
          users.map((user) => ({
            id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
          }))
        ),
      }),
    ],
    editorProps: {
      attributes: {
        class: cn(
          "prose dark:prose-invert max-w-none focus:outline-none border rounded-lg p-2 max-h-96 overflow-y-auto",
          className
        ),
      },
    },
  }
}

export function Editor({
  users,
  uploadImage,
  value,
  onUpdate,
  saveProps,
  cancelProps,
  className,
}: EditorProps) {
  const editor = useEditor({
    ...configFn(users, className),
    onUpdate: ({ editor }) => {
      onUpdate(editor.getJSON())
    },
    content: value,
    immediatelyRender: false,
    autofocus: true,
  })

  if (!editor) {
    return null
  }

  return (
    <div className="flex flex-col gap-2">
      <MenuBar
        editor={editor}
        uploadImage={uploadImage}
        saveProps={saveProps}
        cancelProps={cancelProps}
      />
      <EditorContent editor={editor} autoFocus={true} />
    </div>
  )
}

export function EditorViewer({
  content,
  users,
  className,
}: {
  content: JSONContent | string
  users: User[]
  className?: string
}) {
  "use client"
  const editor = useEditor({
    ...configFn(users, className),
    content,
    editable: false,
    immediatelyRender: false,
  })

  useEffect(() => {
    editor?.commands.setContent(content)
  }, [content])

  if (!editor) {
    return null
  }

  return (
    <div className="cursor-text hover:bg-purple-500/10 rounded-lg">
      <EditorContent editor={editor} />
    </div>
  )
}
