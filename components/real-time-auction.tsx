"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Trophy,
  Users,
  DollarSign,
  Clock,
  Gavel,
  TrendingUp,
  Crown,
  Target,
  Zap,
  Timer,
  Play,
  Pause,
  SkipForward,
} from "lucide-react"
import { leagueStore } from "@/lib/league-store"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import confetti from "canvas-confetti"
import { useToast } from "@/hooks/use-toast"
import { UserEmblem } from "@/components/user-emblem"

interface RealTimeAuctionProps {
  leagueId: string
  isCommissioner: boolean
  userId: string
}

type SavedAuctionState = {
  startedAt: number
  currentTeamIndex: number
  timeRemaining: number
  currentBid: number
  highestBidder: string
  highestBidderId: string | null
  auctionStatus: "waiting" | "active" | "paused" | "completed"
  bidHistory: Array<{ bidder: string; amount: number; timestamp: string }>
  participants: Array<{
    id: string | number
    name: string
    totalSpent: number
    teamsWon: number
    remainingBudget: number
  }>
  acquired: Record<string, Array<{ name: string; seed: number; region: string; price: number }>>
}

export function RealTimeAuction({ leagueId, isCommissioner, userId }: RealTimeAuctionProps) {
  const [currentTeamIndex, setCurrentTeamIndex] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(30)
  const [currentBid, setCurrentBid] = useState(50)
  const [bidAmount, setBidAmount] = useState("")
  const [highestBidder, setHighestBidder] = useState("No bids yet")
  const [highestBidderId, setHighestBidderId] = useState<string | null>(null)
  const [auctionStatus, setAuctionStatus] = useState<"waiting" | "active" | "paused" | "completed">("active")
  const [bidHistory, setBidHistory] = useState<Array<{ bidder: string; amount: number; timestamp: string }>>([])
  const [showOverview, setShowOverview] = useState(false)
  const { toast } = useToast()

  // Get league data and tournament teams
  const league = leagueStore.getState().getLeague(leagueId)
  const tournamentTeams = league ? leagueStore.getState().getTournamentTeams(league.tournament) : []

  const currentTeam = tournamentTeams[currentTeamIndex]

  // Get actual auction settings from league
  const auctionSettings = {
    enableSpendingLimit: league?.enableSpendingLimit || false,
    spendingLimit: league?.spendingLimit || 500,
    secondsPerTeam: league?.secondsPerTeam || 30,
    secondsBetweenTeams: league?.secondsBetweenTeams || 10,
    secondsAfterBid: league?.secondsAfterBid || 5,
    showUpcomingTeams: league?.showUpcomingTeams !== false,
    teamOrder: league?.teamOrder || "seed-order",
    budgetsVisible: league?.budgetsVisible !== false,
  }

  // Base budget used for the budget progress calculation
  const baseBudget = auctionSettings.enableSpendingLimit ? auctionSettings.spendingLimit : 500

  const initializeParticipants = () => {
    if (!league) return []

    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]")

    if (league.auctionParticipants) {
      // Load saved participants but update their names from localStorage
      return Object.values(league.auctionParticipants).map((participant: any) => {
        const user = existingUsers.find((u: any) => String(u.id) === String(participant.id))
        const memberName =
          String(participant.id) === String(userId) ? "You" : user ? user.name : `Member ${participant.id}`

        return {
          ...participant,
          name: memberName, // Update name from localStorage
        }
      })
    }

    const allMembers = [...(league.joinedMembers || []), league.createdBy]
    // Remove duplicates in case commissioner is also in joinedMembers
    const uniqueMembers = [...new Set(allMembers)]

    return uniqueMembers.map((memberId) => {
      // Get actual user name from localStorage or use fallback
      const user = existingUsers.find((u: any) => String(u.id) === String(memberId))

      const memberName = String(memberId) === String(userId) ? "You" : user ? user.name : `Member ${memberId}`

      return {
        id: memberId, // Use actual member ID instead of hardcoded ID
        name: memberName,
        totalSpent: 0,
        teamsWon: 0,
        remainingBudget: auctionSettings.enableSpendingLimit ? auctionSettings.spendingLimit : 0,
      }
    })
  }

  // Initialize participants with actual league members
  const [participants, setParticipants] = useState(initializeParticipants())

  // Track acquired teams locally for display under Bid History
  const [acquired, setAcquired] = useState<
    Record<string, Array<{ name: string; seed: number; region: string; price: number }>>
  >((league?.auctionResults as any) || {})

  // Persistence keys and helpers
  const storageKey = `auction_state_${leagueId}`
  const initializedRef = useRef(false)
  const betweenResumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const saveState = () => {
    try {
      const startedAt = new Date(`${league?.auctionDate}T${league?.auctionTime}:00`).getTime()
      const payload: SavedAuctionState = {
        startedAt,
        currentTeamIndex,
        timeRemaining,
        currentBid,
        highestBidder,
        highestBidderId,
        auctionStatus,
        bidHistory,
        participants,
        acquired,
      }
      if (typeof window !== "undefined") {
        localStorage.setItem(storageKey, JSON.stringify(payload))
      }
    } catch {
      // ignore storage errors
    }
  }

  const loadState = (): SavedAuctionState | null => {
    try {
      if (typeof window === "undefined") return null
      const raw = localStorage.getItem(storageKey)
      if (!raw) return null
      return JSON.parse(raw) as SavedAuctionState
    } catch {
      return null
    }
  }

  // Initialize time remaining with actual league setting only once if not restored
  useEffect(() => {
    if (!initializedRef.current) {
      setTimeRemaining(auctionSettings.secondsPerTeam)
    }
  }, [auctionSettings.secondsPerTeam])

  // Timer effect using actual league settings
  useEffect(() => {
    if (auctionStatus === "active" && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining((prev) => {
          const next = prev - 1
          return next
        })
      }, 1000)
      return () => clearTimeout(timer)
    } else if (timeRemaining === 0 && auctionStatus === "active") {
      // Auto-advance to next team when time runs out
      handleNextTeam()
    }
  }, [timeRemaining, auctionStatus])

  // Save state whenever core values change
  useEffect(() => {
    if (!initializedRef.current) return
    saveState()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTeamIndex, timeRemaining, currentBid, highestBidder, auctionStatus, bidHistory, participants, acquired])

  const currentUserParticipant = participants.find((p) => String(p.id) === String(userId))
  const myRemainingBudget =
    currentUserParticipant?.remainingBudget ??
    (auctionSettings.enableSpendingLimit ? auctionSettings.spendingLimit : Number.POSITIVE_INFINITY)

  console.log("[v0] Current User ID:", userId)
  console.log("[v0] Participants:", participants)
  console.log("[v0] Current User Participant:", currentUserParticipant)
  console.log("[v0] My Remaining Budget:", myRemainingBudget)

  const updateParticipantBudgetAndTeams = (participantId: string, bidAmount: number) => {
    console.log("[v0] updateParticipantBudgetAndTeams called for participant:", participantId, "bid amount:", bidAmount)

    setParticipants((prevParticipants) => {
      const updatedParticipants = prevParticipants.map((participant) => {
        if (String(participant.id) === String(participantId)) {
          const newRemainingBudget = auctionSettings.enableSpendingLimit
            ? participant.remainingBudget - bidAmount // Subtract bid from remaining budget
            : participant.remainingBudget + bidAmount // Add to total spent when no spending limit

          const newTotalSpent = participant.totalSpent + bidAmount

          console.log("[v0] Updating participant:", participant.name)
          console.log("[v0] Previous remaining budget:", participant.remainingBudget)
          console.log("[v0] Bid amount:", bidAmount)
          console.log("[v0] New remaining budget:", newRemainingBudget)
          console.log("[v0] Previous total spent:", participant.totalSpent)
          console.log("[v0] New total spent:", newTotalSpent)

          return {
            ...participant,
            totalSpent: newTotalSpent,
            teamsWon: participant.teamsWon + 1,
            remainingBudget: newRemainingBudget,
          }
        }
        return participant
      })

      console.log("[v0] Updated participants:", updatedParticipants)

      const participantsRecord: Record<string, any> = {}
      updatedParticipants.forEach((p) => {
        participantsRecord[p.id as string] = p
      })

      console.log("[v0] Saving participants to league store:", participantsRecord)
      leagueStore.getState().updateLeague(leagueId, {
        auctionParticipants: participantsRecord,
      })

      return updatedParticipants
    })
  }

  const handleBid = () => {
    const bid = Number.parseInt(bidAmount)
    if (auctionSettings.enableSpendingLimit && bid > myRemainingBudget) {
      return
    }
    if (bid > currentBid && auctionStatus === "active") {
      setCurrentBid(bid)
      setHighestBidder("You")
      setHighestBidderId(String(userId))
      setBidHistory([{ bidder: "You", amount: bid, timestamp: new Date().toLocaleTimeString() }, ...bidHistory])
      setBidAmount("")
      // Add extra time when bid is placed using actual league setting
      setTimeRemaining(Math.max(timeRemaining, auctionSettings.secondsAfterBid))
    }
  }

  const handleNextTeam = () => {
    console.log("[v0] handleNextTeam called - Timer hit 0")
    console.log("[v0] Current highest bidder:", highestBidder)
    console.log("[v0] Current bid:", currentBid)
    console.log("[v0] Current team:", currentTeam?.name)
    console.log("[v0] Highest bidder ID:", highestBidderId)

    if (highestBidderId) {
      const winnerId = highestBidderId

      console.log("[v0] Winner ID:", winnerId)

      if (winnerId) {
        console.log("[v0] Updating participant budget for winner ID:", winnerId, "with bid amount:", currentBid)
        updateParticipantBudgetAndTeams(String(winnerId), currentBid)

        const currentAuctionResults: Record<string, any[]> = { ...(league?.auctionResults as any) } || {}

        if (!currentAuctionResults[winnerId]) {
          currentAuctionResults[winnerId] = []
        }

        const wonTeam = {
          name: currentTeam.name,
          seed: currentTeam.seed,
          region: currentTeam.region,
          status: "active",
          points: 0,
          price: currentBid,
          wins: 0,
          earnings: 0,
        }

        currentAuctionResults[winnerId].push(wonTeam)

        console.log("[v0] Updating league store with auction results:", currentAuctionResults)
        leagueStore.getState().updateLeague(leagueId, {
          auctionResults: currentAuctionResults,
        })

        setAcquired((prev) => {
          const copy = { ...prev }
          if (!copy[winnerId]) copy[winnerId] = []
          copy[winnerId] = [
            ...copy[winnerId],
            { name: wonTeam.name, seed: wonTeam.seed, region: wonTeam.region, price: wonTeam.price },
          ]
          console.log("[v0] Updated acquired state:", copy)
          return copy
        })
      }
    }

    const nextIndex = currentTeamIndex + 1
    console.log("[v0] Moving to next team. Current index:", currentTeamIndex, "Next index:", nextIndex)

    if (nextIndex < tournamentTeams.length) {
      setCurrentTeamIndex(nextIndex)
      setCurrentBid(50)
      setHighestBidder("No bids yet")
      setHighestBidderId(null)
      setBidHistory([])
      setTimeRemaining(auctionSettings.secondsPerTeam)
      setAuctionStatus("active")
      console.log("[v0] Resumed auction for next team")
    } else {
      setAuctionStatus("completed")
      leagueStore.getState().updateLeague(leagueId, {
        status: "completed",
      })
      console.log("[v0] Auction completed!")
    }
  }

  const handlePauseResume = () => {
    setAuctionStatus(auctionStatus === "active" ? "paused" : "active")
  }

  // FIX: move restore/derive logic into an effect to avoid setState during render
  useEffect(() => {
    if (initializedRef.current) return
    if (!league || tournamentTeams.length === 0) return

    const auctionDateTime = new Date(`${league.auctionDate}T${league.auctionTime}:00`)
    const saved = loadState()
    const startMs = auctionDateTime.getTime()
    const totalTeams = tournamentTeams.length

    const computeDerived = () => {
      const elapsedSec = Math.max(0, Math.floor((Date.now() - startMs) / 1000))
      const cycle = auctionSettings.secondsPerTeam + auctionSettings.secondsBetweenTeams

      let derivedIndex = 0
      let derivedTimeRemaining = auctionSettings.secondsPerTeam
      let derivedStatus: "active" | "paused" | "completed" = "active"
      const derivedHighestBidderId: string | null = null

      if (totalTeams === 0) {
        derivedIndex = 0
        derivedTimeRemaining = 0
        derivedStatus = "completed"
      } else {
        const teamsElapsed = Math.floor(elapsedSec / cycle)
        const timeIntoCycle = elapsedSec % cycle

        if (teamsElapsed >= totalTeams) {
          derivedIndex = totalTeams - 1
          derivedTimeRemaining = 0
          derivedStatus = "completed"
        } else if (timeIntoCycle < auctionSettings.secondsPerTeam) {
          // In an active bidding window
          derivedIndex = teamsElapsed
          derivedTimeRemaining = auctionSettings.secondsPerTeam - timeIntoCycle
          derivedStatus = "active"
        } else {
          // In the between-teams buffer
          derivedIndex = Math.min(teamsElapsed, totalTeams - 1)
          derivedStatus = "paused"
          const remainingBetween = cycle - timeIntoCycle
          if (betweenResumeTimeoutRef.current) {
            clearTimeout(betweenResumeTimeoutRef.current)
          }
          betweenResumeTimeoutRef.current = setTimeout(() => {
            setCurrentTeamIndex((prev) => (prev < totalTeams - 1 ? prev + 1 : prev))
            setAuctionStatus("active")
            setTimeRemaining(auctionSettings.secondsPerTeam)
            saveState()
          }, remainingBetween * 1000)
          derivedTimeRemaining = auctionSettings.secondsPerTeam
        }
      }

      return { derivedIndex, derivedTimeRemaining, derivedStatus, derivedHighestBidderId }
    }

    if (saved && saved.startedAt === startMs) {
      // Always derive current position from wall-clock so auction continues even when users leave
      const { derivedIndex, derivedTimeRemaining, derivedStatus, derivedHighestBidderId } = computeDerived()

      // Restore participants/acquired so budgets/teams-won remain accurate
      if (Array.isArray(saved.participants) && saved.participants.length > 0) {
        setParticipants(saved.participants as any)
      }
      if (saved.acquired) {
        setAcquired(saved.acquired)
      }

      setCurrentTeamIndex(derivedIndex)
      setTimeRemaining(derivedTimeRemaining)

      // If we are still on the same team and auction isn't completed, keep bid info; otherwise reset bid state
      if (derivedIndex === saved.currentTeamIndex && derivedStatus !== "completed") {
        setCurrentBid(saved.currentBid)
        setHighestBidder(saved.highestBidder)
        setHighestBidderId(saved.highestBidderId)
        setBidHistory(saved.bidHistory)
      } else {
        setCurrentBid(50)
        setHighestBidder("No bids yet")
        setHighestBidderId(null)
        setBidHistory([])
      }

      setAuctionStatus(derivedStatus)
      initializedRef.current = true
      saveState()
      return
    }

    // No saved state: derive from wall-clock time
    const { derivedIndex, derivedTimeRemaining, derivedStatus, derivedHighestBidderId } = computeDerived()
    setCurrentTeamIndex(derivedIndex)
    setTimeRemaining(derivedTimeRemaining)
    setCurrentBid(50)
    setHighestBidder("No bids yet")
    setHighestBidderId(derivedHighestBidderId)
    setBidHistory([])
    setAuctionStatus(derivedStatus)
    initializedRef.current = true
    saveState()
  }, [
    leagueId,
    league?.auctionDate,
    league?.auctionTime,
    tournamentTeams.length,
    auctionSettings.secondsPerTeam,
    auctionSettings.secondsBetweenTeams,
    league, // Added league to dependencies to match usage inside effect
  ])

  useEffect(() => {
    if (betweenResumeTimeoutRef.current) clearTimeout(betweenResumeTimeoutRef.current)
  }, [])

  const auctionDateTime = new Date(`${league?.auctionDate}T${league?.auctionTime}:00`)
  const currentDateTime = new Date()
  const auctionHasStarted = currentDateTime >= auctionDateTime
  const totalSpentAll = participants.reduce((sum, p) => sum + (p.totalSpent || 0), 0)

  useEffect(() => {
    if (!auctionHasStarted) return
    if (league?.status === "completed") return
    if (typeof window === "undefined") return
    const key = `auction_start_notified_${leagueId}`
    if (localStorage.getItem(key) === "1") return
    localStorage.setItem(key, "1")
    toast({
      title: "Auction Started",
      description: `${league?.name} auction is now LIVE.`,
    })
  }, [leagueId, league?.name, league?.status, toast])

  useEffect(() => {
    if (auctionStatus === "completed") {
      setShowOverview(true)
      try {
        const duration = 2500
        const end = Date.now() + duration
        const colors = ["#16a34a", "#f59e0b", "#a855f7", "#ec4899"]

        const frame = () => {
          confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors })
          confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors })
          if (Date.now() < end) requestAnimationFrame(frame)
        }
        frame()
      } catch {
        // ignore confetti errors
      }
    }
  }, [auctionStatus])

  if (!league || !currentTeam) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">League or tournament data not found.</p>
      </div>
    )
  }

  if (!auctionHasStarted) {
    return (
      <div className="space-y-6">
        <Card className="bg-gradient-to-r from-gray-100 to-gray-200 border-gray-300">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Clock className="h-8 w-8 text-gray-500" />
                <span className="text-2xl font-bold text-gray-700">Auction Not Started</span>
              </div>
              <p className="text-gray-600 mb-4">
                The auction is scheduled to begin on {new Date(auctionDateTime).toLocaleDateString()} at{" "}
                {league?.auctionTime}
              </p>
              <p className="text-sm text-gray-500">
                Please return at the scheduled time to participate in the auction.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Auction Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tournament:</span>
                <span className="font-medium">{league?.tournamentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Start Date:</span>
                <span className="font-medium">{new Date(auctionDateTime).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Start Time:</span>
                <span className="font-medium">{league?.auctionTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Teams:</span>
                <span className="font-medium">{tournamentTeams.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Seconds per Team:</span>
                <span className="font-medium">{auctionSettings.secondsPerTeam}s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Seconds Between Teams:</span>
                <span className="font-medium">{auctionSettings.secondsBetweenTeams}s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">After Bid:</span>
                <span className="font-medium">{auctionSettings.secondsAfterBid}s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Spending Limit:</span>
                <span className="font-medium">
                  {auctionSettings.enableSpendingLimit ? `$${auctionSettings.spendingLimit}` : "None"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (auctionStatus === "completed") {
    return (
      <div className="space-y-6">
        {/* Existing completion message */}
        <div className="text-center py-12">
          <Trophy className="h-16 w-16 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Auction Complete!</h2>
          <p className="text-muted-foreground">
            All teams have been auctioned. Check the results in your league dashboard.
          </p>
        </div>

        {/* Auction Overview Pop-up */}
        <Dialog open={showOverview} onOpenChange={setShowOverview}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Auction Overview</DialogTitle>
              <DialogDescription>
                The auction has concluded. Here&apos;s a summary of results. Get ready for the tournament!
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="p-3 rounded bg-muted/50 flex items-center justify-between">
                <span className="font-medium">Total Spent (all participants)</span>
                <span className="font-bold">${totalSpentAll}</span>
              </div>

              <div className="space-y-3 max-h-80 overflow-y-auto">
                {participants.map((participant) => {
                  const teams = acquired[String(participant.id)] || []
                  return (
                    <div key={participant.id} className="p-3 rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold flex items-center gap-2">
                          <UserEmblem userId={String(participant.id)} className="h-4 w-4" />
                          {participant.name}
                        </p>
                        <Badge variant="outline">
                          {teams.length} {teams.length === 1 ? "team" : "teams"}
                        </Badge>
                      </div>

                      {teams.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No teams acquired</p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {teams.map((t, idx) => (
                            <div key={idx} className="p-2 rounded border bg-muted/30 text-sm">
                              <div className="font-medium">{t.name}</div>
                              <div className="flex justify-between text-xs text-muted-foreground">
                                <span>
                                  #{t.seed} {t.region}
                                </span>
                                <span className="font-semibold">${t.price}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              <p className="text-sm text-muted-foreground">🔥 Fireworks are in the air — the tournament begins now!</p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Auction Status Bar */}
      <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-primary" />
                <span className="font-semibold">
                  Team {currentTeamIndex + 1} of {tournamentTeams.length}
                </span>
              </div>
              <Badge className={auctionStatus === "active" ? "bg-green-500" : "bg-yellow-500"}>
                {auctionStatus === "active" ? "LIVE" : "PAUSED"}
              </Badge>
            </div>
            {isCommissioner && (
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={handlePauseResume}>
                  {auctionStatus === "active" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  {auctionStatus === "active" ? "Pause" : "Resume"}
                </Button>
                <Button variant="outline" size="sm" onClick={handleNextTeam}>
                  <SkipForward className="h-4 w-4" />
                  Next Team
                </Button>
              </div>
            )}
          </div>
          <Progress value={(currentTeamIndex / tournamentTeams.length) * 100} className="mt-4" />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Team Auction */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Team Card */}
          <Card className="border-2 border-primary/20">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl flex items-center">
                    <Trophy className="h-6 w-6 mr-2 text-primary" />
                    {currentTeam.name}
                  </CardTitle>
                  <CardDescription className="text-lg">
                    #{currentTeam.seed} Seed • {currentTeam.region}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2 mb-2">
                    <Timer className="h-5 w-5 text-red-500" />
                    <span className="text-3xl font-bold text-red-500">{timeRemaining}s</span>
                  </div>
                  <Badge variant="outline">Time Remaining</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-600">${currentBid}</p>
                  <p className="text-sm text-muted-foreground">Current Bid</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <Crown className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-lg font-semibold text-blue-600">{highestBidder}</p>
                  <p className="text-sm text-muted-foreground">Highest Bidder</p>
                </div>
              </div>

              {/* Bidding Interface */}
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    type="number"
                    placeholder={`Minimum: $${currentBid + 10}`}
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    min={currentBid + 10}
                    max={auctionSettings.enableSpendingLimit ? myRemainingBudget : undefined}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleBid}
                    disabled={
                      !bidAmount ||
                      Number.parseInt(bidAmount) <= currentBid ||
                      auctionStatus !== "active" ||
                      (auctionSettings.enableSpendingLimit && Number.parseInt(bidAmount) > myRemainingBudget)
                    }
                    className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                  >
                    <Gavel className="h-4 w-4 mr-2" />
                    Place Bid
                  </Button>
                </div>

                {/* Quick Bid Buttons */}
                <div className="flex space-x-2">
                  {[10, 25, 50, 100].map((increment) => (
                    <Button
                      key={increment}
                      variant="outline"
                      size="sm"
                      onClick={() => setBidAmount((currentBid + increment).toString())}
                      disabled={auctionStatus !== "active"}
                    >
                      +${increment}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bid History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Bid History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-48">
                {bidHistory.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No bids yet for this team</p>
                ) : (
                  <div className="space-y-2">
                    {bidHistory.map((bid, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Target className="h-4 w-4 text-primary" />
                          <span className="font-medium">{bid.bidder}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">${bid.amount}</p>
                          <p className="text-xs text-muted-foreground">{bid.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Teams Acquired (new section under Bid History) */}
          <Card>
            <CardHeader>
              <CardTitle>Teams Acquired</CardTitle>
              <CardDescription>Teams bought by league participants during this auction</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {participants.map((participant) => {
                  const teams = acquired[participant.id as string] || []
                  return (
                    <div key={participant.id} className="p-3 rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold flex items-center gap-2">
                          <UserEmblem userId={String(participant.id)} className="h-4 w-4" />
                          {participant.name}
                        </p>
                        <Badge variant="outline">
                          {teams.length} {teams.length === 1 ? "team" : "teams"}
                        </Badge>
                      </div>
                      {teams.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No teams acquired yet</p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                          {teams.map((t, idx) => (
                            <div key={idx} className="p-2 rounded border bg-muted/30 text-sm">
                              <div className="font-medium">{t.name}</div>
                              <div className="flex justify-between text-xs text-muted-foreground">
                                <span>
                                  #{t.seed} {t.region}
                                </span>
                                <span className="font-semibold">${t.price}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {auctionSettings.budgetsVisible && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Participants
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {participants.map((participant) => (
                    <div key={participant.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div>
                        <p className="font-medium flex items-center gap-2">
                          <UserEmblem userId={String(participant.id)} className="h-4 w-4" />
                          {participant.name}
                        </p>
                        <p className="text-sm text-muted-foreground">{participant.teamsWon} teams won</p>
                      </div>
                      <div className="text-right">
                        {auctionSettings.enableSpendingLimit ? (
                          <>
                            <p className="font-semibold">${participant.remainingBudget}</p>
                            <p className="text-xs text-muted-foreground">remaining</p>
                            <Progress
                              value={(participant.remainingBudget / baseBudget) * 100}
                              className="mt-2 w-24 ml-auto"
                            />
                          </>
                        ) : (
                          <>
                            <p className="font-semibold">${participant.remainingBudget}</p>
                            <p className="text-xs text-muted-foreground">total spent</p>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Upcoming Teams - Only show if enabled in league settings */}
          {auctionSettings.showUpcomingTeams && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Next Up
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {tournamentTeams.slice(currentTeamIndex + 1, currentTeamIndex + 4).map((team, index) => (
                    <div key={team.id} className="flex items-center justify-between p-2 rounded border">
                      <div>
                        <p className="font-medium text-sm">{team.name}</p>
                        <p className="text-xs text-muted-foreground">
                          #{team.seed} {team.region}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {index + 1}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tournament Info */}
          <Card>
            <CardHeader>
              <CardTitle>Auction Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tournament:</span>
                  <span className="font-medium">{league?.tournamentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Teams:</span>
                  <span className="font-medium">{tournamentTeams.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Remaining:</span>
                  <span className="font-medium">{tournamentTeams.length - currentTeamIndex - 1}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time per Team:</span>
                  <span className="font-medium">{auctionSettings.secondsPerTeam}s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Between Teams:</span>
                  <span className="font-medium">{auctionSettings.secondsBetweenTeams}s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">After Bid:</span>
                  <span className="font-medium">{auctionSettings.secondsAfterBid}s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Spending Limit:</span>
                  <span className="font-medium">
                    {auctionSettings.enableSpendingLimit ? `$${auctionSettings.spendingLimit}` : "None"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
