"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Navigation } from "@/components/navigation"

export default function FAQPage() {
  const faqs = [
    {
      question: "What is Calcutta Fantasy?",
      answer:
        "Calcutta Fantasy is a fantasy sports auction platform where you bid on real teams instead of individual players. You compete with friends by purchasing teams in tournaments like March Madness, World Cup, and more.",
    },
    {
      question: "How does the auction work?",
      answer:
        "In a Calcutta auction, all participants bid on teams in a tournament. The highest bidder wins that team. Your team's performance in the real tournament determines your fantasy points and potential winnings.",
    },
    {
      question: "How do I create a league?",
      answer:
        "You can create a league by clicking 'Create League' from the dashboard. Choose between Quick Setup for standard settings or Advanced Setup for custom configurations including entry fees, auction settings, and tournament selection.",
    },
    {
      question: "How do I join a league?",
      answer:
        "You can join public leagues from the 'Browse Leagues' tab, or join private leagues using an invitation code provided by the league commissioner.",
    },
    {
      question: "What tournaments are available?",
      answer:
        "We support various tournaments including March Madness, World Cup, The Masters, NBA Playoffs, NFL Playoffs, and more. New tournaments are added regularly.",
    },
    {
      question: "How are winnings calculated?",
      answer:
        "Winnings are based on your team's performance in the real tournament and the league's payout structure. The league commissioner sets the payout percentages when creating the league.",
    },
    {
      question: "Can I leave a league after joining?",
      answer:
        "You can leave a league before the auction starts. Once the auction begins, you cannot leave the league as it would affect the competitive balance.",
    },
    {
      question: "What happens if I miss the auction?",
      answer:
        "If you miss the live auction, you can set up auto-bidding preferences beforehand. The system will bid on your behalf based on your settings and available budget.",
    },
    {
      question: "How do I communicate with other league members?",
      answer:
        "Each league has built-in chat functionality where you can communicate with all league members. There's also a squad chat for private conversations with your team members.",
    },
    {
      question: "Is there a mobile app?",
      answer:
        "Currently, Calcutta Fantasy is available as a web application that works on all devices. A dedicated mobile app is in development.",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Frequently Asked Questions</h1>
          <p className="mt-4 text-lg text-muted-foreground">Find answers to common questions about Calcutta Fantasy</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Common Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            Still have questions?{" "}
            <a href="/contact" className="text-primary hover:underline">
              Contact our support team
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
