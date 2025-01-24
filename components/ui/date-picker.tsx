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
  onSelect?: (name: string, date: Date | undefined) => void
  className?: string
  widthMinutes?: boolean
  onPopoverClose?: (hasChanges: boolean) => void
}

export function DatePicker({
  name,
  selected,
  onSelect,
  className,
  widthMinutes = false,
}: Props) {
  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      const updatedDate = new Date(
        newDate.getFullYear(),
        newDate.getMonth(),
        newDate.getDate(),
        isNaN(selected?.getHours() ?? 0) ? 0 : selected?.getHours() ?? 0,
        isNaN(selected?.getMinutes() ?? 0) ? 0 : selected?.getMinutes() ?? 0
      )
      onSelect?.(name, updatedDate)
    }
  }

  const handleTimeChange = (newHour: number, newMinute: number) => {
    const updatedDate = new Date(selected ?? new Date())
    updatedDate.setHours(newHour)
    updatedDate.setMinutes(newMinute)
    onSelect?.(name, updatedDate)
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
          {selected && selected instanceof Date && !isNaN(selected.getTime()) ? (
            format(selected, "PPP HH:mm")
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={(date) => handleDateSelect(date)}
          initialFocus
        />
        {widthMinutes && (
          <div className="p-3 border-t border-border">
            <TimePicker date={selected} onChange={handleTimeChange} />
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
