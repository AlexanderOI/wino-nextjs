"use client"

import * as React from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface TimePickerProps {
  date?: Date
  onChange: (hour: number, minute: number) => void
}
const hours = Array.from({ length: 24 }, (_, i) => i)
const minutes = Array.from({ length: 60 / 5 }, (_, i) => i * 5)

const HourItems = React.memo(() => (
  <>
    {hours.map((hour) => (
      <SelectItem key={hour} value={hour.toString()}>
        {hour.toString().padStart(2, "0")}
      </SelectItem>
    ))}
  </>
))
HourItems.displayName = "HourItems"

const MinuteItems = React.memo(() => (
  <>
    {minutes.map((minute) => (
      <SelectItem key={minute} value={minute.toString()}>
        {minute.toString().padStart(2, "0")}
      </SelectItem>
    ))}
  </>
))
MinuteItems.displayName = "MinuteItems"

export const TimePicker = React.memo(function TimePicker({
  date,
  onChange,
}: TimePickerProps) {
  const handleHourChange = React.useCallback(
    (value: string) => {
      onChange(parseInt(value), date?.getMinutes() ?? 0)
    },
    [onChange, date?.getMinutes()]
  )

  const handleMinuteChange = React.useCallback(
    (value: string) => {
      onChange(date?.getHours() ?? 0, parseInt(value))
    },
    [onChange, date?.getHours()]
  )

  const currentHour = React.useMemo(() => date?.getHours().toString() ?? "", [date])
  const currentMinute = React.useMemo(() => date?.getMinutes().toString() ?? "", [date])

  return (
    <div className="flex space-x-2">
      <Select onValueChange={handleHourChange} value={currentHour}>
        <SelectTrigger className="w-1/2 bg-purple-light">
          <SelectValue placeholder="Hour" />
        </SelectTrigger>
        <SelectContent>
          <HourItems />
        </SelectContent>
      </Select>
      <Select onValueChange={handleMinuteChange} value={currentMinute}>
        <SelectTrigger className="w-1/2 bg-purple-light">
          <SelectValue placeholder="Minute" />
        </SelectTrigger>
        <SelectContent>
          <MinuteItems />
        </SelectContent>
      </Select>
    </div>
  )
})
