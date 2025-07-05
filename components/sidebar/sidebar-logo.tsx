"use client"

import { cn } from "@/lib/utils"
import { useSidebar } from "@/components/ui/sidebar"

export function SidebarLogo() {
  const { open } = useSidebar()
  
  return (
    <div
      className={cn(
        "flex justify-center items-center border-b-2 h-14",
        open ? "text-4xl" : " text-[0.6rem]"
      )}
    >
      <span className=" text-purple-light">{"<"}</span>
      WINO
      <span className=" text-purple-light">{"/>"}</span>
    </div>
  )
} 