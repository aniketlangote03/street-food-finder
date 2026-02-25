import type React from "react"
import { Space_Grotesk, DM_Sans } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { GoogleMapsLoader } from "@/components/shared/google-maps-loader"
import { MainNav } from "@/components/layout/main-nav"
import UserHeaderActions from "@/components/layout/user-header-actions"
import { MainNavMobile } from "@/components/layout/main-nav-mobile"
import { MainFooter } from "@/components/layout/main-footer"
import { Toaster } from "@/components/ui/toaster"

import "./globals.css"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
})

export const metadata = {
  title: "Street Food Finder",
  description: "Discover the best street food in your city",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${spaceGrotesk.variable} ${dmSans.variable} font-sans antialiased`}>
        <GoogleMapsLoader />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="relative flex min-h-screen flex-col">
            <header className="sticky top-0 z-50 w-full border-b border-cyan-100/20 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
              <div className="container flex h-16 items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <MainNavMobile />
                  <MainNav />
                </div>
                {/* User actions: login buttons when logged out, dropdown with Logout when logged in */}
                <UserHeaderActions />
              </div>
            </header>
            <div className="flex-1">{children}</div>
            <MainFooter />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
