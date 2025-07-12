import { cookies } from "next/headers"
import { NuqsAdapter } from "nuqs/adapters/next/app"

import { AuthCheck } from "@/features/auth/components/auth-check"
import { ReactQueryProvider } from "@/providers/react-query-provider"
import { ThemeProvider } from "@/providers/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Toaster } from "@/components/ui/toaster"
import { Main } from "./main"

type RootLayoutProps = Readonly<{ children: React.ReactNode }>

export default async function RootLayout({ children }: RootLayoutProps) {
  const cookieStore = await cookies()
  const isOpenSidebar = cookieStore.get("sidebar:state")?.value === "false"
  return (
    <AuthCheck>
      <ReactQueryProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider defaultOpen={!isOpenSidebar}>
            <TooltipProvider>
              <NuqsAdapter>
                <AppSidebar />
                <Main>{children}</Main>
                <Toaster />
              </NuqsAdapter>
            </TooltipProvider>
          </SidebarProvider>
        </ThemeProvider>
      </ReactQueryProvider>
    </AuthCheck>
  )
}
