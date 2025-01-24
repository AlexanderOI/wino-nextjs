import { DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

export function SkeletonTaskDialog() {
  return (
    <>
      <div className="w-7/12 pr-4">
        <DialogHeader>
          <DialogTitle>
            <Skeleton className="w-32 h-6" />
          </DialogTitle>
        </DialogHeader>

        <div className="mb-6 mt-3">
          <Skeleton className="w-24 h-6" />
          <Skeleton className="w-full h-20 rounded-md mt-2" />
        </div>
      </div>

      <div className="flex flex-col gap-2 w-5/12 border p-5 mt-16 rounded-md">
        <div className="mb-5">
          <Skeleton className="w-24 h-6" />
        </div>

        <SkeletonField />

        <DetailItemContainer>
          <Skeleton className="w-32 h-6" />

          <div className="flex w-7/12 gap-2">
            <Skeleton className="w-6 h-6 rounded-full" />
            <Skeleton className="w-full h-6" />
          </div>
        </DetailItemContainer>

        <SkeletonField />

        <SkeletonField />
      </div>
    </>
  )
}

function DetailItemContainer({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex flex-row items-center justify-between text-nowrap gap-2 h-10",
        className
      )}
    >
      {children}
    </div>
  )
}

function SkeletonField() {
  return (
    <DetailItemContainer>
      <Skeleton className="w-32 h-6" />
      <Skeleton className="w-7/12 h-6" />
    </DetailItemContainer>
  )
}
