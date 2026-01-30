"use client"

import type React from "react"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth-provider"
import { leagueStore, type League } from "@/lib/league-store"
import { Users, DollarSign, Calendar, Clock, Trophy, Eye, MapPin, Star } from 'lucide-react'

interface LeagueOverviewModalProps {
  children: React.ReactNode
  league: League
  onLeagueJoined?: () => void
}

export function LeagueOverviewModal({ children, league, onLeagueJoined }: LeagueOverviewModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()
  const [isJoining, setIsJoining] = useState(false)

  const handleJoinLeague = async () => {
    if (!user) return

    setIsJoining(true)
    const success = leagueStore.getState().joinLeague(league.id, user.id)

    if (success) {
      toast({
        title: "League Joined!",
        description: `You have successfully joined "${league.name}".`,
      })
      setIsOpen(false)
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
    setIsJoining(false)
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

  const isUserMember = user && leagueStore.getState().isUserMember(league.id, user.id)
  const canJoin = league.members < league.maxMembers && !isUserMember

  return (
    <>
      <div onClick={() => setIsOpen(true)} className="cursor-pointer">
        {children}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Trophy className="h-6 w-6 mr-3 text-primary" />
                {league.name}
              </div>
              <Badge className={getStatusColor(league.status)}>{league.status}</Badge>
            </DialogTitle>
            <DialogDescription className="text-base">
              {league.description || "Get detailed information about this league"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Tournament Info */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Star className="h-5 w-5 mr-2 text-yellow-500" />
                  Tournament Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Tournament</p>
                    <p className="font-semibold">{league.tournamentName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">League Type</p>
                    <p className="font-semibold">{league.isPublic ? "Public" : "Private"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* League Stats */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Users className="h-5 w-5 mr-2 text-blue-500" />
                  League Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <p className="text-2xl font-bold">{league.members}</p>
                    <p className="text-xs text-muted-foreground">of {league.maxMembers} members</p>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <p className="text-2xl font-bold">${league.entryFee}</p>
                    <p className="text-xs text-muted-foreground">entry fee</p>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <Trophy className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <p className="text-2xl font-bold">${league.entryFee * league.members}</p>
                    <p className="text-xs text-muted-foreground">total prize pool</p>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <p className="text-2xl font-bold">{league.maxMembers - league.members}</p>
                    <p className="text-xs text-muted-foreground">spots left</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Auction Information */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-green-500" />
                  Auction Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Auction Date</p>
                      <p className="font-semibold">{league.auctionDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Auction Time</p>
                      <p className="font-semibold">{league.auctionTime}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* League Settings */}
            {(league.spendingLimit || league.teamOrder || league.showUpcomingTeams !== undefined) && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Eye className="h-5 w-5 mr-2 text-purple-500" />
                    League Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {league.spendingLimit && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Spending Limit</span>
                        <span className="font-semibold">${league.spendingLimit}</span>
                      </div>
                    )}
                    {league.teamOrder && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Team Order</span>
                        <span className="font-semibold capitalize">{league.teamOrder.replace("-", " ")}</span>
                      </div>
                    )}
                    {league.showUpcomingTeams !== undefined && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Upcoming Teams</span>
                        <span className="font-semibold">{league.showUpcomingTeams ? "Visible" : "Hidden"}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-2">
              <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
                Close
              </Button>
              {isUserMember ? (
                <Button className="flex-1" disabled>
                  Already Joined
                </Button>
              ) : canJoin ? (
                <Button
                  onClick={handleJoinLeague}
                  disabled={isJoining}
                  className="flex-1 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white"
                >
                  {isJoining ? "Joining..." : "Join League"}
                </Button>
              ) : (
                <Button className="flex-1" disabled>
                  League Full
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
