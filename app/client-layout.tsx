"use client"

import type React from "react"

import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { Footer } from "@/components/footer"
import { usePathname } from "next/navigation"
import { AuthProvider } from "@/components/auth-provider"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAuctionPage = pathname?.includes("/auction")

  return (
    <AuthProvider>
      {/* Changed defaultTheme from "system" to "dark" so the site opens in dark mode by default for all users */}
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
        <div className="min-h-screen flex flex-col">
          <main className="flex-1">{children}</main>
          {!isAuctionPage && <Footer />}
        </div>
        <Toaster />
      </ThemeProvider>
    </AuthProvider>
  )
}
