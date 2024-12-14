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

// const inter = Inter({ subsets: ["latin"] })
const firaCode = Montserrat({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "WINO",
  description: "WINO",
}

type RootLayoutProps = Readonly<{ children: React.ReactNode }>

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${firaCode.className} antialiased`}>
        <SessionAuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <SidebarProvider>
              <PermissionServer>
                <AppSidebar />
              </PermissionServer>
              <Main>{children}</Main>
              <Toaster />
            </SidebarProvider>
          </ThemeProvider>
        </SessionAuthProvider>
      </body>
    </html>
  )
}
