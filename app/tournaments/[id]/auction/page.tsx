"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Navigation } from "@/components/navigation"
import { RealTimeAuction } from "@/components/real-time-auction"
import { Gavel, Users, DollarSign, Trophy, TrendingUp } from "lucide-react"

const mockTournament = {
  id: 1,
  name: "March Madness 2024",
  tournament: "March Madness",
  participants: 12,
  maxParticipants: 16,
  entryFee: 50,
  prizePool: 600,
  status: "active",
}

const mockTeams = [
  {
    id: 1,
    name: "Duke Blue Devils",
    seed: 1,
    region: "East",
    currentBid: 85,
    highestBidder: "John D.",
    status: "active",
  },
  {
    id: 2,
    name: "Kansas Jayhawks",
    seed: 1,
    region: "Midwest",
    currentBid: 92,
    highestBidder: "Sarah M.",
    status: "active",
  },
  {
    id: 3,
    name: "Gonzaga Bulldogs",
    seed: 1,
    region: "West",
    currentBid: 78,
    highestBidder: "Mike R.",
    status: "active",
  },
  {
    id: 4,
    name: "Auburn Tigers",
    seed: 2,
    region: "Midwest",
    currentBid: 65,
    highestBidder: "Lisa K.",
    status: "sold",
  },
  { id: 5, name: "Kentucky Wildcats", seed: 2, region: "East", currentBid: 0, highestBidder: null, status: "upcoming" },
]

const mockParticipants = [
  { id: 1, name: "John D.", totalSpent: 185, teamsOwned: 2, remainingBudget: 315 },
  { id: 2, name: "Sarah M.", totalSpent: 142, teamsOwned: 1, remainingBudget: 358 },
  { id: 3, name: "Mike R.", totalSpent: 203, teamsOwned: 3, remainingBudget: 297 },
  { id: 4, name: "Lisa K.", totalSpent: 165, teamsOwned: 2, remainingBudget: 335 },
]

export default function TournamentAuctionPage() {
  const [currentTeam, setCurrentTeam] = useState(mockTeams[0])
  const [bidAmount, setBidAmount] = useState("")
  const [timeRemaining, setTimeRemaining] = useState(45)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 45))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleBid = () => {
    if (bidAmount && Number.parseInt(bidAmount) > currentTeam.currentBid) {
      console.log(`Bid placed: $${bidAmount} on ${currentTeam.name}`)
      setBidAmount("")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "sold":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
      case "upcoming":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Tournament Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{mockTournament.name}</h1>
              <p className="text-muted-foreground">Live Auction in Progress</p>
            </div>
            <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 text-lg px-4 py-2">
              LIVE
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Participants</p>
                    <p className="text-2xl font-bold">{mockTournament.participants}</p>
                  </div>
                  <Users className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Prize Pool</p>
                    <p className="text-2xl font-bold">${mockTournament.prizePool}</p>
                  </div>
                  <Trophy className="h-8 w-8 text-accent" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Teams Sold</p>
                    <p className="text-2xl font-bold">{mockTeams.filter((t) => t.status === "sold").length}</p>
                  </div>
                  <Gavel className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Bids</p>
                    <p className="text-2xl font-bold">${mockTeams.reduce((sum, team) => sum + team.currentBid, 0)}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Current Auction */}
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">{currentTeam.name}</CardTitle>
                    <CardDescription>
                      {currentTeam.seed} seed • {currentTeam.region} Region
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(currentTeam.status)}>{currentTeam.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">Current Bid</p>
                    <p className="text-4xl font-bold text-primary">${currentTeam.currentBid}</p>
                    {currentTeam.highestBidder && (
                      <p className="text-sm text-muted-foreground">by {currentTeam.highestBidder}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Time Remaining</span>
                      <span className="text-sm font-medium">{timeRemaining}s</span>
                    </div>
                    <Progress value={(timeRemaining / 45) * 100} className="h-2" />
                  </div>

                  <div className="flex space-x-4">
                    <Input
                      type="number"
                      placeholder={`Minimum: $${currentTeam.currentBid + 1}`}
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleBid}
                      disabled={!bidAmount || Number.parseInt(bidAmount) <= currentTeam.currentBid}
                      className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white"
                    >
                      <Gavel className="h-4 w-4 mr-2" />
                      Place Bid
                    </Button>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setBidAmount((currentTeam.currentBid + 5).toString())}
                    >
                      +$5
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setBidAmount((currentTeam.currentBid + 10).toString())}
                    >
                      +$10
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setBidAmount((currentTeam.currentBid + 25).toString())}
                    >
                      +$25
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Real-time auction component */}
            <RealTimeAuction />
          </div>

          {/* Sidebar */}
          <div>
            <Tabs defaultValue="teams" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="teams">Teams</TabsTrigger>
                <TabsTrigger value="participants">Participants</TabsTrigger>
              </TabsList>

              <TabsContent value="teams">
                <Card>
                  <CardHeader>
                    <CardTitle>All Teams</CardTitle>
                    <CardDescription>Tournament bracket teams and their auction status</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-96">
                      <div className="space-y-3">
                        {mockTeams.map((team) => (
                          <div
                            key={team.id}
                            className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                              team.id === currentTeam.id ? "bg-primary/10 border-primary" : "hover:bg-muted/50"
                            }`}
                            onClick={() => setCurrentTeam(team)}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-sm">{team.name}</h4>
                              <Badge className={getStatusColor(team.status)} variant="outline">
                                {team.status}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>
                                {team.seed} seed • {team.region}
                              </span>
                              <span className="font-medium">${team.currentBid}</span>
                            </div>
                            {team.highestBidder && (
                              <p className="text-xs text-muted-foreground mt-1">by {team.highestBidder}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="participants">
                <Card>
                  <CardHeader>
                    <CardTitle>Participants</CardTitle>
                    <CardDescription>Current standings and spending</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-96">
                      <div className="space-y-3">
                        {mockParticipants.map((participant, index) => (
                          <div key={participant.id} className="p-3 rounded-lg border">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium">#{index + 1}</span>
                                <h4 className="font-medium">{participant.name}</h4>
                              </div>
                              <TrendingUp className="h-4 w-4 text-green-500" />
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <span className="text-muted-foreground">Spent:</span>
                                <span className="font-medium ml-1">${participant.totalSpent}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Teams:</span>
                                <span className="font-medium ml-1">{participant.teamsOwned}</span>
                              </div>
                              <div className="col-span-2">
                                <span className="text-muted-foreground">Remaining:</span>
                                <span className="font-medium ml-1">${participant.remainingBudget}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
