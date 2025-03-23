"use client"

import { Skeleton } from "@/components/ui/skeleton"

export function FormSkeleton() {
  return (
    <div className="space-y-6 h-full">
      <Skeleton className="h-[72px]" />

      <div className="flex gap-4 h-[450px]">
        <Skeleton className="w-7/12 h-full" />

        <Skeleton className="w-5/12 h-full" />
      </div>
    </div>
  )
}
