import { cn } from "@/lib/utils"

import { Label } from "@/components/ui/label"

import { FormField } from "@/features/form/interfaces/form.interface"
import { formTypes } from "@/features/form/constants/form-types"

interface Props {
  field: FormField
}

export const LabelField = ({ field }: Props) => {
  const fieldType = formTypes.find((type) => type.id === field.type)

  return (
    <div className="flex items-center gap-2 w-4/12 ">
      {fieldType?.icon && (
        <fieldType.icon className={cn(fieldType.iconColor, "h-4 w-4 flex-shrink-0")} />
      )}
      <Label htmlFor={field._id} className="truncate">
        {field.label}
      </Label>
    </div>
  )
}
