"use client"

import { notFound, useRouter } from "next/navigation"

import { useEffect, useRef } from "react"

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
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { AxiosError } from "axios"
import { useQuery } from "@tanstack/react-query"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { FieldSelectPopover } from "@/features/form/components/builder/field-select-popover"
import { SortableFieldCard } from "@/features/form/components/builder/sortable-field-card"
import { FormPreview } from "@/features/form/components/builder/form-preview"
import { useFormStore } from "@/features/form/store/form.store"

import { toast } from "@/components/ui/use-toast"
import { apiClient } from "@/utils/api-client"
import { FormSchema } from "@/features/form/interfaces/form.interface"

import { getFormTask } from "@/features/form/actions/form.action"
import { FormSkeleton } from "./form-skeleton"

export function FormBuilder({ id }: { id?: string }) {
  const router = useRouter()

  const {
    data: formSchemaData,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["form", id],
    queryFn: () => getFormTask(id),
    retry: false,
  })

  const {
    formSchema,
    setFormSchema,
    updateFieldsOrder,
    updateFormName,
    setCurrentFieldSelected,
  } = useFormStore()
  const formRef = useRef<HTMLDivElement>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  useEffect(() => {
    if (id && formSchemaData) {
      setFormSchema(formSchemaData)
    }
  }, [formSchemaData])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setCurrentFieldSelected(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = formSchema.fields.findIndex((f) => f._id === active.id)
      const newIndex = formSchema.fields.findIndex((f) => f._id === over.id)

      const newFields = [...formSchema.fields]
      const [movedField] = newFields.splice(oldIndex, 1)
      newFields.splice(newIndex, 0, movedField)

      updateFieldsOrder(newFields)
    }
  }

  const handleClickSaveForm = async () => {
    try {
      const { _id, ...rest } = formSchema
      const fieldsData = rest.fields.map(({ _id, ...rest }) => {
        return {
          ...rest,
          options: rest.options?.map(({ _id, ...rest }) => ({
            ...rest,
          })),
        }
      })

      const form = {
        name: rest.name,
        fields: fieldsData,
      }

      if (!id) {
        await apiClient.post<FormSchema>("/forms-task", form)
      } else {
        await apiClient.patch<FormSchema>(`/forms-task/${id}`, form)
      }

      toast({
        title: "Form saved",
        description: "Form has been saved successfully",
        duration: 1000,
      })

      router.push(`/forms/edit/${_id}`)
    } catch (error) {
      if (error instanceof AxiosError) {
        toast({
          title: "Error",
          description: error.message,
          duration: 1000,
          variant: "destructive",
        })
      }
    }
  }

  if (isLoading) return <FormSkeleton />
  if (error) return notFound()

  return (
    <div className="space-y-6">
      <div className="flex flex-row sm:flex-col w-full justify-between">
        <Card className="w-full sm:w-auto">
          <CardContent className="flex  justify-between">
            <Label
              htmlFor="form-name"
              className="text-base flex flex-row items-center whitespace-nowrap font-bold"
            >
              Form Name:
              <Input
                id="form-name"
                value={formSchema.name}
                onChange={(e) => updateFormName(e.target.value)}
                className="font-medium m-0"
              />
            </Label>

            <Button
              variant="purple"
              className="w-full sm:w-auto"
              onClick={handleClickSaveForm}
            >
              Save Form
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4">
        <Card className="w-7/12 h-full p-6">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={formSchema.fields.map((f) => f._id)}
              strategy={verticalListSortingStrategy}
            >
              <div ref={formRef}>
                {formSchema.fields.map((field, index) => (
                  <SortableFieldCard key={field._id} field={field} index={index} />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {formSchema.fields.length === 0 && <FieldSelectPopover index={-1} />}
        </Card>

        <Card className="w-5/12 h-full p-3">
          <CardHeader>
            <CardTitle>Preview: {formSchema.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <FormPreview />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
