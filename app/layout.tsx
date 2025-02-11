import "./globals.css"
import type { Metadata } from "next"
import { Montserrat } from "next/font/google"
import SessionAuthProvider from "@/context/SessionAuthProvider"
import { ThemeProvider } from "@/providers/theme-provider"
import { Main } from "./main"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { PermissionServer } from "@/features/permission/permission-server"
import { Toaster } from "@/components/ui/toaster"
import { cookies } from "next/headers"
import { TooltipProvider } from "@/components/ui/tooltip"
import { AuthCheck } from "@/features/auth/components/auth-check"

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
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <SidebarProvider defaultOpen={isOpenSidebar}>
                <TooltipProvider>
                  <PermissionServer>
                    <AppSidebar />
                  </PermissionServer>
                  <Main>{children}</Main>
                  <Toaster />
                </TooltipProvider>
              </SidebarProvider>
            </ThemeProvider>
          </AuthCheck>
        </SessionAuthProvider>
      </body>
    </html>
  )
}
