"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Navigation } from "@/components/navigation"
import { CreateLeagueModal } from "@/components/create-league-modal"
import { JoinLeagueModal } from "@/components/join-league-modal"
import { AuthModal } from "@/components/auth-modal"
import { useAuth } from "@/components/auth-provider"
import { leagueStore, type League } from "@/lib/league-store"
import { Trophy, Users, Search, Plus, Crown, Calendar, Clock } from "lucide-react"
import Link from "next/link"
import { LeagueOverviewModal } from "@/components/league-overview-modal"
import { isTournamentCompleted } from "@/lib/tournament-dates"

export default function LeaguesPage() {
  const { user, isLoading } = useAuth()
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [userLeagues, setUserLeagues] = useState<League[]>([])
  const [publicLeagues, setPublicLeagues] = useState<League[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("my-leagues")

  const [filters, setFilters] = useState({
    tournament: "",
    tournamentType: "",
    entryFeeMin: "",
    entryFeeMax: "",
    auctionDate: "",
    spotsAvailable: false,
  })

  useEffect(() => {
    if (!isLoading && !user) {
      setAuthModalOpen(true)
    }
  }, [user, isLoading])

  useEffect(() => {
    const refreshData = () => {
      loadLeagues()
    }

    refreshData()

    // Set up an interval to refresh data periodically
    const interval = setInterval(refreshData, 1000)

    return () => clearInterval(interval)
  }, [user])

  const loadLeagues = () => {
    if (user) {
      // Load user's leagues using the store
      const myLeagues = leagueStore.getState().getUserLeagues(user.id)
      setUserLeagues(myLeagues)
    }

    // Load public leagues
    const allPublicLeagues = leagueStore.getState().getAllLeagues()
    setPublicLeagues(allPublicLeagues)
  }

  const handleLeagueCreated = () => {
    loadLeagues()
  }

  const handleLeagueJoined = () => {
    loadLeagues()
  }

  const handleJoinLeague = (leagueId: string) => {
    if (user && leagueStore.getState().joinLeague(leagueId, user.id)) {
      loadLeagues()
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "upcoming":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
      case "completed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredUserLeagues = userLeagues.filter(
    (league) =>
      league.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      league.tournamentName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredPublicLeagues = publicLeagues.filter((league) => {
    const matchesSearch =
      league.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      league.tournamentName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesTournament =
      !filters.tournament || league.tournamentName.toLowerCase().includes(filters.tournament.toLowerCase())

    const matchesTournamentType =
      !filters.tournamentType || league.tournamentName.toLowerCase().includes(filters.tournamentType.toLowerCase())

    const matchesEntryFee =
      (!filters.entryFeeMin || league.entryFee >= Number.parseInt(filters.entryFeeMin)) &&
      (!filters.entryFeeMax || league.entryFee <= Number.parseInt(filters.entryFeeMax))

    const matchesAuctionDate = !filters.auctionDate || league.auctionDate.includes(filters.auctionDate)

    const matchesSpots = !filters.spotsAvailable || league.members < league.maxMembers

    const isNotMember = !user || !leagueStore.getState().isUserMember(league.id, user.id)

    return (
      matchesSearch &&
      matchesTournament &&
      matchesTournamentType &&
      matchesEntryFee &&
      matchesAuctionDate &&
      matchesSpots &&
      isNotMember
    )
  })

  // Separate active and completed leagues for "My Leagues" tab
  const activeUserLeagues = filteredUserLeagues.filter((league) => {
    // League is in history if tournament date has passed
    const tournamentCompleted = isTournamentCompleted(league.tournamentName)
    return !tournamentCompleted
  })

  const completedUserLeagues = filteredUserLeagues.filter((league) => {
    const tournamentCompleted = isTournamentCompleted(league.tournamentName)
    return tournamentCompleted
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[50vh]">
          <Card className="max-w-md mx-auto">
            <CardContent className="text-center py-12">
              <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Please sign in</h3>
              <p className="text-muted-foreground mb-6">You need to be logged in to view leagues</p>
              <Button onClick={() => setAuthModalOpen(true)}>Sign In</Button>
            </CardContent>
          </Card>
        </div>
        <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} defaultTab="login" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Leagues</h1>
              <p className="text-muted-foreground">Manage your leagues and discover new ones</p>
            </div>
            <div className="flex items-center space-x-4">
              <JoinLeagueModal onLeagueJoined={handleLeagueJoined}>
                <Button variant="outline">
                  <Search className="h-4 w-4 mr-2" />
                  Join League
                </Button>
              </JoinLeagueModal>
              <CreateLeagueModal onLeagueCreated={handleLeagueCreated}>
                <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Create League
                </Button>
              </CreateLeagueModal>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search leagues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="my-leagues">My Leagues</TabsTrigger>
            <TabsTrigger value="public-leagues">Public Leagues</TabsTrigger>
          </TabsList>

          <TabsContent value="my-leagues" className="space-y-6">
            {/* Active Leagues Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="h-5 w-5 mr-2" />
                  Active Leagues
                </CardTitle>
                <CardDescription>Your current league participations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeUserLeagues.map((league) => (
                    <div
                      key={league.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer hover:shadow-md hover:ring-1 hover:ring-primary/20 hover:bg-gradient-to-r hover:from-primary/5 hover:to-accent/5"
                    >
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-lg">{league.name}</h3>
                          <div className="flex items-center space-x-2">
                            <Badge className={getStatusColor(league.status)}>{league.status}</Badge>
                            {league.myPosition === 1 && <Crown className="h-4 w-4 text-yellow-500" />}
                          </div>
                        </div>
                        <p className="text-muted-foreground text-sm mb-2">{league.tournamentName}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Members: </span>
                            <span className="font-medium">
                              {league.members}/{league.maxMembers}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Entry: </span>
                            <span className="font-medium">${league.entryFee}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                            <span className="text-muted-foreground text-xs">{league.auctionDate}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                            <span className="text-muted-foreground text-xs">{league.auctionTime}</span>
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground">
                          <span>Invite Code: </span>
                          <span className="font-mono font-medium">{league.inviteCode}</span>
                        </div>
                      </div>
                      <div className="ml-4 flex space-x-2">
                        <Button size="sm" asChild>
                          <Link href={`/leagues/${league.id}`}>{league.nextAction}</Link>
                        </Button>
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/leagues/${league.id}`}>View League</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {activeUserLeagues.length === 0 && (
                  <div className="text-center py-8">
                    <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No active leagues</h3>
                    <p className="text-muted-foreground mb-4">Join or create a league to get started!</p>
                    <div className="flex justify-center space-x-4">
                      <CreateLeagueModal onLeagueCreated={handleLeagueCreated}>
                        <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white">
                          Create League
                        </Button>
                      </CreateLeagueModal>
                      <JoinLeagueModal onLeagueJoined={handleLeagueJoined}>
                        <Button variant="outline">Join League</Button>
                      </JoinLeagueModal>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* League History Section */}
            {completedUserLeagues.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    League History
                  </CardTitle>
                  <CardDescription>Your completed leagues from previous tournaments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {completedUserLeagues.map((league) => (
                      <div
                        key={league.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer hover:shadow-md hover:ring-1 hover:ring-primary/20 hover:bg-gradient-to-r hover:from-primary/5 hover:to-accent/5"
                      >
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-lg">{league.name}</h3>
                            <div className="flex items-center space-x-2">
                              <Badge className={getStatusColor(league.status)}>{league.status}</Badge>
                              {league.myPosition === 1 && <Crown className="h-4 w-4 text-yellow-500" />}
                            </div>
                          </div>
                          <p className="text-muted-foreground text-sm mb-2">{league.tournamentName}</p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Members: </span>
                              <span className="font-medium">
                                {league.members}/{league.maxMembers}
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Entry: </span>
                              <span className="font-medium">${league.entryFee}</span>
                            </div>
                            {league.myPosition && (
                              <div>
                                <span className="text-muted-foreground">Final Position: </span>
                                <span className="font-medium">#{league.myPosition}</span>
                              </div>
                            )}
                            {league.myWinnings !== undefined && (
                              <div>
                                <span className="text-muted-foreground">Winnings: </span>
                                <span
                                  className={`font-medium ${league.myWinnings > 0 ? "text-green-600" : "text-muted-foreground"}`}
                                >
                                  ${league.myWinnings}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="ml-4">
                          <Button size="sm" variant="outline" asChild>
                            <Link href={`/leagues/${league.id}`}>{league.nextAction}</Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="public-leagues" className="space-y-6">
            <div className="mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">League Search Filters</CardTitle>
                  <CardDescription>Narrow down your search to find the perfect league</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Tournament</label>
                      <Input
                        placeholder="Tournament name..."
                        value={filters.tournament}
                        onChange={(e) => setFilters((prev) => ({ ...prev, tournament: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Tournament Type</label>
                      <select
                        className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                        value={filters.tournamentType}
                        onChange={(e) => setFilters((prev) => ({ ...prev, tournamentType: e.target.value }))}
                      >
                        <option value="">All Tournaments</option>
                        <option value="march madness">March Madness</option>
                        <option value="world cup">World Cup</option>
                        <option value="the masters">The Masters</option>
                        <option value="super bowl">Super Bowl</option>
                        <option value="nba playoffs">NBA Playoffs</option>
                        <option value="stanley cup">Stanley Cup</option>
                        <option value="wimbledon">Wimbledon</option>
                        <option value="olympics">Olympics</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Min Entry Fee</label>
                      <Input
                        type="number"
                        placeholder="$0"
                        value={filters.entryFeeMin}
                        onChange={(e) => setFilters((prev) => ({ ...prev, entryFeeMin: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Max Entry Fee</label>
                      <Input
                        type="number"
                        placeholder="$1000"
                        value={filters.entryFeeMax}
                        onChange={(e) => setFilters((prev) => ({ ...prev, entryFeeMax: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Auction Date</label>
                      <Input
                        type="date"
                        value={filters.auctionDate}
                        onChange={(e) => setFilters((prev) => ({ ...prev, auctionDate: e.target.value }))}
                      />
                    </div>
                    <div className="flex items-center space-x-2 pt-6">
                      <input
                        type="checkbox"
                        id="spotsAvailable"
                        checked={filters.spotsAvailable}
                        onChange={(e) => setFilters((prev) => ({ ...prev, spotsAvailable: e.target.checked }))}
                        className="rounded border-input"
                      />
                      <label htmlFor="spotsAvailable" className="text-sm font-medium">
                        Spots Available
                      </label>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setFilters({
                          tournament: "",
                          tournamentType: "",
                          entryFeeMin: "",
                          entryFeeMax: "",
                          auctionDate: "",
                          spotsAvailable: false,
                        })
                      }
                    >
                      Clear Filters
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Public Leagues
                </CardTitle>
                <CardDescription>Join open leagues and compete with other players</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredPublicLeagues.map((league) => (
                    <LeagueOverviewModal key={league.id} league={league} onLeagueJoined={handleLeagueJoined}>
                      <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer hover:shadow-md hover:ring-1 hover:ring-primary/20 hover:bg-gradient-to-r hover:from-primary/5 hover:to-accent/5">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-lg">{league.name}</h3>
                            <Badge className={getStatusColor(league.status)}>{league.status}</Badge>
                          </div>
                          <p className="text-muted-foreground text-sm mb-2">{league.description}</p>
                          <p className="text-muted-foreground text-sm mb-2">{league.tournamentName}</p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Members: </span>
                              <span className="font-medium">
                                {league.members}/{league.maxMembers}
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Entry Fee: </span>
                              <span className="font-medium">${league.entryFee}</span>
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                              <span className="text-muted-foreground text-xs">{league.auctionDate}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                              <span className="text-muted-foreground text-xs">{league.auctionTime}</span>
                            </div>
                          </div>
                        </div>
                        <div className="ml-4 flex space-x-2">
                          {user && leagueStore.getState().isUserMember(league.id, user.id) ? (
                            <>
                              <Button size="sm" variant="outline" asChild>
                                <Link href={`/leagues/${league.id}`}>View League</Link>
                              </Button>
                              {league.status !== "completed" && (
                                <Button size="sm" asChild>
                                  <Link href={`/leagues/${league.id}/auction`}>JOIN AUCTION</Link>
                                </Button>
                              )}
                            </>
                          ) : league.members < league.maxMembers ? (
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleJoinLeague(league.id)
                              }}
                              className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white"
                            >
                              Join League
                            </Button>
                          ) : (
                            <Button size="sm" variant="outline" disabled>
                              Full
                            </Button>
                          )}
                        </div>
                      </div>
                    </LeagueOverviewModal>
                  ))}
                </div>

                {filteredPublicLeagues.length === 0 && (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No public leagues found</h3>
                    <p className="text-muted-foreground mb-4">
                      {searchTerm ? "Try adjusting your search terms" : "Be the first to create a public league!"}
                    </p>
                    {!searchTerm && (
                      <CreateLeagueModal onLeagueCreated={handleLeagueCreated}>
                        <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white">
                          Create Public League
                        </Button>
                      </CreateLeagueModal>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
