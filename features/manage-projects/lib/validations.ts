import { createSearchParamsCache, parseAsInteger, parseAsString } from "nuqs/server"

export const searchParamsCache = createSearchParamsCache({
  limit: parseAsInteger.withDefault(6),
  page: parseAsInteger.withDefault(1),
  search: parseAsString.withDefault(""),
})

export type GetProjectsSchema = Awaited<ReturnType<typeof searchParamsCache.parse>>
