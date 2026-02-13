"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Sun, Moon, LogOut, User } from "lucide-react"
import { useTheme } from "next-themes"
import { CreateLeagueModal } from "@/components/create-league-modal"
import { JoinLeagueModal } from "@/components/join-league-modal"
import { AuthModal } from "@/components/auth-modal"
import { useAuth } from "@/components/auth-provider"

const navigation = [
  { name: "Dashboard", href: "/dashboard", requiresAuth: true },
  { name: "My Leagues", href: "/leagues", requiresAuth: true },
  { name: "How It Works", href: "/how-it-works", requiresAuth: false },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authModalTab, setAuthModalTab] = useState<"login" | "signup">("login")
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const { user, logout } = useAuth()

  const handleNavClick = (item: { name: string; href: string; requiresAuth: boolean }) => {
    if (item.requiresAuth && !user) {
      setAuthModalTab("login")
      setAuthModalOpen(true)
      return
    }
    // Navigation will proceed normally for authenticated users or non-auth required pages
  }

  const handleLogout = () => {
    logout()
    setIsOpen(false)
  }

  const handleCreateLeagueClick = () => {
    if (!user) {
      setAuthModalTab("signup")
      setAuthModalOpen(true)
    }
  }

  const handleJoinLeagueClick = () => {
    if (!user) {
      setAuthModalTab("login")
      setAuthModalOpen(true)
    }
  }

  return (
    <>
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                {/* Updated logo src to use the new transparent Calcutta Fantasy logo */}
                <img src="/images/calcutta-fantasy-logo.jpg" alt="Calcutta Fantasy" className="h-8 w-auto" />
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Calcutta Fantasy
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:space-x-8">
              {navigation.map((item) => {
                if (item.requiresAuth && !user) {
                  return (
                    <button
                      key={item.name}
                      onClick={() => handleNavClick(item)}
                      className="px-3 py-2 text-sm font-medium transition-colors hover:text-primary text-muted-foreground"
                    >
                      {item.name}
                    </button>
                  )
                }
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`px-3 py-2 text-sm font-medium transition-colors hover:text-primary ${
                      pathname === item.href ? "text-primary border-b-2 border-primary" : "text-muted-foreground"
                    }`}
                  >
                    {item.name}
                  </Link>
                )
              })}

              {user ? (
                <JoinLeagueModal>
                  <Button variant="outline">Join League</Button>
                </JoinLeagueModal>
              ) : (
                <Button variant="outline" onClick={handleJoinLeagueClick}>
                  Join League
                </Button>
              )}

              <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>

              <div className="flex items-center space-x-4">
                {user ? (
                  <>
                    <span className="text-sm text-muted-foreground">Welcome, {user.name}</span>
                    <Link href="/profile">
                      <Button variant="ghost" size="icon">
                        <User className="h-5 w-5" />
                      </Button>
                    </Link>
                    <CreateLeagueModal>
                      <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white">
                        Create League
                      </Button>
                    </CreateLeagueModal>
                    <Button variant="outline" onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setAuthModalTab("login")
                        setAuthModalOpen(true)
                      }}
                    >
                      Login
                    </Button>
                    <Button
                      onClick={() => {
                        setAuthModalTab("signup")
                        setAuthModalOpen(true)
                      }}
                      className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white"
                    >
                      Sign Up
                    </Button>
                    <Button
                      className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white"
                      onClick={handleCreateLeagueClick}
                    >
                      Create League
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden flex items-center space-x-2">
              <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <div className="flex flex-col space-y-4 mt-8">
                    {navigation.map((item) => {
                      if (item.requiresAuth && !user) {
                        return (
                          <button
                            key={item.name}
                            onClick={() => {
                              handleNavClick(item)
                              setIsOpen(false)
                            }}
                            className="px-3 py-2 text-lg font-medium transition-colors hover:text-primary text-muted-foreground text-left"
                          >
                            {item.name}
                          </button>
                        )
                      }
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={`px-3 py-2 text-lg font-medium transition-colors hover:text-primary ${
                            pathname === item.href ? "text-primary" : "text-muted-foreground"
                          }`}
                          onClick={() => setIsOpen(false)}
                        >
                          {item.name}
                        </Link>
                      )
                    })}

                    <div className="flex flex-col space-y-2 pt-4">
                      {user ? (
                        <>
                          <div className="px-3 py-2 text-sm text-muted-foreground">Welcome, {user.name}</div>
                          <Link href="/profile" onClick={() => setIsOpen(false)}>
                            <Button variant="outline" className="w-full bg-transparent">
                              <User className="h-4 w-4 mr-2" />
                              Profile
                            </Button>
                          </Link>
                          <JoinLeagueModal>
                            <Button variant="outline" className="w-full bg-transparent">
                              Join League
                            </Button>
                          </JoinLeagueModal>
                          <CreateLeagueModal>
                            <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white">
                              Create League
                            </Button>
                          </CreateLeagueModal>
                          <Button variant="outline" onClick={handleLogout}>
                            <LogOut className="h-4 w-4 mr-2" />
                            Logout
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setAuthModalTab("login")
                              setAuthModalOpen(true)
                              setIsOpen(false)
                            }}
                          >
                            Login
                          </Button>
                          <Button
                            onClick={() => {
                              setAuthModalTab("signup")
                              setAuthModalOpen(true)
                              setIsOpen(false)
                            }}
                            className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white"
                          >
                            Sign Up
                          </Button>
                          <Button
                            onClick={() => {
                              handleJoinLeagueClick()
                              setIsOpen(false)
                            }}
                            variant="outline"
                            className="w-full bg-transparent"
                          >
                            Join League
                          </Button>
                          <Button
                            onClick={() => {
                              handleCreateLeagueClick()
                              setIsOpen(false)
                            }}
                            className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white"
                          >
                            Create League
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} defaultTab={authModalTab} />
    </>
  )
}
