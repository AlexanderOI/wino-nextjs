import { Skeleton } from "@/components/ui/skeleton"

export default function LoadingSkeletonTaskBoard() {
  return (
    <div className="h-full overflow-hidden">
      <div className="flex justify-between items-center mb-4 px-4 pt-4">
        <Skeleton className="w-[200px] h-[40px]" />

        <div className="flex items-center space-x-2">
          <Skeleton className="w-[200px] h-[40px]" />
          <Skeleton className="w-[100px] h-[40px]" />
        </div>
      </div>

      <div className="flex space-x-4 overflow-x-auto px-4 pb-4">
        <Skeleton className="w-1/4 h-[300px]" />
        <Skeleton className="w-1/4 h-[300px]" />
        <Skeleton className="w-1/4 h-[300px]" />
        <Skeleton className="w-1/4 h-[300px]" />
      </div>
    </div>
  )
}
