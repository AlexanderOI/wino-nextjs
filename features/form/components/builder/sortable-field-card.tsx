"use client"

import { memo } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Trash2, GripVertical } from "lucide-react"

import { cn } from "@/lib/utils"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { formTypes } from "@/features/form/constants/form-types"
import { FormField } from "@/features/form/interfaces/form.interface"
import { SelectOptionsEditor } from "@/features/form/components/builder/select-options-editor"
import { FieldSelectPopover } from "@/features/form/components/builder/field-select-popover"
import { useFormStore } from "@/features/form/store/form.store"

interface SortableFieldCardProps {
  field: FormField
  index: number
}

export const SortableFieldCard = memo(({ field, index }: SortableFieldCardProps) => {
  const { currentFieldSelected, setCurrentFieldSelected, updateField, removeField } =
    useFormStore()

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: field._id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const fieldIcon = formTypes.find((type) => type.id === field.type)

  return (
    <div ref={setNodeRef} style={style} data-field-id={field._id}>
      <Card
        key={field._id}
        onClick={() => setCurrentFieldSelected(field)}
        className={cn(currentFieldSelected?._id === field._id && "border-purple-light")}
      >
        <CardHeader>
          <div className="flex items-center justify-between gap-2 w-full">
            <div
              className="cursor-grab hover:bg-accent p-1 rounded"
              {...attributes}
              {...listeners}
            >
              <GripVertical className="h-4 w-4" />
            </div>
            <CardTitle className="text-base flex-1">
              {currentFieldSelected?._id === field._id ? (
                <div className="flex flex-col gap-2">
                  <Input
                    value={field.label}
                    onChange={(e) => updateField(field._id, { label: e.target.value })}
                    className="font-medium m-0"
                  />

                  {/* <Input
                    placeholder="Placeholder"
                    onChange={(e) =>
                      updateField(field._id, { placeholder: e.target.value })
                    }
                  /> */}
                </div>
              ) : (
                <span className="flex items-center font-medium h-10 px-3">
                  {field.label}
                </span>
              )}
            </CardTitle>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => updateField(field._id, { type: field.type })}
                className="h-8 w-8 text-destructive"
              >
                {fieldIcon && (
                  <fieldIcon.icon className={cn("h-4 w-4", fieldIcon.iconColor)} />
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeField(field._id)}
                className="h-8 w-8 text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        {currentFieldSelected?._id === field._id && field.type === "select" && (
          <CardContent className="space-y-4">
            <SelectOptionsEditor fieldId={field._id} />
          </CardContent>
        )}
      </Card>

      <div className="flex justify-center py-1">
        <FieldSelectPopover index={index} />
      </div>
    </div>
  )
})
