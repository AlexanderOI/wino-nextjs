"use client"

import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { TimePicker } from "./time-picker"
import { useState } from "react"

interface Props {
  name: string
  selected?: Date
  onSelect?: (date: Date | undefined, name: string) => void
  className?: string
  widthMinutes?: boolean
}

export function DatePicker({
  name,
  selected,
  onSelect,
  className,
  widthMinutes = false,
}: Props) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(selected)

  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      const updatedDate = new Date(
        newDate.getFullYear(),
        newDate.getMonth(),
        newDate.getDate(),
        selectedDate?.getHours() ?? 0,
        selectedDate?.getMinutes() ?? 0
      )
      setSelectedDate(updatedDate)
      onSelect?.(updatedDate, name)
    }
  }

  const handleTimeChange = (newHour: number, newMinute: number) => {
    const updatedDate = new Date(selectedDate ?? new Date())
    updatedDate.setHours(newHour)
    updatedDate.setMinutes(newMinute)
    setSelectedDate(updatedDate)
    onSelect?.(updatedDate, name)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal mt-1 mb-2",
            !selected && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selected ? format(selected, "PPP HH:mm") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={(date) => onSelect?.(date, name)}
          initialFocus
        />

        <div className="p-3 border-t border-border">
          <TimePicker date={selected} onChange={handleTimeChange} />
        </div>
      </PopoverContent>
    </Popover>
  )
}
