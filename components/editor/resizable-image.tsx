"use client"

import { useRef } from "react"
import { NodeViewProps, NodeViewWrapper } from "@tiptap/react"

import { cn } from "@/lib/utils"

import { useResize } from "@/components/editor/hooks/use-resize"

const MIN_WIDTH = 100
const MIN_HEIGHT = 100
const MAX_WIDTH = 1024

export function ResizableImage(props: NodeViewProps) {
  const imageRef = useRef<HTMLImageElement>(null)
  const { currentWidth, currentHeight, updateDimensions, initiateResize, isResizing } =
    useResize({
      initialWidth: props.node.attrs.width ?? 0,
      initialHeight: props.node.attrs.height ?? 0,
      contentWidth: props.node.attrs.width ?? 0,
      contentHeight: props.node.attrs.height ?? 0,
      gridInterval: 0.1,
      onDimensionsChange: (dimensions) => {
        props.updateAttributes({ width: dimensions.width, height: dimensions.height })
      },
      minWidth: MIN_WIDTH,
      minHeight: MIN_HEIGHT,
      maxWidth: MAX_WIDTH,
    })

  return (
    <NodeViewWrapper className="image-resizer">
      <img
        ref={imageRef}
        src={props.node.attrs.src}
        className={cn(
          "rounded-lg max-w-full transition-opacity",
          isResizing ? "opacity-75" : "",
          props.selected ? "outline outline-2 outline-offset-2 outline-primary" : ""
        )}
        style={{
          width: currentWidth,
          height: currentHeight,
        }}
        draggable={false}
      />
      {props.selected && (
        <>
          <div
            className="resize-handle left-0"
            onPointerDown={initiateResize("left")}
            role="button"
            tabIndex={0}
          />
          <div
            className="resize-handle right-0"
            onPointerDown={initiateResize("right")}
            role="button"
            tabIndex={0}
          />
        </>
      )}
    </NodeViewWrapper>
  )
}
