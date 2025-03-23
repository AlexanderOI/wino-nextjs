"use client"

import { useState } from "react"
import { PlusCircle } from "lucide-react"

import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

import { formTypes } from "@/features/form/constants/form-types"
import { FieldType } from "@/features/form/interfaces/form.interface"
import { useFormStore } from "@/features/form/store/form.store"

interface Props {
  index: number
}

export function FieldSelectPopover({ index }: Props) {
  const [isOpen, setIsOpen] = useState(false)

  const addField = useFormStore((state) => state.addField)

  const handleClickAddField = (type: FieldType) => {
    const placeholder = formTypes.find((t) => t.id === type)?.placeholder || ""
    addField(index, type, placeholder)
    setIsOpen(false)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="flex justify-center py-1">
          <Button className="bg-transparent h-6 py-0.5 px-2 border-none text-xs text-purple-500 hover:bg-purple-500/10 hover:text-purple-500 flex items-center gap-1">
            <PlusCircle className="h-3 w-3" />
            Add Field
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="flex w-auto max-w-[900px] gap-2 bg-background">
        <div className="flex flex-col md:flex-row gap-2">
          {formTypes.map((type) => (
            <Button
              key={type.id}
              variant="outline"
              className="text-xs w-28"
              onClick={() => handleClickAddField(type.id)}
            >
              <type.icon className={cn(type.iconColor)} />
              <span>{type.name}</span>
            </Button>
          ))}

          {/* <Button variant="outline" className="text-xs w-28">
            <RefreshCcw className="h-3 w-3" />
            <span>re-use</span>
          </Button> */}
        </div>
      </PopoverContent>
    </Popover>
  )
}
