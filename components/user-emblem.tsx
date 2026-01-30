"use client"

import { Shield, Crown, Trophy, Star, Flag, Target, Medal, Anchor } from "lucide-react"

interface UserEmblemProps {
  userId: string
  className?: string
}

export function UserEmblem({ userId, className = "h-4 w-4" }: UserEmblemProps) {
  const getUserEmblem = (id: string): string | null => {
    if (typeof window === "undefined") return null

    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const user = users.find((u: any) => u.id === id)
    return user?.emblem || null
  }

  const emblem = getUserEmblem(userId)

  const getEmblemIcon = (emblemValue: string | null) => {
    switch (emblemValue) {
      case "shield":
        return <Shield className={className} />
      case "crown":
        return <Crown className={className} />
      case "trophy":
        return <Trophy className={className} />
      case "star":
        return <Star className={className} />
      case "flag":
        return <Flag className={className} />
      case "target":
        return <Target className={className} />
      case "medal":
        return <Medal className={className} />
      case "anchor":
        return <Anchor className={className} />
      default:
        return null
    }
  }

  return <>{getEmblemIcon(emblem)}</>
}
