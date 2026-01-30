"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { Search, Users, DollarSign, Calendar, Trophy, ArrowLeft, Lock, Globe } from "lucide-react"
import Link from "next/link"

const mockTournaments = [
  {
    id: 1,
    name: "March Madness 2024",
    description: "Annual college basketball tournament pool",
    tournament: "March Madness",
    participants: 12,
    maxParticipants: 16,
    entryFee: 50,
    auctionDate: "2024-03-15",
    auctionTime: "19:00",
    isPublic: true,
    prizePool: 600,
    status: "upcoming",
  },
  {
    id: 2,
    name: "Office Pool Championship",
    description: "Company-wide tournament with bragging rights on the line",
    tournament: "March Madness",
    participants: 8,
    maxParticipants: 12,
    entryFee: 25,
    auctionDate: "2024-03-16",
    auctionTime: "18:30",
    isPublic: false,
    prizePool: 200,
    status: "upcoming",
  },
  {
    id: 3,
    name: "High Stakes Madness",
    description: "For serious players only - high entry fee, high rewards",
    tournament: "March Madness",
    participants: 6,
    maxParticipants: 8,
    entryFee: 200,
    auctionDate: "2024-03-14",
    auctionTime: "20:00",
    isPublic: true,
    prizePool: 1200,
    status: "upcoming",
  },
]

export default function JoinTournamentPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [inviteCode, setInviteCode] = useState("")

  const filteredTournaments = mockTournaments.filter(
    (tournament) =>
      tournament.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tournament.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleJoinTournament = (tournamentId: number) => {
    console.log("Joining tournament:", tournamentId)
    // Handle tournament join logic
  }

  const handleJoinByCode = () => {
    console.log("Joining by invite code:", inviteCode)
    // Handle join by invite code logic
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/tournaments">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tournaments
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Join Tournament</h1>
          <p className="text-muted-foreground">Find and join existing Calcutta-style auction tournaments</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Search and Filters */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Find Tournaments</CardTitle>
                <CardDescription>Search for tournaments or join with an invite code</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="search">Search Tournaments</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search by name or description..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="inviteCode">Join with Invite Code</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="inviteCode"
                      placeholder="Enter invite code"
                      value={inviteCode}
                      onChange={(e) => setInviteCode(e.target.value)}
                    />
                    <Button onClick={handleJoinByCode} disabled={!inviteCode}>
                      Join
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Tournament Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Available Tournaments</span>
                    <span className="font-medium">{filteredTournaments.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Prize Pools</span>
                    <span className="font-medium">
                      ${filteredTournaments.reduce((sum, t) => sum + t.prizePool, 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Avg Entry Fee</span>
                    <span className="font-medium">
                      $
                      {Math.round(
                        filteredTournaments.reduce((sum, t) => sum + t.entryFee, 0) / filteredTournaments.length || 0,
                      )}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tournament List */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {filteredTournaments.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No tournaments found</h3>
                    <p className="text-muted-foreground mb-6">
                      {searchTerm ? "Try adjusting your search terms" : "No tournaments are currently available"}
                    </p>
                    <Button asChild>
                      <Link href="/tournaments/create">Create Tournament</Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                filteredTournaments.map((tournament) => (
                  <Card key={tournament.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <CardTitle className="text-xl">{tournament.name}</CardTitle>
                            {tournament.isPublic ? (
                              <Globe className="h-4 w-4 text-green-500" />
                            ) : (
                              <Lock className="h-4 w-4 text-yellow-500" />
                            )}
                          </div>
                          <CardDescription>{tournament.description}</CardDescription>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Prize Pool</p>
                          <p className="text-2xl font-bold text-primary">${tournament.prizePool.toLocaleString()}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">{tournament.tournament}</Badge>
                          <Badge
                            className={
                              tournament.status === "upcoming"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                                : "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                            }
                          >
                            {tournament.status}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {tournament.participants}/{tournament.maxParticipants}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">${tournament.entryFee}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{tournament.auctionDate}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Trophy className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{tournament.auctionTime}</span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="text-sm text-muted-foreground">
                            {tournament.participants >= tournament.maxParticipants ? (
                              <span className="text-red-600">Tournament Full</span>
                            ) : (
                              <span className="text-green-600">
                                {tournament.maxParticipants - tournament.participants} spots remaining
                              </span>
                            )}
                          </div>
                          <Button
                            onClick={() => handleJoinTournament(tournament.id)}
                            disabled={tournament.participants >= tournament.maxParticipants}
                            className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white"
                          >
                            {tournament.participants >= tournament.maxParticipants ? "Full" : "Join Tournament"}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
