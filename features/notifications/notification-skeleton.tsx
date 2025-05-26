"use client"

import { cn } from "@/lib/utils"

import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

type NotificationSkeletonProps = {
  count?: number
}

export const NotificationSkeleton = ({ count = 5 }: NotificationSkeletonProps) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index + "skeleton"} className={cn("p-4 transition-colors")}>
          <div className="flex gap-4">
            <div className="flex flex-col w-full gap-2 mb-1">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-full max-w-96" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="flex items-start gap-6">
              <Skeleton className="h-6 w-6" />
              <Skeleton className="h-6 w-6" />
            </div>
          </div>
        </Card>
      ))}
    </>
  )
}
