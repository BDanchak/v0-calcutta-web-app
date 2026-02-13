"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { CreateLeagueModal } from "@/components/create-league-modal"
import { JoinLeagueModal } from "@/components/join-league-modal"
import { AnimatedSportsBalls } from "@/components/animated-sports-balls"
import { Trophy, Users, DollarSign, Zap, Target, Calendar } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { leagueStore } from "@/lib/league-store"

const features = [
  {
    icon: Trophy,
    title: "March Madness Auctions",
    description: "Bid on your favorite college basketball teams in live auctions with friends and family.",
  },
  {
    icon: Users,
    title: "Private Leagues",
    description: "Create custom leagues with your own rules, entry fees, and payout structures.",
  },
  {
    icon: DollarSign,
    // Updated title to indicate real money prizes are coming soon
    title: "Real Money Prizes Coming Soon!!",
    description: "Win real money based on how well your teams perform in the tournament.",
  },
  {
    icon: Zap,
    title: "Live Bidding",
    description: "Experience the thrill of real-time auctions with live chat and instant updates.",
  },
]

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "League Commissioner",
    content: "The most exciting way to experience March Madness! Our office league has never been more competitive.",
    avatar: "SJ",
  },
  {
    name: "Mike Rodriguez",
    role: "Fantasy Sports Enthusiast",
    content:
      "Finally, a fantasy platform that captures the real excitement of sports betting. Love the auction format!",
    avatar: "MR",
  },
  {
    name: "Lisa Chen",
    role: "College Basketball Fan",
    content: "Easy to use and so much fun. The live auctions get everyone involved and create amazing memories.",
    avatar: "LC",
  },
]

const tournaments = [
  {
    name: "March Madness",
    sport: "College Basketball",
    date: "March 17 - April 8, 2026",
    description: "The ultimate college basketball tournament with 68 teams competing for the championship.",
  },
  {
    name: "NBA Playoffs",
    sport: "Professional Basketball",
    date: "April 15 - June 15, 2026",
    description: "The most exciting professional basketball playoffs with the best teams in the league.",
  },
  {
    name: "World Cup",
    sport: "Soccer",
    date: "June 14 - July 15, 2026",
    description: "The world's most prestigious soccer tournament featuring 32 national teams.",
  },
  {
    name: "NFL Playoffs",
    sport: "American Football",
    date: "January 6 - February 11, 2026",
    description: "The ultimate American football championship tournament leading to the Super Bowl.",
  },
  {
    name: "Masters Golf Tournament",
    sport: "Professional Golf",
    date: "April 9 - April 12, 2026",
    description: "The most prestigious golf tournament featuring the world's best golfers at Augusta National.",
  },
  {
    name: "NHL Playoffs",
    sport: "Professional Hockey",
    date: "April 20 - June 20, 2026",
    description: "The most exciting professional hockey playoffs leading to the Stanley Cup Finals.",
  },
]

export default function HomePage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [currentTournament, setCurrentTournament] = useState(0)
  const [leagueCount, setLeagueCount] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTournament((prev) => (prev + 1) % tournaments.length)
    }, 3500)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const updateLeagueCount = () => {
      const totalLeagues = leagueStore.getState().leagues.length
      setLeagueCount(totalLeagues)
    }

    updateLeagueCount()
    const interval = setInterval(updateLeagueCount, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <AnimatedSportsBalls />

      <Navigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-accent/5 to-background">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="relative">
                {/* Replaced .jpg logo with new transparent background .png logo per user request */}
                {/* Decreased height by 250% (720/2.5=288px) and increased width by 250% (auto->720px) per user request */}
                <img src="/images/calcutta-fantasy-logo-transparent.png" alt="Calcutta Fantasy" className="h-[288px] w-[720px] object-contain" />
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
              The Ultimate{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent animate-glimmer">
                March Madness
              </span>{" "}
              Experience
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              Join the most exciting fantasy sports platform where you bid on real college basketball teams in live
              auctions. Experience the thrill of March Madness like never before.
            </p>
            <div className="mt-6 flex items-center justify-center">
              <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-full px-6 py-3 border border-primary/20">
                <p className="text-lg font-semibold text-foreground">
                  <span className="text-primary font-bold">{leagueCount}</span> leagues created and counting!
                </p>
              </div>
            </div>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <CreateLeagueModal>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white px-8 py-3 text-lg"
                >
                  Create League
                </Button>
              </CreateLeagueModal>
              <JoinLeagueModal>
                <Button variant="outline" size="lg" className="px-8 py-3 text-lg bg-transparent">
                  Join League
                </Button>
              </JoinLeagueModal>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Why Choose Calcutta Fantasy?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Experience fantasy sports the way they were meant to be played
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="mx-auto w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mb-4">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Tournaments Section */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Available Tournaments</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Choose from exciting sports tournaments throughout the year
            </p>
          </div>
          <div className="relative max-w-6xl mx-auto">
            <div className="overflow-visible">
              <div className="flex items-center justify-center gap-8">
                {tournaments.map((tournament, index) => {
                  const leftIndex = (currentTournament - 1 + tournaments.length) % tournaments.length
                  const rightIndex = (currentTournament + 1) % tournaments.length

                  const isCenter = index === currentTournament
                  const isLeft = index === leftIndex
                  const isRight = index === rightIndex
                  const isVisible = isCenter || isLeft || isRight

                  if (!isVisible) return null

                  return (
                    <div
                      key={index}
                      className={`transition-all duration-700 ease-in-out ${
                        isCenter ? "scale-100 blur-0 z-10" : "scale-90 blur-sm z-5"
                      }`}
                      style={{
                        transform: isCenter ? "scale(1)" : "scale(0.9)",
                        filter: isCenter ? "blur(0px)" : "blur(3px)",
                      }}
                    >
                      <Card className="border border-white/20 rounded-lg shadow-lg w-80">
                        <CardContent className="p-8">
                          <div className="text-center">
                            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mb-4">
                              <Calendar className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2 text-foreground">{tournament.name}</h3>
                            <p className="text-lg text-primary font-semibold mb-2">{tournament.sport}</p>
                            <p className="text-muted-foreground font-medium mb-4">{tournament.date}</p>
                            <p className="text-muted-foreground">{tournament.description}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="flex justify-center mt-6 space-x-2">
              {tournaments.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentTournament ? "bg-primary" : "bg-muted"
                  }`}
                  onClick={() => setCurrentTournament(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">How It Works</h2>
            <p className="mt-4 text-lg text-muted-foreground">Get started in just a few simple steps</p>
          </div>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Create or Join a League</h3>
              <p className="text-muted-foreground">
                Start your own league with custom rules or join an existing one with friends and family.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Participate in Live Auction</h3>
              <p className="text-muted-foreground">
                Bid on your favorite college basketball teams in real-time with live chat and instant updates.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Win Real Money</h3>
              <p className="text-muted-foreground">
                Earn points as your teams advance through the tournament and win cash prizes based on performance.
              </p>
            </div>
          </div>
          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg">
              <Link href="/how-it-works">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">What Players Say</h2>
            <p className="mt-4 text-lg text-muted-foreground">Join thousands of satisfied fantasy sports enthusiasts</p>
          </div>
          <div className="relative max-w-6xl mx-auto">
            <div className="overflow-visible">
              <div className="flex items-center justify-center gap-8">
                {testimonials.map((testimonial, index) => {
                  const isCenter = index === currentTestimonial
                  const distance = Math.abs(index - currentTestimonial)
                  const minDistance = Math.min(distance, testimonials.length - distance)
                  const isVisible = minDistance <= 1

                  return (
                    <div
                      key={index}
                      className={`transition-all duration-500 ${isVisible ? "opacity-100" : "opacity-0"} ${
                        isCenter ? "scale-100 blur-0 z-10" : "scale-90 blur-sm z-0"
                      } ${isVisible ? "block" : "hidden"}`}
                      style={{
                        transform: isCenter ? "scale(1)" : "scale(0.9)",
                        filter: isCenter ? "blur(0px)" : "blur(2px)",
                      }}
                    >
                      <Card className="border-0 shadow-lg w-80">
                        <CardContent className="p-8">
                          <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center text-white font-bold mr-4">
                              {testimonial.avatar}
                            </div>
                            <div>
                              <div className="font-semibold">{testimonial.name}</div>
                              <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                            </div>
                          </div>
                          <p className="text-muted-foreground italic text-center">"{testimonial.content}"</p>
                        </CardContent>
                      </Card>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="flex justify-center mt-6 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentTestimonial ? "bg-primary" : "bg-muted"
                  }`}
                  onClick={() => setCurrentTestimonial(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-6">
            Ready to Experience the Thrill?
          </h2>
          <p className="text-lg text-muted-foreground mb-10">
            Join thousands of players who have discovered the most exciting way to enjoy March Madness.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <CreateLeagueModal>
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white px-8 py-3 text-lg"
              >
                {/* Replaced .jpg logo with new transparent background .png logo per user request */}
                <img src="/images/calcutta-fantasy-logo-transparent.png" alt="" className="h-5 w-auto mr-2" />
                Create Your League
              </Button>
            </CreateLeagueModal>
            <JoinLeagueModal>
              <Button variant="outline" size="lg" className="px-8 py-3 text-lg bg-transparent">
                <Target className="h-5 w-5 mr-2" />
                Join Existing League
              </Button>
            </JoinLeagueModal>
          </div>
        </div>
      </section>
    </div>
  )
}
