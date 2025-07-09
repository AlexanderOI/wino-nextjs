"use client"

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

import { SortableOption } from "@/features/form/components/builder/sortable-option"
import { useFormStore } from "@/features/form/store/form.store"

interface SelectOptionsEditorProps {
  fieldId: string
}

export function SelectOptionsEditor({ fieldId }: SelectOptionsEditorProps) {
  const { updateFieldOptions } = useFormStore()
  const field = useFormStore((state) =>
    state.formSchema.fields.find((f) => f._id === fieldId)
  )
  const options = field?.options || []

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const addOption = () => {
    const newOption = {
      _id: `option-${Date.now()}`,
      value: "",
      order: options.length + 1,
    }
    updateFieldOptions(fieldId, [...options, newOption])
  }

  const updateOption = (id: string, value: string) => {
    const updatedOptions = options.map((opt) =>
      opt._id === id ? { ...opt, value } : opt
    )
    updateFieldOptions(fieldId, updatedOptions)
  }

  const removeOption = (id: string) => {
    const filteredOptions = options.filter((opt) => opt._id !== id)
    updateFieldOptions(fieldId, filteredOptions)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = options.findIndex((opt) => opt._id === active.id)
      const newIndex = options.findIndex((opt) => opt._id === over.id)
      const newOptions = arrayMove(options, oldIndex, newIndex)
      updateFieldOptions(fieldId, newOptions)
    }
  }

  return (
    <div className="space-y-2">
      <Label>Options</Label>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={options.map((opt) => opt._id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {options.map((option) => (
              <SortableOption
                key={option._id}
                option={option}
                onUpdate={updateOption}
                onRemove={removeOption}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      <Button
        type="button"
        variant="purpleLight"
        size="sm"
        className="mt-2 text-xs"
        onClick={addOption}
      >
        <PlusCircle className="h-3 w-3" />
        Add Option
      </Button>
    </div>
  )
}
