import { Users } from "lucide-react"

import { Skeleton } from "@/components/ui/skeleton"

export default async function TasksPageLoading() {
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="w-full h-[100px]" />
        ))}
      </div>

      <div className="flex w-full items-start justify-between gap-2 p-1">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <Skeleton className="w-full max-w-56 h-10" />
          <Skeleton className="w-full max-w-32 h-10" />
          <Skeleton className="w-full max-w-32 h-10" />
          <Skeleton className="w-full max-w-32 h-10" />
        </div>

        <div className="flex items-center gap-2">
          <Skeleton className="w-28 h-10" />
          <Skeleton className="w-28 h-10" />
          <Skeleton className="w-28 h-10" />
        </div>
      </div>

      <Skeleton className="w-full h-[400px]" />
    </>
  )
}
