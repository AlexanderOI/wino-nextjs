import { cn } from "@/lib/utils"
import React, { useState, useRef, useEffect, memo } from "react"

interface Props {
  children: React.ReactElement<{ name: string }>
  value?: string
  onClose?: (name: string, wasChanged: boolean) => void
  viewElement?: React.ReactElement
  className?: string
  disabled?: boolean
}

export const EditableField = memo(
  ({ children, value, onClose, viewElement, className, disabled = false }: Props) => {
    const [isEditing, setIsEditing] = useState(false)
    const [valueTest, setValueTest] = useState(value)
    const ref = useRef<HTMLDivElement>(null)
    const wasChanged = useRef(false)

    useEffect(() => {
      if (value !== valueTest) {
        wasChanged.current = true
      }
      setValueTest(value)
    }, [value])

    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        let target = event.target as HTMLElement
        let isOpen = target.getAttribute("data-state") === "open"

        let isPopover = target.closest("[data-radix-popper-content-wrapper]")

        if (ref.current && !ref.current.contains(target) && !isPopover && !isOpen) {
          setIsEditing(false)
          let name = children?.props?.name || ""
          onClose?.(name, wasChanged.current)
          wasChanged.current = false
        }
      }

      if (isEditing) {
        document.addEventListener("mousedown", handleClickOutside)
      } else {
        document.removeEventListener("mousedown", handleClickOutside)
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }, [isEditing])

    return (
      <div
        ref={ref}
        onClick={() => setIsEditing(true)}
        className={cn("cursor-text flex items-center w-full h-[40px]", className)}
      >
        {isEditing && !disabled && React.isValidElement(children)
          ? React.cloneElement(children)
          : viewElement || (
              <span className="hover:bg-purple-500 p-1 px-3 hover:bg-opacity-20 w-full rounded-md">
                {value || "Click to edit"}
              </span>
            )}
      </div>
    )
  }
)
