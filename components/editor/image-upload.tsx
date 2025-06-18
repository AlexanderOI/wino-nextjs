"use client"

import React, { useCallback } from "react"

import { Editor } from "@tiptap/react"
import { ImageIcon, Link } from "lucide-react"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { apiClient } from "@/utils/api-client"

interface ImageUploadProps {
  editor: Editor
  uploadImage?: (file: File) => Promise<void>
}

export function ImageUpload({ editor, uploadImage }: ImageUploadProps) {
  const [isUploading, setIsUploading] = React.useState(false)

  const addImage = useCallback(
    (url: string) => {
      if (url) {
        editor.chain().focus().setImage({ src: url }).run()
      }
    },
    [editor]
  )

  const handleUploadImage = async (file: File) => {
    try {
      setIsUploading(true)
      const formData = new FormData()
      formData.append("file", file)

      const response = await apiClient.post<{ url: string }>(
        "comments/image/upload",
        formData
      )
      addImage(response.data.url)
    } catch (error) {
      toast({
        title: "Error uploading image",
        description: "Please try again",
        variant: "destructive",
        duration: 2000,
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const file = e.dataTransfer.files[0]
      if (file && file.type.startsWith("image/")) {
        if (uploadImage) {
          uploadImage(file)
        } else {
          handleUploadImage(file)
        }
      }
    },
    [editor]
  )

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      const file = e.clipboardData.files[0]
      if (file && file.type.startsWith("image/")) {
        if (uploadImage) {
          uploadImage(file)
        } else {
          handleUploadImage(file)
        }
      }
    },
    [editor]
  )

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm" variant="ghost">
          <ImageIcon className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <Tabs defaultValue="upload">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="url">URL</TabsTrigger>
          </TabsList>
          <TabsContent
            value="upload"
            className="flex flex-col gap-2"
            onDrop={handleDrop}
            onPaste={handlePaste}
            onDragOver={(e) => e.preventDefault()}
          >
            <div
              className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => document.getElementById("image-upload")?.click()}
            >
              <input
                id="image-upload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    if (uploadImage) {
                      uploadImage(file)
                    } else {
                      handleUploadImage(file)
                    }
                  }
                }}
                disabled={isUploading}
              />
              <ImageIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {isUploading
                  ? "Uploading..."
                  : "Drag and drop an image or click to select"}
              </p>
            </div>
          </TabsContent>
          <TabsContent value="url" className="flex gap-2">
            <form
              className="flex gap-2 w-full"
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                const url = formData.get("url") as string
                if (url) {
                  addImage(url)
                }
                e.currentTarget.reset()
              }}
            >
              <Input
                type="url"
                name="url"
                placeholder="Paste the image URL..."
                className="flex-1 m-0"
              />
              <Button type="submit" className="w-10 h-10">
                <Link className="h-4 w-4" />
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  )
}
