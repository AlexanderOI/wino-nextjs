"use server"

import { SidebarProvider as SidebarProviderUI } from "@/components/ui/sidebar"
import { cookies } from "next/headers"

export const SidebarProvider = async ({ children }: { children: React.ReactNode }) => {
  const cookieStore = await cookies()
  const isOpenSidebar = cookieStore.get("sidebar:state")?.value === "true"
  return <SidebarProviderUI defaultOpen={isOpenSidebar}>{children}</SidebarProviderUI>
}
