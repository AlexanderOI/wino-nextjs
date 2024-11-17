import React from "react"
import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"

export const ButtonEdit = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>((props, ref) => {
  return (
    <Button
      ref={ref}
      size="icon"
      className="p-1 bg-sky-900 text-white"
      {...props}
    >
      <Edit />
    </Button>
  )
})

ButtonEdit.displayName = "ButtonEdit"
