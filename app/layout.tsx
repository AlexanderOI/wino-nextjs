import "./globals.css"
import type { Metadata } from "next"
import { cookies } from "next/headers"
import { Montserrat } from "next/font/google"
import { NuqsAdapter } from "nuqs/adapters/next/app"

import { PermissionServer } from "@/features/permission/permission-server"
import { AuthCheck } from "@/features/auth/components/auth-check"
import { ReactQueryProvider } from "@/providers/react-query-provider"
import { SessionAuthProvider } from "@/context/SessionAuthProvider"
import { ThemeProvider } from "@/providers/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Toaster } from "@/components/ui/toaster"
import { Main } from "./main"
// const inter = Inter({ subsets: ["latin"] })
const firaCode = Montserrat({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "WINO",
  description: "WINO",
}

type RootLayoutProps = Readonly<{ children: React.ReactNode }>

export default async function RootLayout({ children }: RootLayoutProps) {
  const cookieStore = await cookies()
  const isOpenSidebar = cookieStore.get("sidebar:state")?.value === "true"
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${firaCode.className} antialiased`}>
        <SessionAuthProvider>
          <AuthCheck>
            <ReactQueryProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="dark"
                enableSystem
                disableTransitionOnChange
              >
                <SidebarProvider defaultOpen={isOpenSidebar}>
                  <TooltipProvider>
                    <NuqsAdapter>
                      <PermissionServer>
                        <AppSidebar />
                      </PermissionServer>
                      <Main>{children}</Main>
                      <Toaster />
                    </NuqsAdapter>
                  </TooltipProvider>
                </SidebarProvider>
              </ThemeProvider>
            </ReactQueryProvider>
          </AuthCheck>
        </SessionAuthProvider>
      </body>
    </html>
  )
}
