import React from "react"
import { Button } from "@/components/ui/button"
import { Trash } from "lucide-react"

export const ButtonDelete = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>((props, ref) => {
  return (
    <Button ref={ref} size="icon" className="p-1 bg-destructive text-white" {...props}>
      <Trash />
    </Button>
  )
})

ButtonDelete.displayName = "ButtonDelete"
