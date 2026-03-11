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
          /* Changed: Re-enabled profile fetch from Supabase profiles table per user request */
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single()
          
          setUser({
            id: session.user.id,
            name: profile?.name || session.user.user_metadata?.name || session.user.email || "",
            email: session.user.email || "",
            phone: profile?.phone || "",
            emblem: profile?.emblem || "",
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
        /* Changed: Re-enabled profile fetch from Supabase profiles table per user request */
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single()
        
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
      /* Changed: Re-enabled profile fetch from Supabase profiles table per user request */
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single()
      
      setUser({
        id: data.user.id,
        name: profile?.name || data.user.user_metadata?.name || data.user.email || "",
        email: data.user.email || "",
        phone: profile?.phone || "",
        emblem: profile?.emblem || "",
      })
    }
  }

  const signup = async (name: string, email: string, password: string) => {
    /* Changed: Use Supabase Auth signUp to save user credentials to database per user request */
    console.log("[v0] Auth provider signup called with:", email, name)
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

    console.log("[v0] Supabase signUp response:", { data, error })

    if (error) {
      console.log("[v0] Supabase signUp error:", error.message)
      throw new Error(error.message)
    }

    /* Changed: Set user immediately after signup (profile created via database trigger) */
    if (data.user) {
      console.log("[v0] User created with id:", data.user.id)
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

    /* Changed: Re-enabled profile update to Supabase profiles table per user request */
    const { error } = await supabase
      .from("profiles")
      .update({
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
        emblem: profileData.emblem ?? user.emblem ?? "",
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)

    if (error) {
      throw new Error(error.message)
    }

    /* Changed: Update local user state after successful database update */
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
