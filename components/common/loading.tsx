import { CircleDotDashed, Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0f1117] flex flex-col items-center justify-center">
      <div className="text-purple-600 animate-pulse mb-4">
        <CircleDotDashed className="h-10 w-10" />
      </div>
      <div className="flex  justify-center items-center text-3xl md:text-4xl lg:text-5xl mb-5 pb-2 w-full">
        <span className="text-purple-600">{"<"}</span>
        <span className="text-white">WINO</span>
        <span className="text-purple-600">{"/>"}</span>
      </div>
      <div className="flex items-center space-x-2">
        <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
        <p className="text-lg text-gray-300">Loading your workspace...</p>
      </div>
    </div>
  )
}
