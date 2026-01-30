"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

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

  useEffect(() => {
    // Check if user is logged in (simulate checking localStorage/cookies)
    const checkAuth = () => {
      const savedUser = localStorage.getItem("user")
      if (savedUser) {
        setUser(JSON.parse(savedUser))
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    // Simulate login API call - in a real app, this would come from the server
    // For now, check if user exists in localStorage from previous signup
    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]")
    const existingUser = existingUsers.find((u: any) => u.email === email && u.password === password)

    if (!existingUser) {
      throw new Error("Invalid email or password")
    }

    const mockUser: User = {
      id: existingUser.id,
      name: existingUser.name,
      email: email,
      phone: existingUser.phone || "",
      emblem: existingUser.emblem || "",
    }
    setUser(mockUser)
    localStorage.setItem("user", JSON.stringify(mockUser))
  }

  const signup = async (name: string, email: string, password: string) => {
    // Simulate signup API call
    const mockUser = {
      id: Date.now().toString(), // Generate unique ID
      name: name,
      email: email,
      password: password, // Store password for login validation
      phone: "",
      emblem: "",
    }

    // Store user in users array for future login
    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]")
    const updatedUsers = [...existingUsers.filter((u: any) => u.email !== email), mockUser]
    localStorage.setItem("users", JSON.stringify(updatedUsers))

    const userToStore: User = {
      id: mockUser.id,
      name: mockUser.name,
      email: mockUser.email,
      phone: mockUser.phone,
      emblem: mockUser.emblem,
    }
    setUser(userToStore)
    localStorage.setItem("user", JSON.stringify(userToStore))
  }

  const updateProfile = async (profileData: { name: string; email: string; phone: string; emblem?: string }) => {
    if (!user) return

    // Update user in users array
    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]")
    const updatedUsers = existingUsers.map((u: any) =>
      u.id === user.id
        ? {
            ...u,
            name: profileData.name,
            email: profileData.email,
            phone: profileData.phone,
            emblem: profileData.emblem ?? u.emblem ?? "",
          }
        : u,
    )
    localStorage.setItem("users", JSON.stringify(updatedUsers))

    // Update current user
    const updatedUser: User = {
      ...user,
      name: profileData.name,
      email: profileData.email,
      phone: profileData.phone,
      emblem: profileData.emblem ?? user.emblem ?? "",
    }
    setUser(updatedUser)
    localStorage.setItem("user", JSON.stringify(updatedUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
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
