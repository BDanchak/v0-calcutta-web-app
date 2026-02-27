"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { CreateLeagueModal } from "@/components/create-league-modal"
import { JoinLeagueModal } from "@/components/join-league-modal"
import { AuthModal } from "@/components/auth-modal"
import { useAuth } from "@/components/auth-provider"
import { leagueStore, type League } from "@/lib/league-store"
import { Trophy, Users, DollarSign, Target, Crown, Plus, Search } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

const mockUserStats = {
  totalWinnings: 245,
  activeLeagues: 3,
  totalLeagues: 8,
  winRate: 62,
}

const calculateTotalWinnings = (userId: string) => {
  const userLeagues = leagueStore.getState().getUserLeagues(userId)
  return userLeagues.reduce((total, league) => {
    return total + (league.myWinnings || 0)
  }, 0)
}

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [userLeagues, setUserLeagues] = useState<League[]>([])
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [notifiedAuctions, setNotifiedAuctions] = useState<string[]>([]) // NEW: Track auctions we've already notified for
  const [totalWinnings, setTotalWinnings] = useState(0)
  const { toast } = useToast()

  useEffect(() => {
    if (!isLoading && !user) {
      setAuthModalOpen(true)
    }
  }, [user, isLoading])

  /* Added useEffect to fetch leagues from Supabase on mount per user request to fix data loss on refresh */
  useEffect(() => {
    leagueStore.getState().fetchLeagues()
  }, [])

  useEffect(() => {
    const refreshData = () => {
      if (user) {
        // Load user's leagues using the store
        const leagues = leagueStore.getState().getUserLeagues(user.id)
        setUserLeagues(leagues)

        const calculatedWinnings = calculateTotalWinnings(user.id)
        setTotalWinnings(calculatedWinnings)

        // Load user's recent activities from the store
        const activities = leagueStore.getState().getUserRecentActivities(user.id)
        setRecentActivity(activities)

        // NEW: Notify when any league's auction start time has been reached
        const now = new Date()
        leagues.forEach((l) => {
          // Only notify once per league
          if (!l.auctionDate || !l.auctionTime) return
          if (notifiedAuctions.includes(l.id)) return
          if (l.status === "completed") return

          const auctionStart = new Date(`${l.auctionDate}T${l.auctionTime}:00`)
          if (now >= auctionStart) {
            if ("Notification" in window) {
              if (Notification.permission === "granted") {
                new Notification("Auction Started!", {
                  body: `The auction for ${l.name} has started.`,
                  icon: "/favicon.ico",
                })
              } else if ("Notification" in window && Notification.permission !== "denied") {
                Notification.requestPermission().then((permission) => {
                  if (permission === "granted") {
                    new Notification("Auction Started!", {
                      body: `The auction for ${l.name} has started.`,
                      icon: "/favicon.ico",
                    })
                  }
                })
              }
            }

            // Show in-app toast pop-up when auction starts
            toast({
              title: "Auction Started!",
              description: `The auction for ${l.name} has started.`,
            })

            // Add to Recent Activity when auction becomes accessible (only once globally)
            if (typeof window !== "undefined") {
              const activityKey = `auction_start_activity_${user.id}_${l.id}`
              if (!localStorage.getItem(activityKey)) {
                leagueStore.getState().addRecentActivity({
                  userId: user.id,
                  type: "bid",
                  message: `Auction started for '${l.name}'`,
                })
                localStorage.setItem(activityKey, "1")
              }
            }

            setNotifiedAuctions((prev) => [...prev, l.id])
          }
        })
      }
    }

    refreshData()

    // Set up an interval to refresh data periodically
    const interval = setInterval(refreshData, 1000)

    return () => clearInterval(interval)
  }, [user, notifiedAuctions])

  const handleLeagueCreated = () => {
    if (user) {
      // Refresh leagues after creation
      const leagues = leagueStore.getState().getUserLeagues(user.id)
      setUserLeagues(leagues)

      // Update recent activity
      const activities = leagueStore.getState().getUserRecentActivities(user.id)
      setRecentActivity(activities)

      // Update total winnings
      const calculatedWinnings = calculateTotalWinnings(user.id)
      setTotalWinnings(calculatedWinnings)
    }
  }

  const handleLeagueJoined = () => {
    if (user) {
      // Refresh leagues after joining
      const leagues = leagueStore.getState().getUserLeagues(user.id)
      setUserLeagues(leagues)

      // Update recent activity
      const activities = leagueStore.getState().getUserRecentActivities(user.id)
      setRecentActivity(activities)

      // Update total winnings
      const calculatedWinnings = calculateTotalWinnings(user.id)
      setTotalWinnings(calculatedWinnings)
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

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "win":
        return <Trophy className="h-4 w-4 text-green-500" />
      case "bid":
        return <DollarSign className="h-4 w-4 text-blue-500" />
      case "league_removed":
        return <Users className="h-4 w-4 text-red-500" />
      case "league_created":
      case "league_joined":
        return <Users className="h-4 w-4 text-purple-500" />
      default:
        return <Target className="h-4 w-4 text-gray-500" />
    }
  }

  const formatActivityTime = (timestamp: string) => {
    const now = new Date()
    const activityTime = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - activityTime.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  const activeLeagues = userLeagues.filter((league) => league.status === "active" || league.status === "upcoming")
  const completedLeagues = userLeagues.filter((league) => league.status === "completed")

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
              <p className="text-muted-foreground mb-6">You need to be logged in to view your dashboard</p>
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Welcome back, {user.name}!</h1>
              <p className="text-muted-foreground">Here's what's happening with your leagues</p>
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
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Winnings</p>
                  <p className="text-2xl font-bold text-green-600">${totalWinnings}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Leagues</p>
                  <p className="text-2xl font-bold text-foreground">{activeLeagues.length}</p>
                </div>
                <Trophy className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Leagues</p>
                  <p className="text-2xl font-bold text-foreground">{userLeagues.length}</p>
                </div>
                <Users className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Leagues */}
          <div className="lg:col-span-2 lg:order-1">
            <Card>
              <CardHeader>
                <CardTitle>My Leagues</CardTitle>
                <CardDescription>Your current active league participations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeLeagues.map((league) => (
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
                              <span className="text-muted-foreground">Position: </span>
                              <span className="font-medium">#{league.myPosition}</span>
                            </div>
                          )}
                          {league.myWinnings && league.myWinnings > 0 && (
                            <div>
                              <span className="text-muted-foreground">Winnings: </span>
                              <span className="font-medium text-green-600">${league.myWinnings}</span>
                            </div>
                          )}
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground">
                          <span>Invite Code: </span>
                          <span className="font-mono font-medium">{league.inviteCode}</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <Button size="sm" asChild>
                          <Link href={`/leagues/${league.id}`}>View League</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {activeLeagues.length === 0 && (
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

                <div className="mt-6 text-center">
                  <Button variant="outline" asChild>
                    <Link href="/leagues">View All Leagues</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {completedLeagues.length > 0 && (
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>League History</CardTitle>
                  <CardDescription>Your completed league participations and results</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {completedLeagues.map((league) => (
                      <div
                        key={league.id}
                        className="flex items-center justify-between p-4 border rounded-lg bg-muted/20"
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
                              <span className="text-muted-foreground">Final Position: </span>
                              <span className="font-medium">#{league.myPosition || "N/A"}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Entry Fee: </span>
                              <span className="font-medium">${league.entryFee}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Total Winnings: </span>
                              <span
                                className={`font-medium ${league.myWinnings && league.myWinnings > 0 ? "text-green-600" : "text-muted-foreground"}`}
                              >
                                ${league.myWinnings || 0}
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Net Result: </span>
                              <span
                                className={`font-medium ${(league.myWinnings || 0) - league.entryFee >= 0 ? "text-green-600" : "text-red-600"}`}
                              >
                                {(league.myWinnings || 0) - league.entryFee >= 0 ? "+" : ""}$
                                {(league.myWinnings || 0) - league.entryFee}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="ml-4">
                          <Button size="sm" variant="outline" asChild>
                            <Link href={`/leagues/${league.id}`}>View Results</Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Recent Activity */}
          <div className="space-y-6 lg:order-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest league updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">{getActivityIcon(activity.type)}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground">{activity.message}</p>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs text-muted-foreground">{formatActivityTime(activity.timestamp)}</p>
                          {activity.earnings && activity.earnings > 0 && (
                            <span className="text-xs font-medium text-green-600">+${activity.earnings}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {recentActivity.length === 0 && (
                  <div className="text-center py-8">
                    <Target className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No recent activity</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <CreateLeagueModal onLeagueCreated={handleLeagueCreated}>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Plus className="h-4 w-4 mr-2" />
                      Create New League
                    </Button>
                  </CreateLeagueModal>
                  <JoinLeagueModal onLeagueJoined={handleLeagueJoined}>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Search className="h-4 w-4 mr-2" />
                      Join League
                    </Button>
                  </JoinLeagueModal>
                  <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                    <Link href="/how-it-works">
                      <Trophy className="h-4 w-4 mr-2" />
                      How It Works
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
