"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Navigation } from "@/components/navigation"
import { Calendar, Users, DollarSign, Trophy, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CreateTournamentPage() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    tournament: "",
    maxParticipants: "",
    entryFee: "",
    auctionDate: "",
    auctionTime: "",
    isPublic: false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Tournament created:", formData)
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/tournaments">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tournaments
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Create Tournament</h1>
          <p className="text-muted-foreground">Set up a new Calcutta-style auction tournament</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Tournament Details</CardTitle>
            <CardDescription>Configure your tournament settings and auction parameters</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Tournament Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., March Madness 2024"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tournament">Tournament Type</Label>
                  <Select value={formData.tournament} onValueChange={(value) => handleInputChange("tournament", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select tournament" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="march-madness">March Madness</SelectItem>
                      <SelectItem value="nfl-playoffs">NFL Playoffs</SelectItem>
                      <SelectItem value="world-cup">World Cup</SelectItem>
                      <SelectItem value="nba-playoffs">NBA Playoffs</SelectItem>
                      <SelectItem value="custom">Custom Tournament</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxParticipants">Max Participants</Label>
                  <Select
                    value={formData.maxParticipants}
                    onValueChange={(value) => handleInputChange("maxParticipants", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select max participants" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="8">8 Participants</SelectItem>
                      <SelectItem value="12">12 Participants</SelectItem>
                      <SelectItem value="16">16 Participants</SelectItem>
                      <SelectItem value="20">20 Participants</SelectItem>
                      <SelectItem value="24">24 Participants</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="entryFee">Entry Fee ($)</Label>
                  <Input
                    id="entryFee"
                    type="number"
                    placeholder="50"
                    value={formData.entryFee}
                    onChange={(e) => handleInputChange("entryFee", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="auctionDate">Auction Date</Label>
                  <Input
                    id="auctionDate"
                    type="date"
                    value={formData.auctionDate}
                    onChange={(e) => handleInputChange("auctionDate", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="auctionTime">Auction Time</Label>
                  <Input
                    id="auctionTime"
                    type="time"
                    value={formData.auctionTime}
                    onChange={(e) => handleInputChange("auctionTime", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your tournament, rules, or any special instructions..."
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={4}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isPublic"
                  checked={formData.isPublic}
                  onCheckedChange={(checked) => handleInputChange("isPublic", checked as boolean)}
                />
                <Label
                  htmlFor="isPublic"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Make this tournament public (others can discover and join)
                </Label>
              </div>

              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" asChild>
                  <Link href="/tournaments">Cancel</Link>
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white"
                >
                  <Trophy className="h-4 w-4 mr-2" />
                  Create Tournament
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Tournament Preview */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Tournament Preview</CardTitle>
            <CardDescription>How your tournament will appear to participants</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg p-6 bg-muted/50">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold">{formData.name || "Tournament Name"}</h3>
                  <p className="text-muted-foreground">{formData.tournament || "Tournament Type"}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Entry Fee</p>
                  <p className="text-2xl font-bold text-primary">${formData.entryFee || "0"}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">0/{formData.maxParticipants || "0"} participants</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{formData.auctionDate || "Date TBD"}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Prize Pool: $0</span>
                </div>
              </div>

              {formData.description && <p className="text-sm text-muted-foreground">{formData.description}</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
