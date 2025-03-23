import { cn } from "@/lib/utils"
import { Link } from "lucide-react"

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

import { formTypes } from "@/features/form/constants/form-types"
import { FormField, FormSchema } from "@/features/form/interfaces/form.interface"

export function FieldCardHover({ form }: { form: FormSchema }) {
  return (
    <HoverCard openDelay={20}>
      <HoverCardTrigger className="text-purple-400">
        {form.fields.length}
      </HoverCardTrigger>
      <HoverCardContent className="flex flex-col gap-4 bg-purple-deep p-4 rounded-md">
        {form.fields.map((field) => (
          <FieldView key={field._id} field={field} />
        ))}

        <Link href={`/forms/edit/${form._id}`}>
          <Button
            variant="ghost"
            className="w-full hover:bg-purple-light border border-gray-400"
          >
            Edit Fields
          </Button>
        </Link>
      </HoverCardContent>
    </HoverCard>
  )
}

function FieldView({ field }: { field: FormField }) {
  const fieldIcon = formTypes.find((type) => type.id === field.type)

  return (
    <div className="flex items-center gap-2">
      {fieldIcon && (
        <fieldIcon.icon className={cn(fieldIcon.iconColor, "h-4 w-4 flex-shrink-0")} />
      )}
      <Label htmlFor={field._id} className="truncate">
        {field.label}
      </Label>
    </div>
  )
}
