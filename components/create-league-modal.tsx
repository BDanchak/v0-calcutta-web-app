"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth-provider"
import { leagueStore } from "@/lib/league-store"
import { sendEmail, generateLeagueInviteEmail } from "@/lib/email-service"
import {
  ChevronDown,
  ChevronUp,
  Plus,
  Trophy,
  Users,
  DollarSign,
  Calendar,
  Settings,
  Eye,
  EyeOff,
  Mail,
  X,
} from "lucide-react"

interface CreateLeagueModalProps {
  children?: React.ReactNode
  onLeagueCreated?: () => void
}

export function CreateLeagueModal({ children, onLeagueCreated }: CreateLeagueModalProps) {
  const [open, setOpen] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [emailInvites, setEmailInvites] = useState<string[]>([])
  const [newEmail, setNewEmail] = useState("")
  const { toast } = useToast()
  const { user } = useAuth()

  // Removed all tournament dates except NFL Playoffs 2025 per user request
  const tournamentDates: { [key: string]: Date } = {
    "nfl-playoffs-2025": new Date("2025-01-11"),
    // Added Survivor 50 tournament date (premieres Feb 25, 2026) per user request
    "survivor-50": new Date("2026-02-25"),
  }

  const getClosestUpcomingTournament = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    let closestTournament = ""
    let closestDiff = Number.POSITIVE_INFINITY

    Object.entries(tournamentDates).forEach(([id, date]) => {
      const diff = date.getTime() - today.getTime()
      if (diff >= 0 && diff < closestDiff) {
        closestDiff = diff
        closestTournament = id
      }
    })

    // Updated fallback to NFL Playoffs 2025 since march-madness-2025 was removed
    return closestTournament || "nfl-playoffs-2025"
  }

  // Removed all tournament options except NFL Playoffs 2025 per user request
  const tournaments = [
    {
      id: "nfl-playoffs-2025",
      name: "NFL Playoffs 2025",
      description: "National Football League Playoffs",
      date: "January 11 - February 9, 2025",
    },
    // Added Survivor Season 50 tournament with all 24 returning contestants per user request
    {
      id: "survivor-50",
      name: "Survivor 50",
      description: "Survivor Season 50 - Returning All-Stars (24 Contestants)",
      date: "February 25, 2026",
    },
  ]

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    tournament: getClosestUpcomingTournament(),
    maxMembers: "8",
    entryFee: "25",
    auctionDate: "",
    auctionTime: "19:00",
    isPublic: false,
    customInviteCode: "",
    enableSpendingLimit: false,
    spendingLimit: "500",
    secondsPerTeam: "30",
    secondsBetweenTeams: "10",
    secondsAfterBid: "5",
    showUpcomingTeams: true,
    teamOrder: "seed-order",
    budgetsVisible: true,
    enableSquads: false,
    numberOfSquads: "2",
  })

  const now = new Date()
  const plusOneMinute = new Date(now.getTime() + 60_000)
  const pad = (n: number) => n.toString().padStart(2, "0")
  const isSelectedToday =
    formData.auctionDate && new Date(formData.auctionDate).toDateString() === new Date().toDateString()
  const minTimeForToday = `${pad(plusOneMinute.getHours())}:${pad(plusOneMinute.getMinutes())}`
  const minDateLocal = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`

  const handleInputChange = (field: string, value: string | boolean | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const addEmailInvite = () => {
    if (newEmail && newEmail.includes("@") && !emailInvites.includes(newEmail)) {
      setEmailInvites([...emailInvites, newEmail])
      setNewEmail("")
    }
  }

  const removeEmailInvite = (email: string) => {
    setEmailInvites(emailInvites.filter((e) => e !== email))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addEmailInvite()
    }
  }

  const sendInviteEmails = async (league: any) => {
    if (emailInvites.length === 0) return

    const selectedTournament = tournaments.find((t) => t.id === formData.tournament)
    if (!selectedTournament || !user) return

    let successCount = 0

    for (const email of emailInvites) {
      try {
        const emailData = generateLeagueInviteEmail(
          user.name,
          league.name,
          league.description || `Join us for ${selectedTournament.name}!`,
          league.inviteCode,
          email,
        )

        const sent = await sendEmail(emailData)
        if (sent) successCount++
      } catch (error) {
        console.error(`Failed to send invite to ${email}:`, error)
      }
    }

    if (successCount > 0) {
      toast({
        title: "Invites Sent!",
        description: `Successfully sent ${successCount} email invitation${successCount > 1 ? "s" : ""}.`,
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to create a league.",
        variant: "destructive",
      })
      return
    }

    if (!formData.name || !formData.tournament || !formData.auctionDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    const selectedTournament = tournaments.find((t) => t.id === formData.tournament)
    if (!selectedTournament) {
      toast({
        title: "Invalid Tournament",
        description: "Please select a valid tournament.",
        variant: "destructive",
      })
      return
    }

    const [year, month, day] = formData.auctionDate.split("-").map((v) => Number.parseInt(v, 10))
    const [hours, minutes] = formData.auctionTime.split(":").map((v) => Number.parseInt(v, 10))
    const selectedStartLocal = new Date(year, month - 1, day, hours, minutes)
    const nowPlusOneMinute = new Date(Date.now() + 60_000)

    if (selectedStartLocal.getTime() < nowPlusOneMinute.getTime()) {
      toast({
        title: "Invalid Auction Time",
        description: "Auction start must be at least 1 minute from the current time.",
        variant: "destructive",
      })
      return
    }

    try {
      const newLeague = leagueStore.getState().createLeague({
        name: formData.name,
        description: formData.description,
        tournament: formData.tournament,
        tournamentName: selectedTournament.name,
        maxMembers: Number.parseInt(formData.maxMembers),
        entryFee: Number.parseFloat(formData.entryFee),
        auctionDate: formData.auctionDate,
        auctionTime: formData.auctionTime,
        isPublic: formData.isPublic,
        createdBy: user.id,
        customInviteCode: formData.customInviteCode,
        enableSpendingLimit: formData.enableSpendingLimit,
        spendingLimit: formData.enableSpendingLimit ? Number.parseFloat(formData.spendingLimit) : undefined,
        secondsPerTeam: Number.parseInt(formData.secondsPerTeam),
        secondsBetweenTeams: Number.parseInt(formData.secondsBetweenTeams),
        secondsAfterBid: Number.parseInt(formData.secondsAfterBid),
        showUpcomingTeams: formData.showUpcomingTeams,
        teamOrder: formData.teamOrder,
        budgetsVisible: formData.budgetsVisible,
        enableSquads: formData.enableSquads,
        numberOfSquads: formData.enableSquads ? Number.parseInt(formData.numberOfSquads) : undefined,
      })

      await sendInviteEmails(newLeague)

      toast({
        title: "League Created!",
        description: `"${newLeague.name}" has been created successfully. Invite code: ${newLeague.inviteCode}`,
      })

      setOpen(false)
      setFormData({
        name: "",
        description: "",
        tournament: getClosestUpcomingTournament(),
        maxMembers: "8",
        entryFee: "25",
        auctionDate: "",
        auctionTime: "19:00",
        isPublic: false,
        customInviteCode: "",
        enableSpendingLimit: false,
        spendingLimit: "500",
        secondsPerTeam: "30",
        secondsBetweenTeams: "10",
        secondsAfterBid: "5",
        showUpcomingTeams: true,
        teamOrder: "seed-order",
        budgetsVisible: true,
        enableSquads: false,
        numberOfSquads: "2",
      })
      setEmailInvites([])
      setNewEmail("")

      if (onLeagueCreated) {
        onLeagueCreated()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create league. Please try again.",
        variant: "destructive",
      })
    }
  }

  const toggleAdvanced = (e: React.MouseEvent) => {
    e.preventDefault()
    setShowAdvanced(!showAdvanced)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-primary" />
            Create New League
          </DialogTitle>
          <DialogDescription>Set up your fantasy sports league and invite friends to compete!</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">League Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter league name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tournament">Tournament *</Label>
                <Select value={formData.tournament} onValueChange={(value) => handleInputChange("tournament", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tournament" />
                  </SelectTrigger>
                  <SelectContent>
                    {tournaments.map((tournament) => (
                      <SelectItem key={tournament.id} value={tournament.id}>
                        <div>
                          <div className="font-medium">
                            {tournament.name} - {tournament.date}
                          </div>
                          <div className="text-sm text-muted-foreground">{tournament.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your league (optional)"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <Label>Email Invites (Optional)</Label>
              </div>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter email address"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    onKeyPress={handleKeyPress}
                    type="email"
                  />
                  <Button type="button" onClick={addEmailInvite} variant="outline" size="sm">
                    Add
                  </Button>
                </div>
                {emailInvites.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {emailInvites.map((email) => (
                      <div key={email} className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md text-sm">
                        <span>{email}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeEmailInvite(email)}
                          className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  Add email addresses to automatically send league invitations when the league is created.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maxMembers">Max Members</Label>
                <Select value={formData.maxMembers} onValueChange={(value) => handleInputChange("maxMembers", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[4, 6, 8, 10, 12, 16, 20, 24, 32].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} members
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="entryFee">Entry Fee ($)</Label>
                <Input
                  id="entryFee"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="25.00"
                  value={formData.entryFee}
                  onChange={(e) => handleInputChange("entryFee", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customInviteCode">Custom Invite Code</Label>
                <Input
                  id="customInviteCode"
                  placeholder="Optional"
                  value={formData.customInviteCode}
                  onChange={(e) => handleInputChange("customInviteCode", e.target.value.toUpperCase())}
                  maxLength={8}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="auctionDate">Auction Date *</Label>
                <Input
                  id="auctionDate"
                  type="date"
                  value={formData.auctionDate}
                  onChange={(e) => handleInputChange("auctionDate", e.target.value)}
                  min={minDateLocal}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="auctionTime">Auction Time</Label>
                <Input
                  id="auctionTime"
                  type="time"
                  value={formData.auctionTime}
                  onChange={(e) => handleInputChange("auctionTime", e.target.value)}
                  min={isSelectedToday ? minTimeForToday : undefined}
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <Label htmlFor="isPublic" className="font-medium">
                    Public League
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {formData.isPublic
                      ? "Anyone can find and join your league"
                      : "Only people with the invite code can join"}
                  </p>
                </div>
              </div>
              <Switch
                id="isPublic"
                checked={formData.isPublic}
                onCheckedChange={(checked) => handleInputChange("isPublic", checked)}
              />
            </div>
          </div>

          {/* Advanced Settings */}
          <div className="border-t pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={toggleAdvanced}
              className="flex items-center justify-between w-full p-4 hover:bg-muted/50"
            >
              <div className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span className="font-medium">Advanced Settings</span>
              </div>
              {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>

            {showAdvanced && (
              <div className="space-y-6 pt-4">
                {/* Spending Limit */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <DollarSign className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <Label htmlFor="enableSpendingLimit" className="font-medium">
                          Enable Spending Limit
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Set a maximum amount each player can spend during the auction
                        </p>
                      </div>
                    </div>
                    <Switch
                      id="enableSpendingLimit"
                      checked={formData.enableSpendingLimit}
                      onCheckedChange={(checked) => handleInputChange("enableSpendingLimit", checked)}
                    />
                  </div>

                  {formData.enableSpendingLimit && (
                    <div className="space-y-2 ml-8">
                      <Label htmlFor="spendingLimit">Spending Limit ($)</Label>
                      <div className="space-y-2">
                        <Slider
                          value={[Number.parseFloat(formData.spendingLimit)]}
                          onValueChange={(value) => handleInputChange("spendingLimit", value[0].toString())}
                          max={2000}
                          min={100}
                          step={50}
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>$100</span>
                          <span className="font-medium">${formData.spendingLimit}</span>
                          <span>$2000</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Budget Visibility */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {formData.budgetsVisible ? (
                      <Eye className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <EyeOff className="h-5 w-5 text-muted-foreground" />
                    )}
                    <div>
                      <Label htmlFor="budgetsVisible" className="font-medium">
                        Show Participants
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {formData.budgetsVisible
                          ? "Display the Participants section showing all players and their remaining budgets during the auction"
                          : "Hide the Participants section from the auction interface"}
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="budgetsVisible"
                    checked={formData.budgetsVisible}
                    onCheckedChange={(checked) => handleInputChange("budgetsVisible", checked)}
                  />
                </div>

                {/* Squad System Settings */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Users className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <Label htmlFor="enableSquads" className="font-medium">
                          Enable Squad System
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {formData.enableSquads
                            ? "Users will be grouped into squads and participate in auctions together, sharing ownership of teams"
                            : "Each user will own their individual teams from the auction"}
                        </p>
                      </div>
                    </div>
                    <Switch
                      id="enableSquads"
                      checked={formData.enableSquads}
                      onCheckedChange={(checked) => handleInputChange("enableSquads", checked)}
                    />
                  </div>

                  {formData.enableSquads && (
                    <div className="space-y-2 ml-8">
                      <Label htmlFor="numberOfSquads">Number of Squads</Label>
                      <Select
                        value={formData.numberOfSquads}
                        onValueChange={(value) => handleInputChange("numberOfSquads", value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[2, 3, 4, 6, 8].map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} squads
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        Users will be evenly distributed across squads. Each squad will participate in the auction
                        together and share ownership of won teams.
                      </p>
                    </div>
                  )}
                </div>

                {/* Auction Timing */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <h4 className="font-medium">Auction Timing</h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="secondsPerTeam">Seconds per Team</Label>
                      <Select
                        value={formData.secondsPerTeam}
                        onValueChange={(value) => handleInputChange("secondsPerTeam", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[15, 20, 30, 45, 60, 90, 120].map((seconds) => (
                            <SelectItem key={seconds} value={seconds.toString()}>
                              {seconds} seconds
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="secondsBetweenTeams">Seconds Between Teams</Label>
                      <Select
                        value={formData.secondsBetweenTeams}
                        onValueChange={(value) => handleInputChange("secondsBetweenTeams", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[2, 5, 10, 15, 20, 30].map((seconds) => (
                            <SelectItem key={seconds} value={seconds.toString()}>
                              {seconds} seconds
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="secondsAfterBid">Seconds After Bid</Label>
                      <Select
                        value={formData.secondsAfterBid}
                        onValueChange={(value) => handleInputChange("secondsAfterBid", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[3, 5, 7, 10, 15].map((seconds) => (
                            <SelectItem key={seconds} value={seconds.toString()}>
                              {seconds} seconds
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Team Display Options */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label htmlFor="showUpcomingTeams" className="font-medium">
                        Show Upcoming Teams
                      </Label>
                      <p className="text-sm text-muted-foreground">Display the next few teams in the auction queue</p>
                    </div>
                    <Switch
                      id="showUpcomingTeams"
                      checked={formData.showUpcomingTeams}
                      onCheckedChange={(checked) => handleInputChange("showUpcomingTeams", checked)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Team Order</Label>
                    <RadioGroup
                      value={formData.teamOrder}
                      onValueChange={(value) => handleInputChange("teamOrder", value)}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      <div className="flex items-center space-x-2 p-3 border rounded-lg">
                        <RadioGroupItem value="seed-order" id="seed-order" />
                        <Label htmlFor="seed-order" className="flex-1 cursor-pointer">
                          <div className="font-medium">Seed Order</div>
                          <div className="text-sm text-muted-foreground">Teams ordered by tournament seeding</div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 border rounded-lg">
                        <RadioGroupItem value="random-order" id="random-order" />
                        <Label htmlFor="random-order" className="flex-1 cursor-pointer">
                          <div className="font-medium">Random Order</div>
                          <div className="text-sm text-muted-foreground">Teams in randomized order</div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create League
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateLeagueModal
