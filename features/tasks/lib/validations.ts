import {
  createSearchParamsCache,
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
} from "nuqs/server"
import { z } from "zod"

import { getSortingStateParser } from "@/lib/parsers"
import { Task } from "@/features/tasks/interfaces/task.interface"

export const searchParamsCache = createSearchParamsCache({
  task: parseAsString.withDefault(""),
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  sort: getSortingStateParser<Task>().withDefault([{ id: "createdAt", desc: true }]),
  title: parseAsString.withDefault(""),
  status: parseAsArrayOf(z.string()).withDefault([]),
  createdAt: parseAsArrayOf(z.coerce.number()).withDefault([0, 0]),
  assignedTo: parseAsArrayOf(z.string()).withDefault([]),
})

export type GetTasksSchema = Awaited<ReturnType<typeof searchParamsCache.parse>>
