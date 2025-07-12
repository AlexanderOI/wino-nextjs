import "./globals.css"
import type { Metadata } from "next"
import { Montserrat } from "next/font/google"

import { ThemeProvider } from "@/providers/theme-provider"
import { SessionAuthProvider } from "@/context/SessionAuthProvider"

const firaCode = Montserrat({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "WINO",
  description: "WINO",
}

type RootLayoutProps = Readonly<{ children: React.ReactNode }>

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${firaCode.className} antialiased min-h-screen`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <SessionAuthProvider>{children}</SessionAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
