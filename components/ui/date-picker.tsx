"use client"

import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { TimePicker } from "./time-picker"
import { useEffect, useState } from "react"

interface Props {
  name: string
  selected?: Date
  onSelect?: (name: string, date: Date | undefined) => void
  className?: string
  widthMinutes?: boolean
  onClose?: () => void
}

export function DatePicker({
  name,
  selected,
  onSelect,
  onClose,
  className,
  widthMinutes = false,
}: Props) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(selected)
  const [isOpen, setIsOpen] = useState(false)

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
      onSelect?.(name, updatedDate)
    }
  }

  const handleTimeChange = (newHour: number, newMinute: number) => {
    const updatedDate = new Date(selectedDate ?? new Date())
    updatedDate.setHours(newHour)
    updatedDate.setMinutes(newMinute)
    setSelectedDate(updatedDate)
    onSelect?.(name, updatedDate)
  }

  useEffect(() => {
    if (!isOpen) {
      onClose?.()
    }
  }, [isOpen])

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
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
          onSelect={(date) => onSelect?.(name, date)}
          initialFocus
        />

        <div className="p-3 border-t border-border">
          <TimePicker date={selected} onChange={handleTimeChange} />
        </div>
      </PopoverContent>
    </Popover>
  )
}
