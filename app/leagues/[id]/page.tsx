"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Navigation } from "@/components/navigation"
import {
  ArrowLeft,
  Users,
  DollarSign,
  Calendar,
  Trophy,
  Crown,
  Target,
  CheckCircle,
  XCircle,
  Settings,
  UserX,
  MessageCircle,
  Clock,
} from "lucide-react"
import Link from "next/link"
import { TournamentBracket } from "@/components/tournament-bracket"
import { LeagueChat } from "@/components/league-chat"
import { Input } from "@/components/ui/input"
import { useState, useEffect, useMemo } from "react"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { useParams, useRouter } from "next/navigation"
import { leagueStore } from "@/lib/league-store"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useAuth } from "@/components/auth-provider"
import { UserEmblem } from "@/components/user-emblem"

export default function LeaguePage() {
  const params = useParams()
  const leagueId = params.id as string
  const [league, setLeague] = useState(leagueStore.getState().getLeague(leagueId))
  const { user } = useAuth()

  /* Added useEffect to fetch leagues from Supabase on mount per user request to fix data loss on refresh */
  useEffect(() => {
    leagueStore.getState().fetchLeagues()
  }, [])

  useEffect(() => {
    const unsubscribe = leagueStore.subscribe(() => {
      const updatedLeague = leagueStore.getState().getLeague(leagueId)
      setLeague(updatedLeague)
    })

    return unsubscribe
  }, [leagueId])

  useEffect(() => {
    // Subscribe to leagueStore updates so the league view reflects auction completion/results
    const unsubscribe = leagueStore.subscribe(() => {
      const updatedLeague = leagueStore.getState().getLeague(leagueId)
      if (updatedLeague) {
        setLeague(updatedLeague)
      }
    })
    return () => {
      unsubscribe()
    }
  }, [leagueId])

  useEffect(() => {
    const unsubscribe = leagueStore.subscribe((state) => {
      const updatedLeague = state.getLeague(leagueId)
      if (updatedLeague && updatedLeague.status !== league?.status) {
        setLeague(updatedLeague)
      }
    })
    return unsubscribe
  }, [leagueId, league?.status])

  const { toast } = useToast()
  const [showSettings, setShowSettings] = useState(false)
  const [settingsData, setSettingsData] = useState({
    name: "",
    description: "",
    maxMembers: "",
    auctionDate: "",
    auctionTime: "",
    entryFee: "",
    minBid: "",
    maxBid: "",
    bidIncrement: "",
    isPublic: false,
    firstPlacePayout: "50",
    secondPlacePayout: "30",
    thirdPlacePayout: "20",
  })
  const [selectedUser, setSelectedUser] = useState("")
  const [directMessage, setDirectMessage] = useState("")
  const [directMessages, setDirectMessages] = useState<any[]>([])

  const router = useRouter()
  const [showLeaveConfirmation, setShowLeaveConfirmation] = useState(false)
  const [hasLeftLeague, setHasLeftLeague] = useState(false)
  const currentUser = user

  // Check if current user is the commissioner (only the creator can access commissioner settings)
  const currentUserId = user?.id || "6" // Use actual user ID from auth context
  const isCommissioner = league?.createdBy === currentUserId

  // Check if user is still a member of the league
  const isUserMember = league && leagueStore.getState().isUserMember(league.id, currentUserId)

  // Mock squads data for post-auction view
  const mockSquads = [
    {
      id: 1,
      name: "Thunder Squad",
      owner: "Sarah Miller",
      position: 1,
      points: 285,
      winnings: 120,
      totalSpent: 500,
      activeTeams: 4,
      totalTeams: 8,
      teams: [
        { name: "Duke Blue Devils", seed: 1, region: "East", status: "active", points: 85, price: 185 },
        { name: "North Carolina Tar Heels", seed: 2, region: "East", status: "active", points: 70, price: 160 },
        { name: "Kentucky Wildcats", seed: 3, region: "East", status: "eliminated", points: 45, price: 140 },
        { name: "Tennessee Volunteers", seed: 4, region: "East", status: "active", points: 55, price: 120 },
        { name: "Saint Mary's Gaels", seed: 5, region: "East", status: "eliminated", points: 30, price: 95 },
        { name: "Texas A&M Aggies", seed: 6, region: "East", status: "active", points: 0, price: 85 },
        { name: "Michigan State Spartans", seed: 7, region: "East", status: "eliminated", points: 0, price: 75 },
        { name: "Memphis Tigers", seed: 8, region: "East", status: "eliminated", points: 0, price: 65 },
      ],
    },
    {
      id: 2,
      name: "Lightning Bolts",
      owner: "Mike Rodriguez",
      position: 2,
      points: 245,
      winnings: 80,
      totalSpent: 480,
      activeTeams: 3,
      totalTeams: 8,
      teams: [
        { name: "Kansas Jayhawks", seed: 1, region: "Midwest", status: "active", points: 90, price: 200 },
        { name: "Villanova Wildcats", seed: 2, region: "Midwest", status: "active", points: 75, price: 170 },
        { name: "Purdue Boilermakers", seed: 3, region: "Midwest", status: "eliminated", points: 40, price: 150 },
        { name: "Wisconsin Badgers", seed: 4, region: "Midwest", status: "active", points: 40, price: 110 },
        { name: "Houston Cougars", seed: 5, region: "Midwest", status: "eliminated", points: 0, price: 100 },
        { name: "Colorado State Rams", seed: 6, region: "Midwest", status: "eliminated", points: 0, price: 90 },
        { name: "Iowa Hawkeyes", seed: 7, region: "Midwest", status: "eliminated", points: 0, price: 80 },
        { name: "San Diego State Aztecs", seed: 8, region: "Midwest", status: "eliminated", points: 0, price: 70 },
      ],
    },
    {
      id: 3,
      name: "Storm Chasers",
      owner: "Lisa Kim",
      position: 3,
      points: 210,
      winnings: 0,
      totalSpent: 470,
      activeTeams: 2,
      totalTeams: 8,
      teams: [
        { name: "Gonzaga Bulldogs", seed: 1, region: "West", status: "active", points: 80, price: 190 },
        { name: "Arizona Wildcats", seed: 2, region: "West", status: "eliminated", points: 50, price: 165 },
        { name: "Texas Tech Red Raiders", seed: 3, region: "West", status: "active", points: 80, price: 145 },
        { name: "Arkansas Razorbacks", seed: 4, region: "West", status: "eliminated", points: 0, price: 125 },
        { name: "UConn Huskies", seed: 5, region: "West", status: "eliminated", points: 0, price: 105 },
        { name: "Alabama Crimson Tide", seed: 6, region: "West", status: "eliminated", points: 0, price: 95 },
        { name: "Michigan Wolverines", seed: 7, region: "West", status: "eliminated", points: 0, price: 85 },
        { name: "Creighton Bluejays", seed: 8, region: "West", status: "eliminated", points: 0, price: 75 },
      ],
    },
    {
      id: 4,
      name: "Your Squad",
      owner: "You",
      position: 4,
      points: 195,
      winnings: 0,
      totalSpent: 490,
      activeTeams: 3,
      totalTeams: 8,
      teams: [
        { name: "Baylor Bears", seed: 1, region: "South", status: "active", points: 75, price: 180 },
        { name: "Auburn Tigers", seed: 2, region: "South", status: "active", points: 65, price: 155 },
        { name: "Texas Longhorns", seed: 3, region: "South", status: "eliminated", points: 35, price: 135 },
        { name: "UCLA Bruins", seed: 4, region: "South", status: "active", points: 20, price: 115 },
        { name: "Saint Peter's Peacocks", seed: 5, region: "South", status: "eliminated", points: 0, price: 100 },
        { name: "LSU Tigers", seed: 6, region: "South", status: "eliminated", points: 0, price: 90 },
        { name: "Ohio State Buckeyes", seed: 7, region: "South", status: "eliminated", points: 0, price: 80 },
        { name: "Loyola Chicago Ramblers", seed: 8, region: "South", status: "eliminated", points: 0, price: 75 },
      ],
    },
  ]

  const getMemberName = (memberId: string) => {
    // Get current user
    const currentUser = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("currentUser") || "null") : null
    if (currentUser && currentUser.id === memberId) {
      return currentUser.name
    }

    // Get other users from localStorage
    const existingUsers = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("users") || "[]") : []
    const user = existingUsers.find((u: any) => u.id === memberId)
    return user ? user.name : `Member ${memberId}`
  }

  // Mock squads data for pre-auction view (no teams acquired yet)
  const mockPreAuctionSquads = () => {
    if (!league) return []

    const allMembers = [...(league.joinedMembers || []), league.createdBy]
    // Remove duplicates in case commissioner is also in joinedMembers
    const uniqueMembers = [...new Set(allMembers)]

    return uniqueMembers.map((memberId, index) => {
      const memberName = getMemberName(memberId)
      return {
        id: index + 1,
        name: `${memberName}'s Squad`,
        owner: memberName,
        position: null,
        points: 0,
        winnings: 0,
        totalSpent: 0,
        activeTeams: 0,
        totalTeams: 0,
        teams: [],
      }
    })
  }

  const getAuctionResults = () => {
    if (!league) return []

    const allMembers = [...(league.joinedMembers || []), league.createdBy]
    // Remove duplicates in case commissioner is also in joinedMembers
    const uniqueMembers = [...new Set(allMembers)]

    if (league.auctionResults && Object.keys(league.auctionResults).length > 0) {
      const auctionResults = league.auctionResults as Record<string, any[]>

      return uniqueMembers.map((memberId) => {
        const memberName = getMemberName(memberId)
        const memberTeams = auctionResults[memberId] || []

        const totalSpent = memberTeams.reduce((sum, team) => sum + (team.price || 0), 0)
        const totalTeams = memberTeams.length
        const activeTeams = memberTeams.filter((team) => team.status === "active").length

        return {
          id: memberId,
          name: `${memberName}'s Squad`,
          owner: memberName,
          position: null,
          points: memberTeams.reduce((sum, team) => sum + (team.points || 0), 0),
          winnings: memberTeams.reduce((sum, team) => sum + (team.earnings || 0), 0),
          totalSpent,
          activeTeams,
          totalTeams,
          teams: memberTeams.map((team: any) => ({
            name: team.name,
            seed: team.seed,
            region: team.region,
            status: team.status || "active",
            price: team.price,
            points: team.points || 0,
            wins: team.wins || 0,
            earnings: team.earnings || 0,
          })),
        }
      })
    }

    // Return pre-auction squads if no auction results exist yet
    return mockPreAuctionSquads()
  }

  // Helper function to calculate winnings based on performance
  const calculateWinnings = (points: number, totalSpent: number) => {
    // Simple calculation - this would be more complex in real implementation
    const efficiency = points > 0 ? (points / totalSpent) * 100 : 0
    return Math.max(0, Math.floor(efficiency * 2))
  }

  // Dynamic participants based on league status and actual members
  const getLeaderboardData = () => {
    /* Added null check to prevent "Cannot read properties of undefined (reading 'joinedMembers')" error */
    if (!league) return []
    const allMembers = new Set([...(league.joinedMembers || []), league.createdBy])

    if (league?.status === "upcoming") {
      // Before tournament starts - everyone at 0
      return Array.from(allMembers).map((memberId, index) => ({
        id: memberId,
        name: getMemberName(memberId),
        teamsOwned: 0,
        totalSpent: 0,
        currentWinnings: 0,
        position: 1,
        points: 0,
      }))
    } else {
      // During/after tournament - calculate actual performance data
      const memberStats = Array.from(allMembers).map((memberId) => {
        const memberName = getMemberName(memberId)
        const auctionResults = getAuctionResults()
        const memberSquad = auctionResults.find((squad) => squad.name === memberName)

        // Calculate points from tournament bracket
        let tournamentPoints = 0
        if (memberSquad?.teams) {
          memberSquad.teams.forEach((team) => {
            // Points based on tournament performance
            // First round wins = 1 point, Second round = 2 points, etc.
            if (team.wins > 0) {
              tournamentPoints += team.wins * 2 // 2 points per win
            }
            // Bonus points for teams still active
            if (!team.eliminated) {
              tournamentPoints += 5 // 5 bonus points for active teams
            }
          })
        }

        return {
          id: memberId,
          name: memberName,
          teamsOwned: memberSquad?.totalTeams || 0,
          totalSpent: memberSquad?.totalSpent || 0,
          currentWinnings: memberSquad?.totalWinnings || 0,
          position: 1, // Will be calculated after sorting
          points: tournamentPoints,
        }
      })

      // Sort by points (descending) and assign positions
      memberStats.sort((a, b) => b.points - a.points)
      memberStats.forEach((member, index) => {
        member.position = index + 1
      })

      return memberStats
    }
  }

  const mockParticipants = getLeaderboardData()

  // Mock league members for commissioner management and direct messaging
  const mockLeagueMembers = [
    { id: "1", name: "John Doe", email: "john@example.com", joinedAt: "2024-03-01", isCommissioner: true },
    { id: "2", name: "Sarah Miller", email: "sarah@example.com", joinedAt: "2024-03-02", isCommissioner: false },
    { id: "3", name: "Mike Rodriguez", email: "mike@example.com", joinedAt: "2024-03-03", isCommissioner: false },
    { id: "4", name: "Lisa Kim", email: "lisa@example.com", joinedAt: "2024-03-04", isCommissioner: false },
    { id: "5", name: "Tom Brown", email: "tom@example.com", joinedAt: "2024-03-05", isCommissioner: false },
    { id: "6", name: "Alex Johnson", email: "alex@example.com", joinedAt: "2024-03-06", isCommissioner: false },
  ]

  const leagueMembers = useMemo(() => {
    if (!league) return []

    // Get all member IDs (joined members + creator)
    const allMemberIds = [...(league.joinedMembers || []), league.createdBy].filter(Boolean)

    // Create user objects for league members (using mock data for now)
    return mockLeagueMembers.filter((member) => allMemberIds.includes(member.id))
  }, [league])

  // Mock league members for commissioner management and direct messaging
  // const mockLeagueMembers = [
  //   { id: "1", name: "John Doe", email: "john@example.com", joinedAt: "2024-03-01", isCommissioner: true },
  //   { id: "2", name: "Sarah Miller", email: "sarah@example.com", joinedAt: "2024-03-02", isCommissioner: false },
  //   { id: "3", name: "Mike Rodriguez", email: "mike@example.com", joinedAt: "2024-03-03", isCommissioner: false },
  //   { id: "4", name: "Lisa Kim", email: "lisa@example.com", joinedAt: "2024-03-04", isCommissioner: false },
  //   { id: "5", name: "Tom Brown", email: "tom@example.com", joinedAt: "2024-03-05", isCommissioner: false },
  //   { id: "6", name: "Alex Johnson", email: "alex@example.com", joinedAt: "2024-03-06", isCommissioner: false },
  // ]

  // Function to get teams owned by current user from actual auction results
  const getUserOwnedTeams = () => {
    if (!league || (league.status !== "completed" && league.status !== "active")) {
      return []
    }

    // Get auction results - use mock data if no real results exist yet
    const auctionResults = league.auctionResults || {
      "6": [
        {
          name: "Baylor Bears",
          seed: 1,
          region: "South",
          status: "active",
          points: 75,
          price: 180,
          wins: 3,
          earnings: 25,
        },
        {
          name: "Auburn Tigers",
          seed: 2,
          region: "South",
          status: "active",
          points: 65,
          price: 155,
          wins: 2,
          earnings: 15,
        },
        {
          name: "Texas Longhorns",
          seed: 3,
          region: "South",
          status: "eliminated",
          points: 35,
          price: 135,
          wins: 1,
          earnings: 0,
        },
        {
          name: "UCLA Bruins",
          seed: 4,
          region: "South",
          status: "active",
          points: 20,
          price: 115,
          wins: 1,
          earnings: 5,
        },
      ],
    }

    const userTeams = auctionResults[currentUserId] || []
    return userTeams.map((team, index) => ({
      id: index + 1,
      name: team.name,
      seed: team.seed,
      region: team.region,
      purchasePrice: team.price || 0,
      wins: team.wins || 0,
      earnings: team.earnings || 0,
      eliminated: team.status === "eliminated",
    }))
  }

  const isAuctionCompleted = league?.auctionResults && Object.keys(league.auctionResults).length > 0
  const squadsToShow = getAuctionResults()

  const handleSettingsChange = (field: string, value: string | boolean) => {
    setSettingsData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSaveSettings = () => {
    // Only allow commissioner to save settings
    if (!isCommissioner) {
      toast({
        title: "Access Denied",
        description: "Only the league commissioner can modify settings.",
        variant: "destructive",
      })
      return
    }

    // Validate payout percentages add up to 100
    const totalPayout =
      Number.parseFloat(settingsData.firstPlacePayout) +
      Number.parseFloat(settingsData.secondPlacePayout) +
      Number.parseFloat(settingsData.thirdPlacePayout)

    if (Math.abs(totalPayout - 100) > 0.01) {
      toast({
        title: "Invalid Payout Structure",
        description: "Payout percentages must add up to 100%.",
        variant: "destructive",
      })
      return
    }

    // Update the league in the store with the new settings
    leagueStore.getState().updateLeague(leagueId, {
      name: settingsData.name,
      description: settingsData.description,
      maxMembers: Number.parseInt(settingsData.maxMembers),
      auctionDate: settingsData.auctionDate,
      auctionTime: settingsData.auctionTime,
      entryFee: Number.parseFloat(settingsData.entryFee),
      isPublic: settingsData.isPublic,
      minBid: Number.parseFloat(settingsData.minBid),
      maxBid: Number.parseFloat(settingsData.maxBid),
      bidIncrement: Number.parseFloat(settingsData.bidIncrement),
      firstPlacePayout: Number.parseFloat(settingsData.firstPlacePayout),
      secondPlacePayout: Number.parseFloat(settingsData.secondPlacePayout),
      thirdPlacePayout: Number.parseFloat(settingsData.thirdPlacePayout),
    })

    // Refresh league data
    const updatedLeague = leagueStore.getState().getLeague(leagueId)
    setLeague(updatedLeague)

    toast({
      title: "Settings Updated",
      description: "League settings have been successfully updated.",
    })
    setShowSettings(false)
  }

  const handleKickUser = (userId: string, userName: string) => {
    // Only allow commissioner to kick users
    if (!isCommissioner) {
      toast({
        title: "Access Denied",
        description: "Only the league commissioner can remove members.",
        variant: "destructive",
      })
      return
    }

    // Remove user from league
    leagueStore.getState().removeUserFromLeague(leagueId, userId)

    // Refresh league data to reflect the updated member count
    const updatedLeague = leagueStore.getState().getLeague(leagueId)
    setLeague(updatedLeague)

    toast({
      title: "User Removed",
      description: `${userName} has been removed from the league.`,
    })
  }

  const handleSendDirectMessage = () => {
    if (!selectedUser || !directMessage.trim()) return

    const selectedMember = leagueMembers.find((member) => member.id === selectedUser)
    if (!selectedMember) return

    leagueStore
      .getState()
      .sendDirectMessage(leagueId, currentUserId, "You", selectedUser, selectedMember.name, directMessage)

    // Refresh direct messages
    const messages = leagueStore.getState().getDirectMessages(leagueId, currentUserId, selectedUser)
    setDirectMessages(messages)

    setDirectMessage("")
    toast({
      title: "Message Sent",
      description: `Your message has been sent to ${selectedMember.name}.`,
    })
  }

  const handleLeaveLeague = () => {
    // Remove current user from league
    leagueStore.getState().removeUserFromLeague(leagueId, currentUserId)

    // Mark that user has left the league
    setHasLeftLeague(true)

    // Refresh league data to reflect the updated member count
    const updatedLeague = leagueStore.getState().getLeague(leagueId)
    setLeague(updatedLeague)

    toast({
      title: "Left League",
      description: `You have left ${league?.name}. You can return to your dashboard to view your other leagues.`,
    })

    // Close confirmation dialog
    setShowLeaveConfirmation(false)
  }

  const loadDirectMessages = (userId: string) => {
    const messages = leagueStore.getState().getDirectMessages(leagueId, currentUserId, userId)
    setDirectMessages(messages)
  }

  const hasAuctionDatePassed = () => {
    if (!league?.auctionDate || !league?.auctionTime) return false

    const auctionDateTime = new Date(`${league.auctionDate}T${league.auctionTime}`)
    const now = new Date()

    return now > auctionDateTime
  }

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Trophy className="h-5 w-5 text-gray-400" />
      case 3:
        return <Target className="h-5 w-5 text-amber-600" />
      default:
        return null
    }
  }

  const getTeamStatusColor = (status: string) => {
    return status === "active" ? "text-green-600" : "text-red-500"
  }

  const getTeamStatusBadge = (status: string) => {
    return status === "active" ? (
      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">Active</Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">Eliminated</Badge>
    )
  }

  // Add this useEffect to initialize settingsData properly
  useEffect(() => {
    if (league) {
      setSettingsData({
        name: league.name,
        description: league.description,
        maxMembers: league.maxMembers.toString(),
        auctionDate: league.auctionDate,
        auctionTime: league.auctionTime || "19:00",
        entryFee: league.entryFee.toString(),
        minBid: league.minBid?.toString() || "10",
        maxBid: league.maxBid?.toString() || "500",
        bidIncrement: league.bidIncrement?.toString() || "5",
        isPublic: league.isPublic || false,
        firstPlacePayout: league.firstPlacePayout?.toString() || "50",
        secondPlacePayout: league.secondPlacePayout?.toString() || "30",
        thirdPlacePayout: league.thirdPlacePayout?.toString() || "20",
      })
    }
  }, [league])

  // Load direct messages when selected user changes
  useEffect(() => {
    if (selectedUser) {
      loadDirectMessages(selectedUser)
    }
  }, [selectedUser])

  // If league not found, show error or redirect
  if (!league) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">League Not Found</h1>
            <p className="text-muted-foreground mt-2">The league you're looking for doesn't exist.</p>
            <Button asChild className="mt-4">
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // If user has left the league, show a message with option to return to dashboard
  if (hasLeftLeague || !isUserMember) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center">
            <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground">You have left this league</h1>
            <p className="text-muted-foreground mt-2">
              You are no longer a member of "{league.name}". You can return to your dashboard to view your other
              leagues.
            </p>
            <Button asChild className="mt-4">
              <Link href="/dashboard">Return to Dashboard</Link>
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
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{league.name}</h1>
              <p className="text-muted-foreground">
                {league.tournamentName} • {league.description}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                {league.status}
              </Badge>
              {league.status === "upcoming" && (
                <Button
                  variant="outline"
                  onClick={() => setShowLeaveConfirmation(true)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Leave League
                </Button>
              )}
              {isCommissioner && (
                <Button variant="outline" onClick={() => setShowSettings(!showSettings)}>
                  <Settings className="h-4 w-4 mr-2" />
                  Commissioner Settings
                </Button>
              )}
              {league.status !== "completed" && (!hasAuctionDatePassed() || isCommissioner) && (
                <Button
                  asChild
                  className={`bg-primary hover:bg-primary/90 ${league.status === "live" ? "animate-pulse" : ""}`}
                >
                  <Link href={`/leagues/${leagueId}/auction`}>JOIN AUCTION</Link>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Commissioner Settings Panel - Only visible to commissioner */}
        {showSettings && isCommissioner && (
          <Card className="mb-8 border-2 border-primary/20">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
              <CardTitle className="flex items-center">
                <Crown className="h-5 w-5 mr-2 text-primary" />
                Commissioner Settings
              </CardTitle>
              <CardDescription>
                As the league commissioner, you can modify these settings before the auction begins
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="settings-name">League Name</Label>
                  <Input
                    id="settings-name"
                    value={settingsData.name}
                    onChange={(e) => handleSettingsChange("name", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="settings-maxMembers">Maximum Members</Label>
                  <Input
                    id="settings-maxMembers"
                    type="number"
                    min="2"
                    max="50"
                    value={settingsData.maxMembers}
                    onChange={(e) => handleSettingsChange("maxMembers", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="settings-description">League Description</Label>
                <Textarea
                  id="settings-description"
                  value={settingsData.description}
                  onChange={(e) => handleSettingsChange("description", e.target.value)}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="settings-auctionDate">Auction Date</Label>
                  <Input
                    id="settings-auctionDate"
                    type="date"
                    value={settingsData.auctionDate}
                    onChange={(e) => handleSettingsChange("auctionDate", e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="settings-auctionTime">Auction Time</Label>
                  <Input
                    id="settings-auctionTime"
                    type="time"
                    value={settingsData.auctionTime}
                    onChange={(e) => handleSettingsChange("auctionTime", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="settings-entryFee">Entry Fee ($)</Label>
                  <Input
                    id="settings-entryFee"
                    type="number"
                    min="0"
                    step="0.01"
                    value={settingsData.entryFee}
                    onChange={(e) => handleSettingsChange("entryFee", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="settings-minBid">Minimum Bid ($)</Label>
                  <Input
                    id="settings-minBid"
                    type="number"
                    min="1"
                    value={settingsData.minBid}
                    onChange={(e) => handleSettingsChange("minBid", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="settings-maxBid">Maximum Bid ($)</Label>
                  <Input
                    id="settings-maxBid"
                    type="number"
                    min="1"
                    value={settingsData.maxBid}
                    onChange={(e) => handleSettingsChange("maxBid", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="settings-bidIncrement">Bid Increment ($)</Label>
                  <Input
                    id="settings-bidIncrement"
                    type="number"
                    min="1"
                    value={settingsData.bidIncrement}
                    onChange={(e) => handleSettingsChange("bidIncrement", e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label htmlFor="settings-isPublic" className="font-medium">
                    Public League
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {settingsData.isPublic
                      ? "Anyone can find and join your league"
                      : "Only people with the invite code can join"}
                  </p>
                </div>
                <Switch
                  id="settings-isPublic"
                  checked={settingsData.isPublic}
                  onCheckedChange={(checked) => handleSettingsChange("isPublic", checked)}
                />
              </div>

              {/* Payout Structure */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5 text-muted-foreground" />
                  <h4 className="font-medium">Payout Structure</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstPlacePayout">1st Place (%)</Label>
                    <Input
                      id="firstPlacePayout"
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={settingsData.firstPlacePayout}
                      onChange={(e) => handleSettingsChange("firstPlacePayout", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secondPlacePayout">2nd Place (%)</Label>
                    <Input
                      id="secondPlacePayout"
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={settingsData.secondPlacePayout}
                      onChange={(e) => handleSettingsChange("secondPlacePayout", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="thirdPlacePayout">3rd Place (%)</Label>
                    <Input
                      id="thirdPlacePayout"
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={settingsData.thirdPlacePayout}
                      onChange={(e) => handleSettingsChange("thirdPlacePayout", e.target.value)}
                    />
                  </div>
                </div>

                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Total Percentage:</span>
                    <span
                      className={`text-sm font-bold ${
                        Math.abs(
                          Number.parseFloat(settingsData.firstPlacePayout) +
                            Number.parseFloat(settingsData.secondPlacePayout) +
                            Number.parseFloat(settingsData.thirdPlacePayout) -
                            100,
                        ) < 0.01
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {(
                        Number.parseFloat(settingsData.firstPlacePayout) +
                        Number.parseFloat(settingsData.secondPlacePayout) +
                        Number.parseFloat(settingsData.thirdPlacePayout)
                      ).toFixed(1)}
                      %
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Percentages must add up to 100%</p>
                </div>
              </div>

              {/* League Members Management Section - Only visible to commissioner */}
              <div className="border-t pt-6">
                <h4 className="font-semibold text-lg mb-4 flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Manage League Members
                </h4>
                <div className="space-y-3">
                  {(league?.joinedMembers || []).map((memberId: string) => {
                    const memberName = getMemberName(memberId)
                    const isMemberCommissioner = memberId === league.createdBy
                    const emailPlaceholder = `${memberName.replace(/\\s+/g, "").toLowerCase()}@example.com`

                    return (
                      <div key={memberId} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                            <span className="text-sm font-medium">{memberName.charAt(0)}</span>
                          </div>
                          <div>
                            <p className="font-medium">{memberName}</p>
                            <p className="text-sm text-muted-foreground">{emailPlaceholder}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {isMemberCommissioner ? (
                            <Badge className="bg-primary/10 text-primary">Commissioner</Badge>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleKickUser(memberId, memberName)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <UserX className="h-4 w-4 mr-1" />
                              Remove
                            </Button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setShowSettings(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleSaveSettings} className="flex-1 bg-primary hover:bg-primary/90">
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* League Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Pot</p>
                  <p className="text-2xl font-bold text-foreground">
                    ${league.totalPot || league.members * league.entryFee}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Members</p>
                  <p className="text-2xl font-bold text-foreground">
                    {league.members}/{league.maxMembers}
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
                  <p className="text-2xl font-bold text-foreground">${league.entryFee}</p>
                </div>
                <Trophy className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Auction</p>
                  <p className="text-lg font-bold text-foreground">{league.auctionDate}</p>
                  <p className="text-sm text-muted-foreground flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {league.auctionTime}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="squads" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="squads">All Squads</TabsTrigger>
            <TabsTrigger value="bracket">Live Bracket</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="my-teams">My Teams</TabsTrigger>
            <TabsTrigger value="payouts">Payouts</TabsTrigger>
            <TabsTrigger value="communication">Communication</TabsTrigger>
          </TabsList>

          <TabsContent value="squads">
            <Card>
              <CardHeader>
                <CardTitle>All Squads</CardTitle>
                <CardDescription>
                  {isAuctionCompleted
                    ? "Complete overview of all squads, their teams, and performance"
                    : "All squads in the league - teams will be assigned during the auction"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {squadsToShow.map((squad) => (
                    <div
                      key={squad.id}
                      className={`p-6 rounded-lg border ${squad.owner === "You" ? "bg-primary/5 border-primary/20" : ""}`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            {squad.position && (
                              <>
                                <span className="text-2xl font-bold text-muted-foreground">#{squad.position}</span>
                                {getPositionIcon(squad.position)}
                              </>
                            )}
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold">{squad.name}</h3>
                            <p className="text-sm text-muted-foreground flex items-center gap-2">
                              Owned by <UserEmblem userId={squad.id} className="h-4 w-4" /> {squad.owner}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary">{squad.points} pts</p>
                          <p className="text-sm text-green-600">${squad.winnings} winnings</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                          <p className="text-sm text-muted-foreground">Total Spent</p>
                          <p className="text-lg font-bold">${squad.totalSpent}</p>
                        </div>
                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                          <p className="text-sm text-muted-foreground">Active Teams</p>
                          <p className="text-lg font-bold text-green-600">{squad.activeTeams}</p>
                        </div>
                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                          <p className="text-sm text-muted-foreground">Total Teams</p>
                          <p className="text-lg font-bold">{squad.totalTeams}</p>
                        </div>
                      </div>

                      {squad.teams.length > 0 ? (
                        <div className="space-y-3">
                          <h4 className="font-semibold text-lg mb-3">Teams Acquired</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                            {squad.teams.map((team, index) => (
                              <div
                                key={index}
                                className={`p-3 rounded-lg border ${
                                  team.status === "active"
                                    ? "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800"
                                    : team.status === "eliminated"
                                      ? "bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800"
                                      : "bg-gray-50 border-gray-200 dark:bg-gray-950/20 dark:border-gray-800"
                                }`}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center space-x-2">
                                    {team.status === "active" ? (
                                      <CheckCircle className="h-4 w-4 text-green-600" />
                                    ) : team.status === "eliminated" ? (
                                      <XCircle className="h-4 w-4 text-red-600" />
                                    ) : (
                                      <Trophy className="h-4 w-4 text-gray-600" />
                                    )}
                                    <span className="font-semibold text-sm">{team.name}</span>
                                  </div>
                                </div>
                                <div className="text-xs text-muted-foreground space-y-1">
                                  <div className="flex justify-between">
                                    <span>
                                      #{team.seed} {team.region}
                                    </span>
                                    <span className="font-medium">{team.points} pts</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Purchase:</span>
                                    <span className="font-medium">${team.price}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8 bg-muted/30 rounded-lg">
                          <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                          <p className="text-muted-foreground">
                            No teams acquired yet. Teams will be assigned after the auction.
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bracket">
            <TournamentBracket tournamentId={league.tournamentName} leagueSquads={squadsToShow} />
          </TabsContent>

          <TabsContent value="leaderboard">
            <Card>
              <CardHeader>
                <CardTitle>League Leaderboard</CardTitle>
                <CardDescription>Current standings based on team performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockParticipants.map((participant, index) => (
                    <div
                      key={participant.id}
                      className={`flex items-center justify-between p-4 rounded-lg border ${participant.name === "You" ? "bg-primary/5 border-primary/20" : ""}`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-bold text-muted-foreground">#{participant.position}</span>
                          {getPositionIcon(participant.position)}
                        </div>
                        <div>
                          <h3 className="font-semibold flex items-center gap-2">
                            <UserEmblem userId={participant.id} className="h-4 w-4" />
                            {participant.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {participant.teamsOwned} teams • ${participant.totalSpent} spent
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">${participant.currentWinnings}</p>
                        <p className="text-sm text-muted-foreground">Current winnings</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="my-teams">
            <Card>
              <CardHeader>
                <CardTitle>My Teams</CardTitle>
                <CardDescription>Teams you own and their {league.tournamentName} performance</CardDescription>
              </CardHeader>
              <CardContent>
                {isAuctionCompleted ? (
                  <div className="space-y-4">
                    {getUserOwnedTeams().map((team) => (
                      <div
                        key={team.id}
                        className={`flex items-center justify-between p-4 rounded-lg border ${team.eliminated ? "opacity-60 bg-red-50 dark:bg-red-900/10" : "bg-green-50 dark:bg-green-900/10"}`}
                      >
                        <div>
                          <h3 className={`font-semibold text-lg ${team.eliminated ? "line-through" : ""}`}>
                            {team.name}
                          </h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline">#{team.seed} Seed</Badge>
                            <Badge variant="outline">{team.region} Region</Badge>
                            {team.eliminated && <Badge className="bg-red-500 text-white">Eliminated</Badge>}
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">Purchased for ${team.purchasePrice}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">{team.wins} Wins</p>
                          <p className={`text-sm ${team.earnings > 0 ? "text-green-600" : "text-muted-foreground"}`}>
                            {team.earnings > 0 ? `+$${team.earnings} earned` : "No earnings yet"}
                          </p>
                        </div>
                      </div>
                    ))}

                    <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold">Total Investment</h4>
                          <p className="text-sm text-muted-foreground">Amount spent on teams</p>
                        </div>
                        <p className="text-xl font-bold">
                          ${getUserOwnedTeams().reduce((sum, team) => sum + team.purchasePrice, 0)}
                        </p>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <div>
                          <h4 className="font-semibold">Current Earnings</h4>
                          <p className="text-sm text-muted-foreground">Winnings from team performance</p>
                        </div>
                        <p className="text-xl font-bold text-green-600">
                          +${getUserOwnedTeams().reduce((sum, team) => sum + team.earnings, 0)}
                        </p>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <div>
                          <h4 className="font-semibold">Active Teams</h4>
                          <p className="text-sm text-muted-foreground">Teams still in tournament</p>
                        </div>
                        <p className="text-xl font-bold text-primary">
                          {getUserOwnedTeams().filter((team) => !team.eliminated).length}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-muted/30 rounded-lg">
                    <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No Teams Yet</h3>
                    <p className="text-muted-foreground">
                      You haven't acquired any teams yet. Teams will be assigned during the auction.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payouts">
            <Card>
              <CardHeader>
                <CardTitle>Payout Structure</CardTitle>
                <CardDescription>How winnings are distributed based on team performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      <h4 className="font-semibold mb-3">Payout Distribution</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>1st Place</span>
                          <span className="font-medium">
                            {league.firstPlacePayout || 50}% ($
                            {(
                              (league.totalPot || league.members * league.entryFee) *
                              ((league.firstPlacePayout || 50) / 100)
                            ).toFixed(2)}
                            )
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>2nd Place</span>
                          <span className="font-medium">
                            {league.secondPlacePayout || 30}% ($
                            {(
                              (league.totalPot || league.members * league.entryFee) *
                              ((league.secondPlacePayout || 30) / 100)
                            ).toFixed(2)}
                            )
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>3rd Place</span>
                          <span className="font-medium">
                            {league.thirdPlacePayout || 20}% ($
                            {(
                              (league.totalPot || league.members * league.entryFee) *
                              ((league.thirdPlacePayout || 20) / 100)
                            ).toFixed(2)}
                            )
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-accent/10 rounded-lg">
                    <h4 className="font-semibold mb-2">Current Tournament Status</h4>
                    <p className="text-sm text-muted-foreground">
                      {isAuctionCompleted
                        ? "The tournament is currently in the Elite Eight round. Final payouts will be calculated after the championship game. Current standings are based on points earned so far."
                        : "The auction has not been completed yet. Payouts will be calculated based on team performance after the auction and tournament begin."}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="communication">
            <div className="space-y-6">
              {/* Original Communication Content */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Tabs defaultValue="league-chat" className="h-full">
                    <TabsList className="grid w-full grid-cols-3 mb-4">
                      <TabsTrigger value="league-chat">League Chat</TabsTrigger>
                      <TabsTrigger value="squad-chat">Squad Chat</TabsTrigger>
                      <TabsTrigger value="direct-messages">Direct Messages</TabsTrigger>
                    </TabsList>

                    <TabsContent value="league-chat">
                      <LeagueChat
                        leagueId={league.id.toString()}
                        currentUserId={currentUserId}
                        currentUserName="You"
                        isCommissioner={league.createdBy === "1"}
                      />
                    </TabsContent>

                    <TabsContent value="squad-chat">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Squad Chat - Your Squad
                          </CardTitle>
                          <CardDescription>Private chat with your squad members only</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4 mb-4">
                            <div className="p-3 rounded-lg border bg-muted/50 mr-8">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium text-sm">Sarah Miller</span>
                                <span className="text-xs text-muted-foreground">2h ago</span>
                              </div>
                              <p className="text-sm">
                                Great job on getting those Duke players! Our squad is looking strong 💪
                              </p>
                            </div>

                            <div className="p-3 rounded-lg border bg-primary/10 border-primary/20 ml-8">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium text-sm">You</span>
                                <span className="text-xs text-muted-foreground">1h ago</span>
                              </div>
                              <p className="text-sm">
                                Thanks! I think we have a real shot at winning this thing. How are your teams doing?
                              </p>
                            </div>

                            <div className="p-3 rounded-lg border bg-muted/50 mr-8">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium text-sm">Mike Rodriguez</span>
                                <span className="text-xs text-muted-foreground">30m ago</span>
                              </div>
                              <p className="text-sm">
                                Yeah, we're doing alright. Just trying to stay alive in this bracket!
                              </p>
                            </div>
                          </div>
                          <div className="border rounded-md p-4 bg-secondary/10">
                            <Label htmlFor="comment">Write a message</Label>
                            <Textarea id="comment" placeholder="Type your message here." rows={4} className="mt-2" />
                            <Button className="w-full mt-4">Send Message</Button>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="direct-messages">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <MessageCircle className="h-5 w-5" />
                            Direct Messages
                          </CardTitle>
                          <CardDescription>Send private messages to other league members</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-1">
                              <div className="space-y-2">
                                <Label htmlFor="user-select">Select User</Label>
                                <Select value={selectedUser} onValueChange={setSelectedUser}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Choose a league member" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {leagueMembers
                                      .filter((member) => member.id !== currentUserId)
                                      .map((member) => (
                                        <SelectItem key={member.id} value={member.id}>
                                          {member.name}
                                        </SelectItem>
                                      ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            <div className="lg:col-span-2">
                              {selectedUser ? (
                                <div className="space-y-4">
                                  <div className="border rounded-lg p-4 h-64 overflow-y-auto bg-muted/20">
                                    {directMessages.length > 0 ? (
                                      <div className="space-y-3">
                                        {directMessages.map((message) => (
                                          <div
                                            key={message.id}
                                            className={`p-3 rounded-lg max-w-xs ${
                                              message.senderId === currentUserId
                                                ? "bg-primary text-primary-foreground ml-auto"
                                                : "bg-muted mr-auto"
                                            }`}
                                          >
                                            <p className="text-sm">{message.message}</p>
                                            <p className="text-xs opacity-70 mt-1">
                                              {new Date(message.timestamp).toLocaleTimeString()}
                                            </p>
                                          </div>
                                        ))}
                                      </div>
                                    ) : (
                                      <div className="flex items-center justify-center h-full text-muted-foreground">
                                        <p>No messages yet. Start a conversation!</p>
                                      </div>
                                    )}
                                  </div>

                                  <div className="flex gap-2">
                                    <Input
                                      placeholder="Type your message..."
                                      value={directMessage}
                                      onChange={(e) => setDirectMessage(e.target.value)}
                                      onKeyPress={(e) => e.key === "Enter" && handleSendDirectMessage()}
                                    />
                                    <Button onClick={handleSendDirectMessage} disabled={!directMessage.trim()}>
                                      Send
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-center justify-center h-64 text-muted-foreground border rounded-lg bg-muted/20">
                                  <p>Select a user to start messaging</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>
                <div className="hidden lg:block">
                  <Card>
                    <CardHeader>
                      <CardTitle>Squad Members</CardTitle>
                      <CardDescription>Current members of your squad</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="h-8 w-8 rounded-full bg-muted" />
                            <span className="font-medium">You</span>
                          </div>
                          <Badge variant="secondary">Owner</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="h-8 w-8 rounded-full bg-muted" />
                            <span className="font-medium">Sarah Miller</span>
                          </div>
                          <Badge variant="outline">Member</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="h-8 w-8 rounded-full bg-muted" />
                            <span className="font-medium">Mike Rodriguez</span>
                          </div>
                          <Badge variant="outline">Member</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        {/* Leave League Confirmation Dialog */}
        <Dialog open={showLeaveConfirmation} onOpenChange={setShowLeaveConfirmation}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Leave League</DialogTitle>
              <DialogDescription>
                Are you sure you want to leave "{league.name}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowLeaveConfirmation(false)}>
                No, Stay in League
              </Button>
              <Button onClick={handleLeaveLeague} className="bg-red-600 hover:bg-red-700 text-white">
                Yes, Leave League
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
