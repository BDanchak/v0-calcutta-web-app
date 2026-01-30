"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Navigation } from "@/components/navigation"
import { TournamentBracket } from "@/components/tournament-bracket"
import { ArrowLeft, Users, DollarSign, Calendar, Trophy } from "lucide-react"
import Link from "next/link"

interface TournamentPageProps {
  params: {
    id: string
  }
}

// Mock tournament data
const mockTournament = {
  id: 1,
  name: "March Madness 2024",
  description: "Official NCAA tournament bracket competition",
  status: "active",
  participants: 45,
  maxParticipants: 64,
  entryFee: 25,
  totalPot: 1125,
  startDate: "2024-03-21",
  endDate: "2024-04-08",
  organizer: "Tournament Committee",
}

const mockLeaderboard = [
  { id: 1, name: "John Doe", points: 47, earnings: 225 },
  { id: 2, name: "Sarah Miller", points: 42, earnings: 180 },
  { id: 3, name: "Mike Rodriguez", points: 38, earnings: 135 },
  { id: 4, name: "Lisa Kim", points: 35, earnings: 90 },
  { id: 5, name: "Tom Brown", points: 32, earnings: 45 },
]

export default function TournamentPage({ params }: TournamentPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/tournaments">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tournaments
            </Link>
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{mockTournament.name}</h1>
              <p className="text-muted-foreground">{mockTournament.description}</p>
            </div>
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
              {mockTournament.status}
            </Badge>
          </div>
        </div>

        {/* Tournament Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Prize Pool</p>
                  <p className="text-2xl font-bold text-foreground">${mockTournament.totalPot}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Participants</p>
                  <p className="text-2xl font-bold text-foreground">
                    {mockTournament.participants}/{mockTournament.maxParticipants}
                  </p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Entry Fee</p>
                  <p className="text-2xl font-bold text-foreground">${mockTournament.entryFee}</p>
                </div>
                <Trophy className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Duration</p>
                  <p className="text-2xl font-bold text-foreground">18 Days</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="bracket" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="bracket">Live Bracket</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="rules">Rules & Scoring</TabsTrigger>
          </TabsList>

          <TabsContent value="bracket">
            <Card>
              <CardHeader>
                <CardTitle>Tournament Bracket</CardTitle>
                <CardDescription>Real-time bracket with live updates</CardDescription>
              </CardHeader>
              <CardContent>
                <TournamentBracket />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leaderboard">
            <Card>
              <CardHeader>
                <CardTitle>Tournament Leaderboard</CardTitle>
                <CardDescription>Current standings and earnings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockLeaderboard.map((participant, index) => (
                    <div
                      key={participant.id}
                      className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl font-bold text-muted-foreground">#{index + 1}</div>
                        <div>
                          <h3 className="font-semibold">{participant.name}</h3>
                          <p className="text-sm text-muted-foreground">{participant.points} points</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">${participant.earnings}</p>
                        <p className="text-sm text-muted-foreground">Current earnings</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rules">
            <Card>
              <CardHeader>
                <CardTitle>Tournament Rules & Scoring</CardTitle>
                <CardDescription>How points are calculated and prizes distributed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3">Scoring System</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>First Round Win</span>
                        <span className="font-medium">1 point</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Second Round Win</span>
                        <span className="font-medium">2 points</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sweet 16 Win</span>
                        <span className="font-medium">4 points</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Elite 8 Win</span>
                        <span className="font-medium">8 points</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Final Four Win</span>
                        <span className="font-medium">16 points</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Championship Win</span>
                        <span className="font-medium">32 points</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Prize Distribution</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>1st Place</span>
                        <span className="font-medium">50% (${mockTournament.totalPot * 0.5})</span>
                      </div>
                      <div className="flex justify-between">
                        <span>2nd Place</span>
                        <span className="font-medium">30% (${mockTournament.totalPot * 0.3})</span>
                      </div>
                      <div className="flex justify-between">
                        <span>3rd Place</span>
                        <span className="font-medium">20% (${mockTournament.totalPot * 0.2})</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-accent/10 rounded-lg">
                    <h4 className="font-semibold mb-2">Tournament Rules</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• All participants must submit their bracket before the tournament starts</li>
                      <li>• No changes allowed once the tournament begins</li>
                      <li>• Points are awarded automatically based on game results</li>
                      <li>• Prizes are distributed within 48 hours of tournament completion</li>
                      <li>• In case of ties, prizes are split equally among tied participants</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
