"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  handleSelectDate: (value: string) => void
  className?: string
}
export function DatePicker({ handleSelectDate, className }: DatePickerProps) {
  const [date, setDate] = React.useState<Date>()

  const handleDate = (value: Date | undefined) => {
    const dateFormat = format(value ?? "", "yyyy-MM-dd")
    handleSelectDate(dateFormat)
    setDate(value)
  }
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            `${className} justify-start text-left font-normal`,
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "dd/MM/yyyy") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(value) => handleDate(value)}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
