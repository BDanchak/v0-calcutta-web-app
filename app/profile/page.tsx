"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/components/auth-provider"
import { ArrowLeft, Save, Shield, Crown, Trophy, Star, Flag, Target, Medal, Anchor } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function ProfilePage() {
  const { user, updateProfile } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    emblem: "",
  })

  useEffect(() => {
    if (!user) {
      router.push("/")
      return
    }

    setFormData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      emblem: (user as any).emblem || "",
    })
  }, [user, router])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      await updateProfile({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        emblem: formData.emblem,
      })
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return null
  }

  const EMBLEMS = [
    { value: "shield", label: "Shield", Icon: Shield },
    { value: "crown", label: "Crown", Icon: Crown },
    { value: "trophy", label: "Trophy", Icon: Trophy },
    { value: "star", label: "Star", Icon: Star },
    { value: "flag", label: "Flag", Icon: Flag },
    { value: "target", label: "Target", Icon: Target },
    { value: "medal", label: "Medal", Icon: Medal },
    { value: "anchor", label: "Anchor", Icon: Anchor },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Profile Settings</h1>
              <p className="text-muted-foreground">Manage your account information</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter your email address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="space-y-2">
                <Label>Account Emblem</Label>
                <RadioGroup
                  value={formData.emblem}
                  onValueChange={(v) => handleInputChange("emblem", v)}
                  className="grid grid-cols-2 sm:grid-cols-4 gap-3"
                >
                  {EMBLEMS.map(({ value, label, Icon }) => (
                    <label
                      key={value}
                      className="flex items-center gap-3 border rounded-md p-3 cursor-pointer hover:bg-muted/50"
                    >
                      <RadioGroupItem id={`emblem-${value}`} value={value} />
                      <Icon className="h-5 w-5" aria-hidden="true" />
                      <span className="text-sm">{label}</span>
                    </label>
                  ))}
                </RadioGroup>
                <p className="text-xs text-muted-foreground">
                  Choose a simple, colorless 2D emblem to represent your account.
                </p>
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
