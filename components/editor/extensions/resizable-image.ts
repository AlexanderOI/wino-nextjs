import Image from "@tiptap/extension-image"
import { ReactNodeViewRenderer } from "@tiptap/react"

import { ResizableImage } from "@/components/editor/resizable-image"

export const CustomImage = Image.extend({
  atom: true,
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        renderHTML: (attributes) => {
          if (!attributes.width) {
            return {}
          }
          return { width: attributes.width }
        },
      },
      height: {
        default: null,
        renderHTML: (attributes) => {
          if (!attributes.height) {
            return {}
          }
          return { height: attributes.height }
        },
      },
    }
  },
  addKeyboardShortcuts() {
    return {
      Space: ({ editor }) => {
        const { selection } = editor.state
        const { $from } = selection

        // Detectar si estamos justo al lado de una imagen
        const nodeBefore = $from.nodeBefore
        const nodeAfter = $from.nodeAfter

        if (
          (nodeBefore && nodeBefore.type.name === "image") ||
          (nodeAfter && nodeAfter.type.name === "image")
        ) {
          return true // evitar que se dispare espacio en esos casos
        }

        return false
      },
    }
  },
  addNodeView() {
    return ReactNodeViewRenderer(ResizableImage)
  },
})
