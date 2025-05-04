"use client"

import React from "react"

import { type Editor } from "@tiptap/react"

import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  Italic,
  Pilcrow,
  Strikethrough,
  Save,
  X,
} from "lucide-react"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Button, ButtonProps } from "@/components/ui/button"
import { Toggle } from "@/components/ui/toggle"

import { ImageUpload } from "@/components/editor/image-upload"

interface MenuBarProps {
  editor: Editor | null
  uploadImage?: (file: File) => Promise<void>
  saveProps?: ButtonProps
  cancelProps?: ButtonProps
}

export function MenuBar({ editor, uploadImage, saveProps, cancelProps }: MenuBarProps) {
  if (!editor) {
    return null
  }

  return (
    <div className="flex flex-wrap gap-1 p-1 border rounded-lg bg-background z-50 sticky top-0">
      <Popover modal={true}>
        <PopoverTrigger asChild>
          <Button size="sm" variant="ghost">
            <TooltipTitle title="Heading">
              <div className="flex items-center">
                <Heading1 className="h-4 w-4 mr-2" />
                <span>Heading</span>
              </div>
            </TooltipTitle>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-40 flex flex-col gap-1 z-[9999]">
          <Toggle
            size="sm"
            pressed={editor.isActive("heading", { level: 1 })}
            onPressedChange={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
          >
            <Heading1 className="h-4 w-4 mr-2" />
            <span>Heading 1</span>
          </Toggle>

          <Toggle
            size="sm"
            pressed={editor.isActive("heading", { level: 2 })}
            onPressedChange={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
          >
            <Heading2 className="h-4 w-4 mr-2" />
            <span>Heading 2</span>
          </Toggle>

          <Toggle
            size="sm"
            pressed={editor.isActive("heading", { level: 3 })}
            onPressedChange={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
          >
            <Heading3 className="h-4 w-4 mr-2" />
            <span>Heading 3</span>
          </Toggle>
        </PopoverContent>
      </Popover>

      <TooltipTitle title="Paragraph">
        <Toggle
          size="sm"
          pressed={editor.isActive("paragraph")}
          onPressedChange={() => editor.chain().focus().setParagraph().run()}
        >
          <Pilcrow className="h-4 w-4" />
        </Toggle>
      </TooltipTitle>

      <div className="w-[1px] bg-border mx-1" />

      <TooltipTitle title="Bold">
        <Toggle
          size="sm"
          pressed={editor.isActive("bold")}
          onPressedChange={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </Toggle>
      </TooltipTitle>

      <TooltipTitle title="Italic">
        <Toggle
          size="sm"
          pressed={editor.isActive("italic")}
          onPressedChange={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </Toggle>
      </TooltipTitle>

      <TooltipTitle title="Strikethrough">
        <Toggle
          size="sm"
          pressed={editor.isActive("strike")}
          onPressedChange={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough className="h-4 w-4" />
        </Toggle>
      </TooltipTitle>

      <TooltipTitle title="Highlight">
        <Toggle
          size="sm"
          pressed={editor.isActive("highlight")}
          onPressedChange={() => editor.chain().focus().toggleHighlight().run()}
        >
          <Highlighter className="h-4 w-4" />
        </Toggle>
      </TooltipTitle>

      <div className="w-[1px] bg-border mx-1" />

      <TooltipTitle title="Left">
        <Toggle
          size="sm"
          pressed={editor.isActive({ textAlign: "left" })}
          onPressedChange={() => editor.chain().focus().setTextAlign("left").run()}
        >
          <AlignLeft className="h-4 w-4" />
        </Toggle>
      </TooltipTitle>

      <TooltipTitle title="Center">
        <Toggle
          size="sm"
          pressed={editor.isActive({ textAlign: "center" })}
          onPressedChange={() => editor.chain().focus().setTextAlign("center").run()}
        >
          <AlignCenter className="h-4 w-4" />
        </Toggle>
      </TooltipTitle>

      <TooltipTitle title="Right">
        <Toggle
          size="sm"
          pressed={editor.isActive({ textAlign: "right" })}
          onPressedChange={() => editor.chain().focus().setTextAlign("right").run()}
        >
          <AlignRight className="h-4 w-4" />
        </Toggle>
      </TooltipTitle>

      <TooltipTitle title="Justify">
        <Toggle
          size="sm"
          pressed={editor.isActive({ textAlign: "justify" })}
          onPressedChange={() => editor.chain().focus().setTextAlign("justify").run()}
        >
          <AlignJustify className="h-4 w-4" />
        </Toggle>
      </TooltipTitle>

      <div className="w-[1px] bg-border mx-1" />

      <TooltipTitle title="Insert image">
        <div className="flex items-center gap-1">
          <ImageUpload editor={editor} uploadImage={uploadImage} />
        </div>
      </TooltipTitle>

      <TooltipTitle title="Cancel">
        <Button size="sm" variant={cancelProps?.variant || "ghost"} {...cancelProps}>
          <X className="h-4 w-4" />
        </Button>
      </TooltipTitle>

      <TooltipTitle title="Save changes">
        <Button size="sm" variant={saveProps?.variant || "ghost"} {...saveProps}>
          <Save className="h-4 w-4" />
        </Button>
      </TooltipTitle>
    </div>
  )
}

const TooltipTitle = ({
  children,
  title,
}: {
  children: React.ReactNode
  title: string
}) => {
  return (
    <Tooltip delayDuration={100}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>{title}</TooltipContent>
    </Tooltip>
  )
}
