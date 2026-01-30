"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Trophy, DollarSign } from "lucide-react"

interface TournamentBracketModalProps {
  isOpen: boolean
  onClose: () => void
  tournamentData: any
  selectedTeam?: any
}

export function TournamentBracketModal({ isOpen, onClose, tournamentData, selectedTeam }: TournamentBracketModalProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "eliminated":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Trophy className="h-5 w-5" />
            <span>Tournament Bracket</span>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[70vh]">
          <div className="space-y-8">
            {/* Bracket Visualization */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {tournamentData.regions.map((region: any) => (
                <div key={region.name} className="space-y-4">
                  <h3 className="text-lg font-semibold text-center border-b pb-2">{region.name} Region</h3>
                  <div className="space-y-3">
                    {region.teams.map((team: any) => (
                      <div
                        key={team.id}
                        className={`p-4 rounded-lg border transition-all ${
                          selectedTeam?.id === team.id ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium bg-muted px-2 py-1 rounded">{team.seed}</span>
                            <span className="font-semibold">{team.name}</span>
                          </div>
                          <Badge className={getStatusColor(team.status)} variant="outline">
                            {team.status}
                          </Badge>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Owner:</span>
                            <span className="font-medium">{team.owner}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Price:</span>
                            <span className="font-medium flex items-center">
                              <DollarSign className="h-3 w-3 mr-1" />
                              {team.price}
                            </span>
                          </div>
                        </div>

                        {team.status === "active" && (
                          <div className="mt-3 p-2 bg-green-50 dark:bg-green-900/20 rounded text-xs text-green-700 dark:text-green-400">
                            Still competing
                          </div>
                        )}

                        {team.status === "eliminated" && (
                          <div className="mt-3 p-2 bg-red-50 dark:bg-red-900/20 rounded text-xs text-red-700 dark:text-red-400">
                            Eliminated
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Tournament Progress */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Tournament Progress</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {tournamentData.regions.reduce(
                      (count: number, region: any) =>
                        count + region.teams.filter((team: any) => team.status === "active").length,
                      0,
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">Teams Remaining</div>
                </div>

                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-accent">
                    {tournamentData.regions.reduce(
                      (count: number, region: any) =>
                        count + region.teams.filter((team: any) => team.status === "eliminated").length,
                      0,
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">Teams Eliminated</div>
                </div>

                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    $
                    {tournamentData.regions.reduce(
                      (sum: number, region: any) =>
                        sum + region.teams.reduce((regionSum: number, team: any) => regionSum + team.price, 0),
                      0,
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Auction Value</div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
