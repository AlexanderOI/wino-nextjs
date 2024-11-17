import "./globals.css"
import type { Metadata } from "next"
import { Montserrat } from "next/font/google"
import { getServerSession } from "next-auth/next"
import { authOptions } from "./api/auth/[...nextauth]/route"
import SessionAuthProvider from "@/context/SessionAuthProvider"
import { ThemeProvider } from "@/providers/theme-provider"
import { Main } from "./main"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

// const inter = Inter({ subsets: ["latin"] })
const firaCode = Montserrat({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "WINO",
  description: "WINO",
}

type RootLayoutProps = Readonly<{ children: React.ReactNode }>

export default async function RootLayout({ children }: RootLayoutProps) {
  const session = await getServerSession(authOptions)

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
              <AppSidebar />
              <Main>{children}</Main>
            </SidebarProvider>
          </ThemeProvider>
        </SessionAuthProvider>
      </body>
    </html>
  )
}
