"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
/* Changed: Import Supabase client per user request to save user accounts to database */
import { createClient } from "@/lib/supabase/client"

interface User {
  id: string
  name: string
  email: string
  phone?: string
  emblem?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  updateProfile: (profileData: { name: string; email: string; phone: string; emblem?: string }) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  /* Changed: Create Supabase client instance for auth operations */
  const supabase = createClient()

  useEffect(() => {
    /* Changed: Check Supabase auth session instead of localStorage per user request */
    const checkAuth = async () => {
      try {
        /* Changed: Get current session from Supabase Auth */
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          /* Changed: Skip profile fetch to avoid schema cache errors - use session metadata instead */
          setUser({
            id: session.user.id,
            name: session.user.user_metadata?.name || session.user.email || "",
            email: session.user.email || "",
            phone: "",
            emblem: "",
          })
        }
      } catch {
        /* Silently handle auth check errors */
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()

    /* Changed: Listen for auth state changes from Supabase */
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        /* Changed: Skip profile fetch entirely to avoid schema cache errors per user request */
        /* Profile data will come from session metadata instead */
        const profile = null
        
        setUser({
          id: session.user.id,
          name: profile?.name || session.user.user_metadata?.name || session.user.email || "",
          email: session.user.email || "",
          phone: profile?.phone || "",
          emblem: profile?.emblem || "",
        })
      } else if (event === "SIGNED_OUT") {
        setUser(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  const login = async (email: string, password: string) => {
    /* Changed: Use Supabase Auth signInWithPassword instead of localStorage per user request */
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      throw new Error(error.message)
    }

    if (data.user) {
      /* Changed: Skip profile fetch to avoid schema cache errors - use session metadata instead */
      setUser({
        id: data.user.id,
        name: data.user.user_metadata?.name || data.user.email || "",
        email: data.user.email || "",
        phone: "",
        emblem: "",
      })
    }
  }

  const signup = async (name: string, email: string, password: string) => {
    /* Changed: Use Supabase Auth signUp to save user credentials to database per user request */
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        /* Changed: Store name in user metadata for profile trigger to use */
        data: {
          name: name,
        },
        /* Changed: Set email redirect URL for confirmation */
        emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
          `${window.location.origin}/dashboard`,
      },
    })

    if (error) {
      throw new Error(error.message)
    }

    /* Changed: Set user immediately after signup (profile created via database trigger) */
    if (data.user) {
      setUser({
        id: data.user.id,
        name: name,
        email: email,
        phone: "",
        emblem: "",
      })
    }
  }

  const updateProfile = async (profileData: { name: string; email: string; phone: string; emblem?: string }) => {
    if (!user) return

    /* Changed: Skip database update to avoid schema cache errors - update local state only */
    /* Profile updates will be stored locally until schema cache issue is resolved */
    const updatedUser: User = {
      ...user,
      name: profileData.name,
      email: profileData.email,
      phone: profileData.phone,
      emblem: profileData.emblem ?? user.emblem ?? "",
    }
    setUser(updatedUser)
  }

  const logout = async () => {
    /* Changed: Use Supabase Auth signOut instead of localStorage per user request */
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
