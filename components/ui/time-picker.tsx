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
  minuteStep?: number
}

export function TimePicker({ date, onChange, minuteStep = 1 }: TimePickerProps) {
  const hours = React.useMemo(() => Array.from({ length: 24 }, (_, i) => i), [])
  const minutes = React.useMemo(
    () => Array.from({ length: 60 / minuteStep }, (_, i) => i * minuteStep),
    [minuteStep]
  )

  const handleHourChange = (value: string) => {
    onChange(parseInt(value), date?.getMinutes() ?? 0)
  }

  const handleMinuteChange = (value: string) => {
    onChange(date?.getHours() ?? 0, parseInt(value))
  }

  return (
    <div className="flex space-x-2">
      <Select onValueChange={handleHourChange} defaultValue={date?.getHours().toString()}>
        <SelectTrigger className="w-1/2 bg-purple-light">
          <SelectValue placeholder="Hour" />
        </SelectTrigger>
        <SelectContent>
          {hours.map((hour) => (
            <SelectItem key={hour} value={hour.toString()}>
              {hour.toString().padStart(2, "0")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        onValueChange={handleMinuteChange}
        defaultValue={date?.getMinutes().toString()}
      >
        <SelectTrigger className="w-1/2 bg-purple-light">
          <SelectValue placeholder="Minute" />
        </SelectTrigger>
        <SelectContent>
          {minutes.map((minute) => (
            <SelectItem key={minute} value={minute.toString()}>
              {minute.toString().padStart(2, "0")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
