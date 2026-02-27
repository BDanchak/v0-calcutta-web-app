"use client"

import type React from "react"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth-provider"
import { AuthModal } from "@/components/auth-modal"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Users, DollarSign, Calendar, Trophy, X, ArrowLeft } from "lucide-react"
import { leagueStore } from "@/lib/league-store"

interface JoinLeagueModalProps {
  children: React.ReactNode
  onLeagueJoined?: () => void
}

export function JoinLeagueModal({ children, onLeagueJoined }: JoinLeagueModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [leagueCode, setLeagueCode] = useState("")
  const [previewLeague, setPreviewLeague] = useState<any>(null)
  const { toast } = useToast()
  const { user } = useAuth()
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const allLeagues = leagueStore.getState().getAllLeagues()
  const mockAvailableLeagues = allLeagues.filter((league) => {
    return league.status === "upcoming" && (!user || !leagueStore.getState().isUserMember(league.id, user.id))
  })

  const handleJoinLeague = async (leagueId: number, leagueName: string) => {
    if (user) {
      /* Added await for async joinLeague per Supabase persistence update */
      const success = await leagueStore.getState().joinLeague(leagueId.toString(), user.id)
      if (success) {
        toast({
          title: "League Joined!",
          description: `You have successfully joined "${leagueName}".`,
        })
        setIsOpen(false)
        setPreviewLeague(null)
        setLeagueCode("")
        if (onLeagueJoined) {
          onLeagueJoined()
        }
      } else {
        toast({
          title: "Unable to join league",
          description: "The league may be full or you may already be a member.",
          variant: "destructive",
        })
      }
    }
  }

  const handleJoinByCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const targetLeague = allLeagues.find((league) => league.inviteCode === leagueCode)

    if (!targetLeague) {
      toast({
        title: "Invalid League Code",
        description: "The league code you entered is incorrect. Please check and try again.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    // Show league preview instead of immediately joining
    setPreviewLeague(targetLeague)
    setIsLoading(false)
  }

  const handleBackToMain = () => {
    setPreviewLeague(null)
    setLeagueCode("")
  }

  return (
    <>
      <div
        onClick={() => {
          if (!user) {
            setAuthModalOpen(true)
            return
          }
          setIsOpen(true)
        }}
      >
        {children}
      </div>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} defaultTab="login" />

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {previewLeague ? (
            // League Preview View
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle className="flex items-center">
                    <Trophy className="h-5 w-5 mr-2 text-primary" />
                    League Preview
                  </DialogTitle>
                  <Button variant="ghost" size="sm" onClick={handleBackToMain} className="h-8 w-8 p-0">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <DialogDescription>Review league details before joining</DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-2xl">{previewLeague.name}</CardTitle>
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        Open
                      </Badge>
                    </div>
                    <CardDescription className="text-base">{previewLeague.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <Users className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Members</p>
                            <p className="text-sm text-muted-foreground">
                              {previewLeague.members}/{previewLeague.maxMembers} joined
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <DollarSign className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Entry Fee</p>
                            <p className="text-sm text-muted-foreground">${previewLeague.entryFee}</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <Calendar className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Auction Date</p>
                            <p className="text-sm text-muted-foreground">{previewLeague.auctionDate}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Trophy className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Organizer</p>
                            <p className="text-sm text-muted-foreground">{previewLeague.organizer}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        onClick={() => handleJoinLeague(previewLeague.id, previewLeague.name)}
                        className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white flex-1"
                      >
                        Join League
                      </Button>
                      <Button variant="outline" onClick={handleBackToMain}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          ) : (
            // Main Join League View
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center">
                  <Trophy className="h-5 w-5 mr-2 text-primary" />
                  Join League
                </DialogTitle>
                <DialogDescription>Find and join leagues to compete with friends and other players</DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Join by Code */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Join by League Code</CardTitle>
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
                          value={leagueCode}
                          onChange={(e) => setLeagueCode(e.target.value.toUpperCase())}
                          placeholder="Enter league code (e.g., ABC123)"
                          className="uppercase"
                          maxLength={6}
                        />
                      </div>
                      <Button type="submit" disabled={isLoading || !leagueCode.trim()}>
                        <Search className="h-4 w-4 mr-2" />
                        {isLoading ? "Searching..." : "Search"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Available Leagues */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Available Public Leagues</CardTitle>
                    <CardDescription>
                      Browse and join public leagues that are currently accepting members
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockAvailableLeagues.map((league) => (
                        <div
                          key={league.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold text-lg">{league.name}</h3>
                              <Badge variant="outline" className="text-green-600 border-green-600">
                                Open
                              </Badge>
                            </div>
                            <p className="text-muted-foreground text-sm mb-3">{league.description}</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div className="flex items-center space-x-2">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <span>
                                  {league.members}/{league.maxMembers} members
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                                <span>${league.entryFee} entry fee</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>Auction: {league.auctionDate}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Trophy className="h-4 w-4 text-muted-foreground" />
                                <span>By {league.organizer}</span>
                              </div>
                            </div>
                          </div>
                          <div className="ml-4">
                            <Button
                              onClick={() => handleJoinLeague(league.id, league.name)}
                              className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white"
                            >
                              Join League
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {mockAvailableLeagues.length === 0 && (
                      <div className="text-center py-8">
                        <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No leagues available</h3>
                        <p className="text-muted-foreground">
                          There are no public leagues available at the moment. Try joining with a league code or create
                          your own league!
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Help Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Need Help?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm text-muted-foreground">
                      <div>
                        <strong>League Codes:</strong> Private leagues have 6-character codes (like ABC123) that you can
                        get from the league organizer.
                      </div>
                      <div>
                        <strong>Entry Fees:</strong> Some leagues require an entry fee to participate. This creates the
                        prize pool for winners.
                      </div>
                      <div>
                        <strong>Auction Dates:</strong> Make sure you're available for the live auction! This is when
                        you'll bid on teams.
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
