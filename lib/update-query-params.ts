import { formatDateForUrl } from "@/lib/date-format"
import { isValid } from "date-fns"

type Params = Record<string, string | number | undefined>

export function updateQueryParams(
  currentSearchParams: URLSearchParams,
  newParams: Params
): string {
  const params = new URLSearchParams(currentSearchParams.toString())

  for (const [key, value] of Object.entries(newParams)) {
    if (value === undefined || value === null || value === "") {
      params.delete(key)
    } else {
      let paramValue = isValid(new Date(value))
        ? formatDateForUrl(new Date(value))
        : value

      if (paramValue) {
        params.set(key, paramValue.toString())
      } else {
        params.delete(key)
      }
    }
  }

  return params.toString()
}
