"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { ArrowLeft, Search, Trophy, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const mockLeagues = [
  {
    id: 1,
    name: "March Madness 2024",
    description: "Annual tournament with college friends",
    members: 6,
    maxMembers: 12,
    entryFee: 25,
    auctionDate: "2024-03-15",
  },
  {
    id: 2,
    name: "Office Pool",
    description: "Workplace competition",
    members: 8,
    maxMembers: 16,
    entryFee: 50,
    auctionDate: "2024-03-20",
  },
]

export default function JoinLeaguePage() {
  const [searchCode, setSearchCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const { toast } = useToast()

  const handleJoinByCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate checking league code
    setTimeout(() => {
      // Mock validation - assume codes starting with "VALID" are correct
      if (searchCode.toUpperCase().startsWith("VALID")) {
        toast({
          title: "League Joined!",
          description: `You have successfully joined the league.`,
        })
        setSearchCode("")
      } else {
        setErrorMessage("Invalid league code. Please check the code and try again.")
        setShowErrorModal(true)
      }
      setIsLoading(false)
    }, 1000)
  }

  const handleJoinLeague = async (leagueId: number) => {
    toast({
      title: "League Joined!",
      description: `You have successfully joined the league.`,
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/leagues">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Leagues
            </Link>
          </Button>
          <div className="text-center">
            <Trophy className="h-12 w-12 text-primary mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-foreground">Join League</h1>
            <p className="text-muted-foreground mt-2">Find and join leagues to compete</p>
          </div>
        </div>

        <div className="grid gap-8">
          {/* Join by Code */}
          <Card>
            <CardHeader>
              <CardTitle>Join by League Code</CardTitle>
              <CardDescription>Enter a league code to join a private league</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleJoinByCode} className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="code" className="sr-only">
                    League Code
                  </Label>
                  <Input
                    id="code"
                    value={searchCode}
                    onChange={(e) => {
                      setSearchCode(e.target.value)
                    }}
                    placeholder="Enter league code (e.g., ABC123)"
                    className="uppercase"
                  />
                </div>
                <Button type="submit" disabled={isLoading || !searchCode.trim()}>
                  <Search className="h-4 w-4 mr-2" />
                  {isLoading ? "Joining..." : "Join"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Available Leagues */}
          <Card>
            <CardHeader>
              <CardTitle>Available Leagues</CardTitle>
              <CardDescription>Browse and join public leagues</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockLeagues.map((league) => (
                  <div
                    key={league.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{league.name}</h3>
                      <p className="text-muted-foreground text-sm">{league.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                        <span>
                          {league.members}/{league.maxMembers} members
                        </span>
                        <span>${league.entryFee} entry fee</span>
                        <span>Auction: {league.auctionDate}</span>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleJoinLeague(league.id)}
                      className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white"
                    >
                      Join League
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Error Modal */}
      <Dialog open={showErrorModal} onOpenChange={setShowErrorModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center text-destructive">
              <AlertCircle className="h-5 w-5 mr-2" />
              Error
            </DialogTitle>
            <DialogDescription className="text-left">{errorMessage}</DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button onClick={() => setShowErrorModal(false)}>OK</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
