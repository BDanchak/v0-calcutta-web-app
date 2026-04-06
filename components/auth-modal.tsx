"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { Eye, EyeOff } from "lucide-react"
import Link from "next/link"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  defaultTab?: "login" | "signup"
}

/* Changed: Updated AuthModal to match the design shown in screenshot per user request */
/* This modal now displays the same login UI as /login page with logo, email/password fields, */
/* remember me checkbox, forgot password link, social login buttons, and sign up link */
export function AuthModal({ isOpen, onClose, defaultTab = "login" }: AuthModalProps) {
  /* Changed: Added mode state to toggle between login and signup views per user request */
  const [mode, setMode] = useState<"login" | "signup">(defaultTab)
  const [isLoading, setIsLoading] = useState(false)
  const { login, signup } = useAuth()
  const { toast } = useToast()
  const [showPassword, setShowPassword] = useState(false)
  /* Changed: Added showConfirmPassword state for signup form per user request */
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  /* Changed: Combined form state for both login and signup per user request */
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  /* Changed: Reset mode when defaultTab changes per user request */
  useEffect(() => {
    setMode(defaultTab)
  }, [defaultTab])

  /* Changed: Updated handleLogin to use formData and match screenshot design per user request */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      /* Changed: Call Supabase login and populate profiles table per user request */
      await login(formData.email, formData.password)
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      })
      onClose()
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Please check your credentials and try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  /* Changed: Updated handleSignup to use formData and save to Supabase per user request */
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      /* Changed: Call Supabase signup to save account to database per user request */
      await signup(formData.name, formData.email, formData.password)
      toast({
        title: "Welcome to Calcutta Fantasy!",
        description: "Your account has been created successfully.",
      })
      onClose()
    } catch (error) {
      toast({
        title: "Signup failed",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  /* Changed: Helper function to update form fields per user request */
  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <>
      {/* Changed: Updated Dialog to match screenshot design with logo, form fields, and social login per user request */}
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px] z-50 p-6">
          {/* Changed: Added logo header to match screenshot design per user request */}
          <div className="text-center mb-4">
            <div className="flex justify-center mb-4">
              <img src="/images/calcutta-fantasy-logo-v2.png" alt="Calcutta Fantasy" className="h-12 w-auto" />
            </div>
            {/* Changed: Dynamic heading based on login/signup mode per user request */}
            <h2 className="text-2xl font-bold text-foreground">
              {mode === "login" ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              {mode === "login" 
                ? "Sign in to your Calcutta Fantasy account" 
                : "Sign up for a Calcutta Fantasy account"}
            </p>
          </div>

          {/* Changed: Conditional form rendering based on mode per user request */}
          {mode === "login" ? (
            /* Changed: Login form matching screenshot design per user request */
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="modal-email">Email</Label>
                <Input
                  id="modal-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="modal-password">Password</Label>
                <div className="relative">
                  <Input
                    id="modal-password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                  {/* Changed: Password visibility toggle matching screenshot per user request */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Changed: Remember me and Forgot password row matching screenshot per user request */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    id="modal-remember"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor="modal-remember" className="text-sm">
                    Remember me
                  </Label>
                </div>
                <Link href="/forgot-password" className="text-sm text-primary hover:underline" onClick={onClose}>
                  Forgot password?
                </Link>
              </div>

              {/* Changed: Sign In button with gradient matching screenshot per user request */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          ) : (
            /* Changed: Signup form for creating new accounts per user request */
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="modal-signup-name">Full Name</Label>
                <Input
                  id="modal-signup-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="modal-signup-email">Email</Label>
                <Input
                  id="modal-signup-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="modal-signup-password">Password</Label>
                <div className="relative">
                  <Input
                    id="modal-signup-password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    placeholder="Create a password"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="modal-signup-confirm-password">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="modal-signup-confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange("confirmPassword", e.target.value)}
                    placeholder="Confirm your password"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Changed: Sign Up button with gradient matching screenshot style per user request */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white"
              >
                {isLoading ? "Creating account..." : "Sign Up"}
              </Button>
            </form>
          )}

          {/* Changed: Toggle link between login and signup modes matching screenshot per user request */}
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              {mode === "login" ? (
                <>
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("signup")}
                    className="text-primary hover:underline font-medium"
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className="text-primary hover:underline font-medium"
                  >
                    Sign in
                  </button>
                </>
              )}
            </p>
          </div>

          {/* Changed: Social login section matching screenshot design per user request */}
          <div className="mt-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-muted" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            {/* Changed: Google and Facebook buttons matching screenshot per user request */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Button variant="outline" className="w-full bg-transparent">
                <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </Button>
              <Button variant="outline" className="w-full bg-transparent">
                <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
