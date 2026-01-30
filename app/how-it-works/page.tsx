"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { CreateLeagueModal } from "@/components/create-league-modal"
import { JoinLeagueModal } from "@/components/join-league-modal"
import { AuthModal } from "@/components/auth-modal"
import { useAuth } from "@/components/auth-provider"
import {
  Trophy,
  Users,
  DollarSign,
  Calendar,
  Target,
  Crown,
  CheckCircle,
  ArrowRight,
  Gavel,
  MessageSquare,
  BarChart3,
} from "lucide-react"

export default function HowItWorksPage() {
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authModalTab, setAuthModalTab] = useState<"login" | "signup">("login")
  const { user } = useAuth()

  const handleCreateLeagueClick = () => {
    if (!user) {
      setAuthModalTab("signup")
      setAuthModalOpen(true)
    }
  }

  const handleJoinLeagueClick = () => {
    if (!user) {
      setAuthModalTab("login")
      setAuthModalOpen(true)
    }
  }

  const steps = [
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Create or Join a League",
      description:
        "Start by creating your own league or joining an existing one. Set your entry fee, tournament, and auction date.",
      details: [
        "Choose from popular tournaments like March Madness, World Cup, or The Masters",
        "Set entry fees from $0 to $1000+",
        "Invite friends or join public leagues",
        "Customize league settings and rules",
      ],
    },
    {
      icon: <Gavel className="h-8 w-8 text-primary" />,
      title: "Participate in the Auction",
      description:
        "Bid on teams in a live auction format. The highest bidder wins each team and adds it to their portfolio.",
      details: [
        "Real-time bidding with other league members",
        "Strategic team selection based on tournament odds",
        "Budget management across multiple teams",
        "Live chat during auctions for trash talk and strategy",
      ],
    },
    {
      icon: <Trophy className="h-8 w-8 text-primary" />,
      title: "Watch Your Teams Compete",
      description:
        "Follow the tournament and track your teams' performance. Earn points based on how far your teams advance.",
      details: [
        "Real-time tournament bracket updates",
        "Point scoring based on tournament advancement",
        "Live leaderboards and standings",
        "Team performance analytics and insights",
      ],
    },
    {
      icon: <Crown className="h-8 w-8 text-primary" />,
      title: "Win the Prize Pool",
      description: "The league member with the most points at the end of the tournament wins the entire prize pool!",
      details: [
        "Winner takes all prize structure",
        "Automatic payout processing",
        "League history and achievement tracking",
        "Bragging rights for the year!",
      ],
    },
  ]

  const features = [
    {
      icon: <Calendar className="h-6 w-6" />,
      title: "Flexible Scheduling",
      description: "Set auction dates that work for your group",
    },
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: "League Chat",
      description: "Built-in messaging for strategy and trash talk",
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Live Analytics",
      description: "Real-time stats and performance tracking",
    },
    {
      icon: <DollarSign className="h-6 w-6" />,
      title: "Secure Payments",
      description: "Safe and automated prize pool management",
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "Multiple Tournaments",
      description: "Support for various sports and competitions",
    },
    {
      icon: <CheckCircle className="h-6 w-6" />,
      title: "Easy Setup",
      description: "Get your league running in minutes",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Navigation />

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            How It Works
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Fantasy Sports Made Simple
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Experience the thrill of Calcutta-style fantasy sports. Bid on teams, watch tournaments unfold, and compete
            for the entire prize pool in this winner-takes-all format.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <>
                <CreateLeagueModal>
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white"
                  >
                    Create League
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CreateLeagueModal>
                <JoinLeagueModal>
                  <Button size="lg" variant="outline">
                    Join Existing League
                  </Button>
                </JoinLeagueModal>
              </>
            ) : (
              <>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white"
                  onClick={handleCreateLeagueClick}
                >
                  Create League
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" onClick={handleJoinLeagueClick}>
                  Join Existing League
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Steps Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Four Simple Steps to Victory</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <Card
                key={index}
                className="relative overflow-hidden group hover:shadow-lg hover:shadow-primary/20 hover:scale-105 hover:bg-primary/5 hover:border-primary/30 transition-all duration-300 cursor-pointer"
              >
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 rounded-full bg-primary/10 w-fit">{step.icon}</div>
                  <Badge variant="outline" className="w-fit mx-auto mb-2">
                    Step {index + 1}
                  </Badge>
                  <CardTitle className="text-xl">{step.title}</CardTitle>
                  <CardDescription className="text-center">{step.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {step.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-start text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Calcutta Fantasy?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <div className="p-2 rounded-lg bg-primary/10 mr-3">{feature.icon}</div>
                  <h3 className="font-semibold">{feature.title}</h3>
                </div>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="p-8 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
            <CardContent className="space-y-6">
              <h2 className="text-3xl font-bold">Ready to Start Your League?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Join thousands of fantasy sports fans who have discovered the excitement of Calcutta-style tournaments.
                Create your league today and experience fantasy sports like never before.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {user ? (
                  <>
                    <CreateLeagueModal>
                      <Button
                        size="lg"
                        className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white"
                      >
                        Create Your League Now
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CreateLeagueModal>
                    <JoinLeagueModal>
                      <Button size="lg" variant="outline">
                        Browse Public Leagues
                      </Button>
                    </JoinLeagueModal>
                  </>
                ) : (
                  <>
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white"
                      onClick={handleCreateLeagueClick}
                    >
                      Create Your League Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button size="lg" variant="outline" onClick={handleJoinLeagueClick}>
                      Browse Public Leagues
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} defaultTab={authModalTab} />
    </div>
  )
}
