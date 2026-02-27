"use client"

import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { leagueStore } from "@/lib/league-store"
import { useParams } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { RealTimeAuction } from "@/components/real-time-auction"
import { useAuth } from "@/components/auth-provider"

export default function LeagueAuctionPage() {
  const params = useParams()
  const leagueId = params.id as string
  const league = leagueStore.getState().getLeague(leagueId)
  const { user } = useAuth()

  /* Added useEffect to fetch leagues from Supabase on mount per user request to fix data loss on refresh */
  useEffect(() => {
    leagueStore.getState().fetchLeagues()
  }, [])

  // Mock auction state
  const [currentTeam, setCurrentTeam] = useState({
    id: 1,
    name: "Duke Blue Devils",
    seed: 1,
    region: "East",
    currentBid: 85,
    highestBidder: "Sarah Miller",
    timeRemaining: 23,
  })

  const [userBid, setUserBid] = useState("")
  const [auctionPhase, setAuctionPhase] = useState<"waiting" | "active" | "sold">("active")

  // Mock player budgets
  const [playerBudgets, setPlayerBudgets] = useState([
    { id: "1", name: "John Doe", budget: 415, spent: 85, teamsWon: 1 },
    { id: "2", name: "Sarah Miller", budget: 340, spent: 160, teamsWon: 2 },
    { id: "3", name: "Mike Rodriguez", budget: 380, spent: 120, teamsWon: 1 },
    { id: "4", name: "Lisa Kim", budget: 460, spent: 40, teamsWon: 1 },
    { id: "5", name: "Tom Brown", budget: 500, spent: 0, teamsWon: 0 },
    { id: "6", name: "You", budget: 360, spent: 140, teamsWon: 2 },
  ])

  // Mock drafted teams
  const [draftedTeams, setDraftedTeams] = useState([
    { id: 1, name: "Kansas Jayhawks", seed: 1, region: "Midwest", price: 160, owner: "You" },
    { id: 2, name: "North Carolina Tar Heels", seed: 8, region: "East", price: 95, owner: "Sarah Miller" },
    { id: 3, name: "Auburn Tigers", seed: 2, region: "South", price: 80, owner: "You" },
    { id: 4, name: "Tennessee Volunteers", seed: 3, region: "East", price: 65, owner: "Sarah Miller" },
    { id: 5, name: "Kentucky Wildcats", seed: 6, region: "East", price: 40, owner: "Lisa Kim" },
    { id: 6, name: "Texas Tech Red Raiders", seed: 3, region: "West", price: 120, owner: "Mike Rodriguez" },
    { id: 7, name: "Purdue Boilermakers", seed: 1, region: "Midwest", price: 85, owner: "John Doe" },
  ])

  // Mock upcoming teams
  const upcomingTeams = [
    { id: 8, name: "Gonzaga Bulldogs", seed: 3, region: "West" },
    { id: 9, name: "UCLA Bruins", seed: 2, region: "West" },
    { id: 10, name: "Villanova Wildcats", seed: 2, region: "Midwest" },
    { id: 11, name: "Baylor Bears", seed: 1, region: "South" },
    { id: 12, name: "Houston Cougars", seed: 1, region: "South" },
  ]

  // Get auction settings from league
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

  const handlePlaceBid = () => {
    const bidAmount = Number.parseFloat(userBid)
    if (bidAmount > currentTeam.currentBid) {
      setCurrentTeam((prev) => ({
        ...prev,
        currentBid: bidAmount,
        highestBidder: "You",
        timeRemaining: auctionSettings.secondsAfterBid,
      }))
      setUserBid("")
    }
  }

  const handleQuickBid = (amount: number) => {
    const newBid = currentTeam.currentBid + amount
    setCurrentTeam((prev) => ({
      ...prev,
      currentBid: newBid,
      highestBidder: "You",
      timeRemaining: auctionSettings.secondsAfterBid,
    }))
  }

  // Timer effect
  const { secondsPerTeam, secondsBetweenTeams, secondsAfterBid } = auctionSettings
  useEffect(() => {
    if (auctionPhase === "active" && currentTeam.timeRemaining > 0) {
      const timer = setTimeout(() => {
        setCurrentTeam((prev) => ({
          ...prev,
          timeRemaining: prev.timeRemaining - 1,
        }))
      }, 1000)
      return () => clearTimeout(timer)
    } else if (currentTeam.timeRemaining === 0) {
      setAuctionPhase("sold")
      // Add team to drafted teams
      setDraftedTeams((prev) => [
        ...prev,
        {
          id: currentTeam.id,
          name: currentTeam.name,
          seed: currentTeam.seed,
          region: currentTeam.region,
          price: currentTeam.currentBid,
          owner: currentTeam.highestBidder,
        },
      ])
      // Update player budgets
      setPlayerBudgets((prev) =>
        prev.map((player) =>
          player.name === currentTeam.highestBidder
            ? {
                ...player,
                budget: player.budget - currentTeam.currentBid,
                spent: player.spent + currentTeam.currentBid,
                teamsWon: player.teamsWon + 1,
              }
            : player,
        ),
      )
      // Move to next team after delay
      setTimeout(() => {
        const nextTeam = upcomingTeams[0]
        if (nextTeam) {
          setCurrentTeam({
            id: nextTeam.id,
            name: nextTeam.name,
            seed: nextTeam.seed,
            region: nextTeam.region,
            currentBid: 10,
            highestBidder: "",
            timeRemaining: secondsPerTeam,
          })
          setAuctionPhase("active")
        }
      }, secondsBetweenTeams * 1000)
    }
  }, [currentTeam.timeRemaining, auctionPhase])

  if (!league) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground">League Not Found</h1>
            <p className="text-muted-foreground mt-2">The league you're looking for doesn't exist.</p>
            <Button asChild className="mt-4">
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link href={`/leagues/${leagueId}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to League
            </Link>
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{league.name} - Live Auction</h1>
              <p className="text-muted-foreground">{league.tournamentName}</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 animate-pulse">
                LIVE AUCTION
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid gap-6 grid-cols-1">
          {/* Main Auction Area */}
          <div className="col-span-1">
            <RealTimeAuction
              leagueId={leagueId}
              isCommissioner={league.createdBy === (user?.id || "6")}
              userId={user?.id || "6"}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
