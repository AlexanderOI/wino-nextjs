"use client"

import { format } from "date-fns"

export function formatDateWithoutTimezone(
  date: Date | string | number | undefined,
  formatString: string = "PPP"
) {
  if (!date) return ""
  const dateInstance = new Date(date)

  const dateWithoutTimezone = dateInstance
    ? new Date(dateInstance.getTime() + dateInstance.getTimezoneOffset() * 60000)
    : null

  return dateWithoutTimezone ? format(dateWithoutTimezone, formatString) : "No datetime"
}

export const formatDateForUrl = (date: Date | undefined) => {
  if (!date) return undefined
  return format(date, "yyyy-MM-dd")
}
