"use server"

import { SessionAuthProvider } from "@/context/SessionAuthProvider"
import { ReactQueryProvider } from "./react-quey-provider"
import { AuthCheck } from "@/features/auth/components/auth-check"
import { ThemeProvider } from "next-themes"
import { SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionAuthProvider>
      <AuthCheck>
        <ReactQueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <SidebarProvider>
              <TooltipProvider>{children}</TooltipProvider>
            </SidebarProvider>
          </ThemeProvider>
        </ReactQueryProvider>
      </AuthCheck>
    </SessionAuthProvider>
  )
}
