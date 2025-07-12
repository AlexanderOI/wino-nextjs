"use client"

import { memo, useMemo } from "react"
import { format, isValid } from "date-fns"

import { DatePicker } from "@/components/ui/date-picker"
import { SelectItem } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

import { SelectSimple } from "@/components/common/form/select-simple"
import { EditableField } from "@/components/common/form/editable-field"

import { FormField } from "@/features/form/interfaces/form.interface"

interface FieldFactoryProps {
  field: FormField
  value: string | number | Date
  name: string
  handleChange: (name: string, value: string | number | Date) => void
}

const FieldFactory = ({ field, value, name, handleChange }: FieldFactoryProps) => {
  switch (field.type) {
    case "text":
    case "number":
    case "email":
      return (
        <Input
          type={field.type}
          name={name}
          value={value.toString()}
          onChange={(e) => handleChange(field._id, e.target.value)}
        />
      )

    case "select":
      return (
        <SelectSimple
          value={value.toString()}
          onValueChange={(name, val) => handleChange(field._id, val)}
          name={name}
          label={field.label}
        >
          {field.options
            ?.filter((opt) => opt.value !== "")
            .map((opt) => (
              <SelectItem key={opt._id} value={opt._id}>
                {opt.value.toString()}
              </SelectItem>
            ))}
        </SelectSimple>
      )

    case "date":
    case "datetime":
      return (
        <DatePicker
          name={name}
          selected={value instanceof Date ? value : undefined}
          onSelect={(name, date) => handleChange(field._id, date ?? new Date())}
          widthMinutes={field.type === "datetime"}
        />
      )

    default:
      return null
  }
}

interface FieldProps {
  field: FormField
  formData: Record<string, string | number | Date>
  handleChange: (name: string, value: string | number | Date) => void
  onClose: (name: string, wasChanged: boolean) => void
}

export const FieldTask = memo(
  ({ field, handleChange, formData, onClose }: FieldProps) => {
    let value = formData[field._id] || ""
    const displayValue = useMemo(() => getDisplayValue(field, value), [field, value])

    return (
      <EditableField
        value={displayValue.toString() || field.placeholder}
        onClose={(name, wasChanged) => onClose(name, wasChanged)}
        className="w-7/12"
      >
        <FieldFactory
          field={field}
          value={value}
          name={field._id}
          handleChange={handleChange}
        />
      </EditableField>
    )
  }
)

const getDisplayValue = (field: FormField, value: string | number | Date) => {
  if (field.type.includes("date")) {
    return isValid(value)
      ? format(value, field.type === "date" ? "PPP" : "PPP HH:mm")
      : field.placeholder
  }

  if (field.type === "select") {
    const option = field.options?.find((opt) => opt._id === value)
    return option?.value || field.placeholder
  }

  return value.toString() || field.placeholder
}
