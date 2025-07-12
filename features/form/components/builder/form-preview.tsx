"use client"

import { useState } from "react"

import { cn } from "@/lib/utils"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { EditableField } from "@/components/common/form/editable-field"

import { DetailItemContainer } from "@/features/tasks/components/dialog/dialog-details"
import { formTypes } from "@/features/form/constants/form-types"
import { FormField } from "@/features/form/interfaces/form.interface"
import { useFormStore } from "@/features/form/store/form.store"
import { DatePicker } from "@/components/ui/date-picker"
import { format, isValid } from "date-fns"

export function FormPreview() {
  const { formSchema } = useFormStore()
  const [formData, setFormData] = useState<Record<string, any>>({})

  const handleChange = (fieldId: string, value: string | number | Date) => {
    setFormData({
      ...formData,
      [fieldId]: value,
    })
  }

  if (formSchema.fields.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No fields added yet. Go back to the editor to add some fields.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {formSchema.fields.map((field) => (
        <div key={field._id} className="space-y-2">
          <DetailItemContainer>
            <LabelWithIcon field={field} />
            <Field field={field} handleChange={handleChange} formData={formData} />
          </DetailItemContainer>
        </div>
      ))}
    </div>
  )
}

interface FieldProps {
  field: FormField
  handleChange: (fieldId: string, value: string | number | Date) => void
  formData: Record<string, any>
}

const Field = ({ field, handleChange, formData }: FieldProps) => {
  let value = formData[field._id] || field.placeholder
  let fieldValue = value

  if (field.type === "date" || field.type === "datetime") {
    value = value ? new Date(value) : new Date()
    fieldValue =
      value && isValid(value)
        ? format(value, field.type === "date" ? "PPP" : "PPP HH:mm")
        : field.placeholder
  }

  return (
    <>
      <EditableField
        value={fieldValue || field.placeholder}
        onClose={(name) => console.log(name)}
        className="w-7/12"
      >
        <>
          {field.type === "text" && (
            <Input
              id={field._id}
              type="text"
              value={value}
              onChange={(e) => handleChange(field._id, e.target.value)}
            />
          )}

          {field.type === "number" && (
            <Input
              id={field._id}
              type="number"
              value={value}
              onChange={(e) => handleChange(field._id, e.target.value)}
            />
          )}

          {field.type === "email" && (
            <Input
              id={field._id}
              type="email"
              value={value}
              onChange={(e) => handleChange(field._id, e.target.value)}
            />
          )}

          {field.type === "select" && (
            <Select
              value={value}
              onValueChange={(value) => handleChange(field._id, value)}
            >
              <SelectTrigger id={field._id}>
                <SelectValue placeholder={field.placeholder} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{field.label}</SelectLabel>
                  {field.options
                    ?.filter((option) => option.value !== "")
                    .map((option) => (
                      <SelectItem key={option._id} value={option.value.toString()}>
                        {option.value.toString()}
                      </SelectItem>
                    ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}

          {field.type === "date" && (
            <DatePicker
              name={field._id}
              selected={value || undefined}
              onSelect={(name, date) => handleChange(field._id, date ?? new Date())}
            />
          )}

          {field.type === "datetime" && (
            <DatePicker
              name={field._id}
              selected={value || undefined}
              onSelect={(name, date) => handleChange(field._id, date ?? new Date())}
              widthMinutes
            />
          )}
        </>
      </EditableField>
    </>
  )
}

const LabelWithIcon = ({ field }: { field: FormField }) => {
  const fieldIcon = formTypes.find((type) => type.id === field.type)

  return (
    <div className="flex items-center gap-2 w-4/12 ">
      {fieldIcon && (
        <fieldIcon.icon className={cn(fieldIcon.iconColor, "h-4 w-4 flex-shrink-0")} />
      )}
      <Label htmlFor={field._id} className="truncate">
        {field.label}
      </Label>
    </div>
  )
}
