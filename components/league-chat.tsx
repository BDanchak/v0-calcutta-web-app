"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Send, MessageCircle, Megaphone, Crown } from "lucide-react"

interface Message {
  id: string
  userId: string
  userName: string
  content: string
  timestamp: Date
  type: "message" | "system" | "announcement"
}

interface LeagueChatProps {
  leagueId: string
  currentUserId: string
  currentUserName: string
  isCommissioner: boolean
}

export function LeagueChat({ leagueId, currentUserId, currentUserName, isCommissioner }: LeagueChatProps) {
  const { toast } = useToast()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [announcement, setAnnouncement] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Mock initial messages
  useEffect(() => {
    const initialMessages: Message[] = [
      {
        id: "1",
        userId: "system",
        userName: "System",
        content: "Welcome to the league chat! Use this space to communicate with other members.",
        timestamp: new Date(Date.now() - 86400000), // 1 day ago
        type: "system",
      },
      {
        id: "2",
        userId: "1",
        userName: "John D.",
        content: "Hey everyone! Looking forward to the auction tomorrow. Good luck!",
        timestamp: new Date(Date.now() - 43200000), // 12 hours ago
        type: "message",
      },
      {
        id: "3",
        userId: "2",
        userName: "Sarah M.",
        content: "Same here! I've been studying the teams all week. May the best bidder win! 🏀",
        timestamp: new Date(Date.now() - 21600000), // 6 hours ago
        type: "message",
      },
      {
        id: "4",
        userId: "commissioner",
        userName: "Commissioner",
        content: "Reminder: Auction starts at 7 PM EST tomorrow. Please be on time!",
        timestamp: new Date(Date.now() - 10800000), // 3 hours ago
        type: "announcement",
      },
    ]
    setMessages(initialMessages)
  }, [])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const message: Message = {
      id: Date.now().toString(),
      userId: currentUserId,
      userName: currentUserName,
      content: newMessage.trim(),
      timestamp: new Date(),
      type: "message",
    }

    setMessages((prev) => [...prev, message])
    setNewMessage("")

    toast({
      title: "Message sent",
      description: "Your message has been sent to the league.",
    })
  }

  const handleSendAnnouncement = () => {
    if (!announcement.trim()) return

    const message: Message = {
      id: Date.now().toString(),
      userId: currentUserId,
      userName: "Commissioner",
      content: announcement.trim(),
      timestamp: new Date(),
      type: "announcement",
    }

    setMessages((prev) => [...prev, message])
    setAnnouncement("")

    toast({
      title: "Announcement sent",
      description: "Your announcement has been sent to all league members.",
    })
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return date.toLocaleDateString()
  }

  const getMessageStyle = (message: Message) => {
    if (message.type === "system") {
      return "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
    }
    if (message.type === "announcement") {
      return "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800"
    }
    if (message.userId === currentUserId) {
      return "bg-primary/10 border-primary/20 ml-8"
    }
    return "bg-muted/50 mr-8"
  }

  return (
    <Tabs defaultValue="chat" className="h-full flex flex-col">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="chat" className="flex items-center gap-2">
          <MessageCircle className="h-4 w-4" />
          Chat
        </TabsTrigger>
        {isCommissioner && (
          <TabsTrigger value="announcements" className="flex items-center gap-2">
            <Megaphone className="h-4 w-4" />
            Announcements
          </TabsTrigger>
        )}
      </TabsList>

      <TabsContent value="chat" className="flex-1 flex flex-col">
        <Card className="flex-1 flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              League Chat
            </CardTitle>
            <CardDescription>Chat with your league members</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`p-3 rounded-lg border ${getMessageStyle(message)}`}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">
                          {message.userName}
                          {message.userId === currentUserId && " (You)"}
                        </span>
                        {message.type === "announcement" && (
                          <Badge variant="outline" className="text-xs">
                            <Crown className="h-3 w-3 mr-1" />
                            Commissioner
                          </Badge>
                        )}
                        {message.type === "system" && (
                          <Badge variant="outline" className="text-xs">
                            System
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">{formatTime(message.timestamp)}</span>
                    </div>
                    <p className="text-sm">{message.content}</p>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <div className="flex gap-2 mt-4">
              <Input
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {isCommissioner && (
        <TabsContent value="announcements" className="flex-1 flex flex-col">
          <Card className="flex-1 flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Megaphone className="h-5 w-5" />
                Commissioner Announcements
              </CardTitle>
              <CardDescription>Send important announcements to all league members</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <ScrollArea className="flex-1 pr-4">
                <div className="space-y-4">
                  {messages
                    .filter((m) => m.type === "announcement")
                    .map((message) => (
                      <div
                        key={message.id}
                        className="p-3 rounded-lg border bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{message.userName}</span>
                            <Badge variant="outline" className="text-xs">
                              <Crown className="h-3 w-3 mr-1" />
                              Commissioner
                            </Badge>
                          </div>
                          <span className="text-xs text-muted-foreground">{formatTime(message.timestamp)}</span>
                        </div>
                        <p className="text-sm">{message.content}</p>
                      </div>
                    ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              <div className="flex gap-2 mt-4">
                <Input
                  placeholder="Type your announcement..."
                  value={announcement}
                  onChange={(e) => setAnnouncement(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendAnnouncement()}
                  className="flex-1"
                />
                <Button onClick={handleSendAnnouncement} disabled={!announcement.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      )}
    </Tabs>
  )
}
