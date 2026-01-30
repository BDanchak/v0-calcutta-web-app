import { create } from "zustand"

export interface Squad {
  id: string
  name: string
  members: string[] // Array of user IDs
  totalSpent?: number
  totalTeams?: number
  totalWinnings?: number
}

export interface League {
  id: string
  name: string
  description: string
  tournament: string
  tournamentName: string
  status: "upcoming" | "active" | "completed"
  members: number
  maxMembers: number
  entryFee: number
  auctionDate: string
  auctionTime: string
  isPublic: boolean
  createdBy: string
  createdAt: string
  myPosition?: number
  myWinnings?: number
  nextAction: string
  spendingLimit?: number
  enableSpendingLimit?: boolean
  secondsPerTeam?: number
  secondsBetweenTeams?: number
  secondsAfterBid?: number
  showUpcomingTeams?: boolean
  teamOrder?: string
  inviteCode: string
  joinedMembers: string[] // Array of user IDs who have joined
  budgetsVisible?: boolean
  enableSquads?: boolean
  numberOfSquads?: number
  squads?: Squad[]
  auctionParticipants?: Record<
    string,
    {
      id: string
      name: string
      totalSpent: number
      teamsWon: number
      remainingBudget: number
    }
  >
}

export interface LeagueMessage {
  id: string
  leagueId: string
  userId: string
  userName: string
  message: string
  timestamp: string
  type: "message" | "system" | "announcement"
}

export interface DirectMessage {
  id: string
  leagueId: string
  senderId: string
  senderName: string
  receiverId: string
  receiverName: string
  message: string
  timestamp: string
}

export interface RecentActivity {
  id: string
  userId: string
  type: "league_created" | "league_joined" | "league_removed" | "win" | "bid"
  message: string
  timestamp: string
  earnings?: number
}

export interface TournamentTeam {
  id: number
  name: string
  seed: number
  region: string
}

interface LeagueStore {
  leagues: League[]
  messages: LeagueMessage[]
  directMessages: DirectMessage[]
  recentActivities: RecentActivity[]
  getUserLeagues: (userId: string) => League[]
  getLeague: (id: string) => League | undefined
  createLeague: (
    leagueData: Omit<League, "id" | "createdAt" | "inviteCode" | "joinedMembers" | "squads"> & {
      customInviteCode?: string
    },
  ) => League
  updateLeague: (id: string, updates: Partial<League>) => void
  deleteLeague: (id: string) => void
  getAllLeagues: () => League[]
  joinLeague: (leagueId: string, userId: string, inviteCode?: string) => boolean
  isUserMember: (leagueId: string, userId: string) => boolean
  removeUserFromLeague: (leagueId: string, userId: string) => void
  getLeagueMessages: (leagueId: string) => LeagueMessage[]
  sendMessage: (leagueId: string, userId: string, userName: string, messageText: string) => LeagueMessage
  sendAnnouncement: (leagueId: string, userId: string, userName: string, messageText: string) => LeagueMessage
  getDirectMessages: (leagueId: string, userId: string, otherUserId: string) => DirectMessage[]
  sendDirectMessage: (
    leagueId: string,
    senderId: string,
    senderName: string,
    receiverId: string,
    receiverName: string,
    messageText: string,
  ) => DirectMessage
  getUserRecentActivities: (userId: string) => RecentActivity[]
  addRecentActivity: (activity: Omit<RecentActivity, "id" | "timestamp">) => void
  getTournamentTeams: (tournamentId: string) => TournamentTeam[]
  getUserSquad: (leagueId: string, userId: string) => Squad | undefined
  assignUserToSquad: (leagueId: string, userId: string) => void
}

// Mock initial leagues
const initialLeagues: League[] = [
  {
    id: "1",
    name: "College Friends Forever",
    description: "Annual tournament with college buddies",
    tournament: "march-madness-2024",
    tournamentName: "March Madness 2024",
    status: "active",
    members: 8,
    maxMembers: 12,
    entryFee: 50,
    auctionDate: "2024-03-15",
    auctionTime: "19:00",
    isPublic: false,
    createdBy: "1",
    createdAt: "2024-03-01T10:00:00Z",
    myPosition: 2,
    myWinnings: 35,
    nextAction: "View Results",
    inviteCode: "ABC123",
    joinedMembers: ["1", "2", "3", "4", "5", "6", "7", "8"],
    budgetsVisible: true,
    enableSquads: true,
    numberOfSquads: 2,
    squads: [
      { id: "squad-1", name: "Squad 1", members: ["1"], totalSpent: 0, totalTeams: 0, totalWinnings: 0 },
      { id: "squad-2", name: "Squad 2", members: [], totalSpent: 0, totalTeams: 0, totalWinnings: 0 },
    ],
    auctionParticipants: {
      "1": { id: "1", name: "User 1", totalSpent: 0, teamsWon: 0, remainingBudget: 1000 },
      "2": { id: "2", name: "User 2", totalSpent: 0, teamsWon: 0, remainingBudget: 1000 },
      "3": { id: "3", name: "User 3", totalSpent: 0, teamsWon: 0, remainingBudget: 1000 },
      "4": { id: "4", name: "User 4", totalSpent: 0, teamsWon: 0, remainingBudget: 1000 },
      "5": { id: "5", name: "User 5", totalSpent: 0, teamsWon: 0, remainingBudget: 1000 },
      "6": { id: "6", name: "User 6", totalSpent: 0, teamsWon: 0, remainingBudget: 1000 },
      "7": { id: "7", name: "User 7", totalSpent: 0, teamsWon: 0, remainingBudget: 1000 },
      "8": { id: "8", name: "User 8", totalSpent: 0, teamsWon: 0, remainingBudget: 1000 },
    },
  },
  {
    id: "2",
    name: "Office Pool",
    description: "Workplace competition",
    tournament: "march-madness-2024",
    tournamentName: "March Madness 2024",
    status: "upcoming",
    members: 6,
    maxMembers: 16,
    entryFee: 25,
    auctionDate: "2024-03-20",
    auctionTime: "18:00",
    isPublic: false,
    createdBy: "1",
    createdAt: "2024-03-05T14:00:00Z",
    myPosition: undefined,
    myWinnings: 0,
    nextAction: "Join Auction",
    inviteCode: "DEF456",
    joinedMembers: ["1", "2", "3", "4", "5", "6"],
    budgetsVisible: false,
  },
  {
    id: "3",
    name: "High Stakes League",
    description: "For serious competitors only",
    tournament: "nba-playoffs-2024",
    tournamentName: "NBA Playoffs 2024",
    status: "active",
    members: 8,
    maxMembers: 8,
    entryFee: 100,
    auctionDate: "2024-04-15",
    auctionTime: "20:00",
    isPublic: false,
    createdBy: "1",
    createdAt: "2024-04-01T16:00:00Z",
    myPosition: 1,
    myWinnings: 210,
    nextAction: "View League",
    inviteCode: "GHI789",
    joinedMembers: ["1", "2", "3", "4", "5", "6", "7", "8"],
    budgetsVisible: true,
  },
  {
    id: "4",
    name: "March Madness Public",
    description: "Open to everyone - join the fun!",
    tournament: "march-madness-2024",
    tournamentName: "March Madness 2024",
    status: "upcoming",
    members: 12,
    maxMembers: 20,
    entryFee: 30,
    auctionDate: "2024-03-18",
    auctionTime: "19:00",
    isPublic: true,
    createdBy: "2",
    createdAt: "2024-03-08T12:00:00Z",
    nextAction: "Join League",
    inviteCode: "PUB123",
    joinedMembers: ["2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"],
    budgetsVisible: true,
  },
  {
    id: "5",
    name: "NBA Playoffs Open",
    description: "Public NBA playoffs league",
    tournament: "nba-playoffs-2024",
    tournamentName: "NBA Playoffs 2024",
    status: "upcoming",
    members: 8,
    maxMembers: 16,
    entryFee: 40,
    auctionDate: "2024-04-20",
    auctionTime: "18:30",
    isPublic: true,
    createdBy: "3",
    createdAt: "2024-04-05T10:00:00Z",
    nextAction: "Join League",
    inviteCode: "NBA456",
    joinedMembers: ["3", "4", "5", "6", "7", "8", "9", "10"],
    budgetsVisible: false,
  },
  // Add some completed leagues for history
  {
    id: "6",
    name: "2023 March Madness Champions",
    description: "Last year's epic tournament",
    tournament: "march-madness-2023",
    tournamentName: "March Madness 2023",
    status: "completed",
    members: 16,
    maxMembers: 16,
    entryFee: 75,
    auctionDate: "2023-03-15",
    auctionTime: "19:00",
    isPublic: false,
    createdBy: "1",
    createdAt: "2023-03-01T10:00:00Z",
    myPosition: 1,
    myWinnings: 450,
    nextAction: "View Results",
    inviteCode: "HIST123",
    joinedMembers: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16"],
    budgetsVisible: true,
  },
  {
    id: "7",
    name: "Summer NBA Finals 2023",
    description: "NBA Finals betting pool",
    tournament: "nba-finals-2023",
    tournamentName: "NBA Finals 2023",
    status: "completed",
    members: 10,
    maxMembers: 12,
    entryFee: 60,
    auctionDate: "2023-06-01",
    auctionTime: "20:00",
    isPublic: false,
    createdBy: "1",
    createdAt: "2023-05-25T16:00:00Z",
    myPosition: 3,
    myWinnings: 85,
    nextAction: "View Results",
    inviteCode: "NBA2023",
    joinedMembers: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
    budgetsVisible: false,
  },
  {
    id: "8",
    name: "Fantasy Football 2022",
    description: "Season-long fantasy football league",
    tournament: "nfl-2022",
    tournamentName: "NFL Season 2022",
    status: "completed",
    members: 12,
    maxMembers: 12,
    entryFee: 100,
    auctionDate: "2022-08-15",
    auctionTime: "19:00",
    isPublic: false,
    createdBy: "1",
    createdAt: "2022-08-01T10:00:00Z",
    myPosition: 5,
    myWinnings: 0,
    nextAction: "View Results",
    inviteCode: "NFL2022",
    joinedMembers: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
    budgetsVisible: true,
  },
]

// Mock initial messages
const initialMessages: LeagueMessage[] = [
  {
    id: "1",
    leagueId: "1",
    userId: "2",
    userName: "Sarah Miller",
    message: "Can't wait for the auction tonight! 🏀",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    type: "message",
  },
  {
    id: "2",
    leagueId: "1",
    userId: "3",
    userName: "Mike Rodriguez",
    message: "I'm going all in on Duke this year!",
    timestamp: new Date(Date.now() - 3000000).toISOString(),
    type: "message",
  },
  {
    id: "3",
    leagueId: "1",
    userId: "system",
    userName: "System",
    message: "John Doe has joined the league",
    timestamp: new Date(Date.now() - 2400000).toISOString(),
    type: "system",
  },
  {
    id: "4",
    leagueId: "1",
    userId: "4",
    userName: "Lisa Kim",
    message: "Good luck everyone! May the best bidder win 💪",
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    type: "message",
  },
  {
    id: "5",
    leagueId: "1",
    userId: "1",
    userName: "Commissioner",
    message: "Reminder: Auction starts at 7 PM EST. Make sure you're ready!",
    timestamp: new Date(Date.now() - 900000).toISOString(),
    type: "announcement",
  },
]

// Mock initial recent activities
const initialRecentActivities: RecentActivity[] = [
  {
    id: "1",
    userId: "1",
    type: "win",
    message: "Your team Duke Blue Devils won their Elite Eight game!",
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    earnings: 25,
  },
  {
    id: "2",
    userId: "1",
    type: "bid",
    message: "You successfully bid $85 on Kansas Jayhawks",
    timestamp: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "3",
    userId: "1",
    type: "win",
    message: "Your team Auburn Tigers advanced to Sweet 16!",
    timestamp: new Date(Date.now() - 259200000).toISOString(),
    earnings: 15,
  },
]

// Tournament team data
const tournamentTeams: Record<string, TournamentTeam[]> = {
  "march-madness-2025": [
    { id: 1, name: "UConn Huskies", seed: 1, region: "East" },
    { id: 2, name: "North Carolina Tar Heels", seed: 8, region: "East" },
    { id: 3, name: "Duke Blue Devils", seed: 4, region: "East" },
    { id: 4, name: "Auburn Tigers", seed: 5, region: "East" },
    { id: 5, name: "San Diego State Aztecs", seed: 2, region: "East" },
    { id: 6, name: "Tennessee Volunteers", seed: 3, region: "East" },
    { id: 7, name: "Kentucky Wildcats", seed: 6, region: "East" },
    { id: 8, name: "Florida Atlantic Owls", seed: 7, region: "East" },
    { id: 9, name: "Houston Cougars", seed: 1, region: "South" },
    { id: 10, name: "Miami Hurricanes", seed: 5, region: "South" },
    { id: 11, name: "Indiana Hoosiers", seed: 4, region: "South" },
    { id: 12, name: "Xavier Musketeers", seed: 3, region: "South" },
    { id: 13, name: "Texas A&M Aggies", seed: 7, region: "South" },
    { id: 14, name: "Penn State Nittany Lions", seed: 10, region: "South" },
    { id: 15, name: "Furman Paladins", seed: 13, region: "South" },
    { id: 16, name: "Northern Kentucky Norse", seed: 14, region: "South" },
    { id: 17, name: "Kansas Jayhawks", seed: 1, region: "West" },
    { id: 18, name: "UCLA Bruins", seed: 2, region: "West" },
    { id: 19, name: "Gonzaga Bulldogs", seed: 3, region: "West" },
    { id: 20, name: "Arkansas Razorbacks", seed: 8, region: "West" },
    { id: 21, name: "Saint Mary's Gaels", seed: 5, region: "West" },
    { id: 22, name: "TCU Horned Frogs", seed: 6, region: "West" },
    { id: 23, name: "Northwestern Wildcats", seed: 7, region: "West" },
    { id: 24, name: "Boise State Broncos", seed: 10, region: "West" },
    { id: 25, name: "Purdue Boilermakers", seed: 1, region: "Midwest" },
    { id: 26, name: "Marquette Golden Eagles", seed: 2, region: "Midwest" },
    { id: 27, name: "Kansas State Wildcats", seed: 3, region: "Midwest" },
    { id: 28, name: "Tennessee Volunteers", seed: 4, region: "Midwest" },
    { id: 29, name: "Duke Blue Devils", seed: 5, region: "Midwest" },
    { id: 30, name: "Kentucky Wildcats", seed: 6, region: "Midwest" },
    { id: 31, name: "Michigan State Spartans", seed: 7, region: "Midwest" },
    { id: 32, name: "Memphis Tigers", seed: 8, region: "Midwest" },
  ],
  "march-madness-womens-2025": [
    { id: 1, name: "South Carolina Gamecocks", seed: 1, region: "East" },
    { id: 2, name: "UConn Huskies", seed: 2, region: "East" },
    { id: 3, name: "NC State Wolfpack", seed: 3, region: "East" },
    { id: 4, name: "Tennessee Lady Volunteers", seed: 4, region: "East" },
    { id: 5, name: "Stanford Cardinal", seed: 1, region: "West" },
    { id: 6, name: "Oregon Ducks", seed: 2, region: "West" },
    { id: 7, name: "UCLA Bruins", seed: 3, region: "West" },
    { id: 8, name: "Arizona Wildcats", seed: 4, region: "West" },
    { id: 9, name: "LSU Tigers", seed: 1, region: "South" },
    { id: 10, name: "Baylor Bears", seed: 2, region: "South" },
    { id: 11, name: "Texas Longhorns", seed: 3, region: "South" },
    { id: 12, name: "Oklahoma Sooners", seed: 4, region: "South" },
    { id: 13, name: "Iowa Hawkeyes", seed: 1, region: "Midwest" },
    { id: 14, name: "Notre Dame Fighting Irish", seed: 2, region: "Midwest" },
    { id: 15, name: "Michigan Wolverines", seed: 3, region: "Midwest" },
    { id: 16, name: "Ohio State Buckeyes", seed: 4, region: "Midwest" },
  ],
  "world-cup-2025": [
    { id: 1, name: "Argentina", seed: 1, region: "Group A" },
    { id: 2, name: "Poland", seed: 2, region: "Group A" },
    { id: 3, name: "Mexico", seed: 3, region: "Group A" },
    { id: 4, name: "Saudi Arabia", seed: 4, region: "Group A" },
    { id: 5, name: "France", seed: 1, region: "Group B" },
    { id: 6, name: "Australia", seed: 2, region: "Group B" },
    { id: 7, name: "Denmark", seed: 3, region: "Group B" },
    { id: 8, name: "Tunisia", seed: 4, region: "Group B" },
    { id: 9, name: "Spain", seed: 1, region: "Group C" },
    { id: 10, name: "Germany", seed: 2, region: "Group C" },
    { id: 11, name: "Japan", seed: 3, region: "Group C" },
    { id: 12, name: "Costa Rica", seed: 4, region: "Group C" },
    { id: 13, name: "Croatia", seed: 1, region: "Group D" },
    { id: 14, name: "Morocco", seed: 2, region: "Group D" },
    { id: 15, name: "Belgium", seed: 3, region: "Group D" },
    { id: 16, name: "Canada", seed: 4, region: "Group D" },
    { id: 17, name: "Brazil", seed: 1, region: "Group E" },
    { id: 18, name: "Switzerland", seed: 2, region: "Group E" },
    { id: 19, name: "Cameroon", seed: 3, region: "Group E" },
    { id: 20, name: "Serbia", seed: 4, region: "Group E" },
    { id: 21, name: "Portugal", seed: 1, region: "Group F" },
    { id: 22, name: "Uruguay", seed: 2, region: "Group F" },
    { id: 23, name: "South Korea", seed: 3, region: "Group F" },
    { id: 24, name: "Ghana", seed: 4, region: "Group F" },
    { id: 25, name: "England", seed: 1, region: "Group G" },
    { id: 26, name: "Iran", seed: 2, region: "Group G" },
    { id: 27, name: "USA", seed: 3, region: "Group G" },
    { id: 28, name: "Wales", seed: 4, region: "Group G" },
    { id: 29, name: "Netherlands", seed: 1, region: "Group H" },
    { id: 30, name: "Senegal", seed: 2, region: "Group H" },
    { id: 31, name: "Ecuador", seed: 3, region: "Group H" },
    { id: 32, name: "Qatar", seed: 4, region: "Group H" },
  ],
  "nba-playoffs-2025": [
    { id: 1, name: "Boston Celtics", seed: 1, region: "Eastern Conference" },
    { id: 2, name: "New York Knicks", seed: 2, region: "Eastern Conference" },
    { id: 3, name: "Milwaukee Bucks", seed: 3, region: "Eastern Conference" },
    { id: 4, name: "Cleveland Cavaliers", seed: 4, region: "Eastern Conference" },
    { id: 5, name: "Orlando Magic", seed: 5, region: "Eastern Conference" },
    { id: 6, name: "Indiana Pacers", seed: 6, region: "Eastern Conference" },
    { id: 7, name: "Philadelphia 76ers", seed: 7, region: "Eastern Conference" },
    { id: 8, name: "Miami Heat", seed: 8, region: "Eastern Conference" },
    { id: 9, name: "Oklahoma City Thunder", seed: 1, region: "Western Conference" },
    { id: 10, name: "Denver Nuggets", seed: 2, region: "Western Conference" },
    { id: 11, name: "Minnesota Timberwolves", seed: 3, region: "Western Conference" },
    { id: 12, name: "LA Clippers", seed: 4, region: "Western Conference" },
    { id: 13, name: "Dallas Mavericks", seed: 5, region: "Western Conference" },
    { id: 14, name: "Phoenix Suns", seed: 6, region: "Western Conference" },
    { id: 15, name: "New Orleans Pelicans", seed: 7, region: "Western Conference" },
    { id: 16, name: "Los Angeles Lakers", seed: 8, region: "Western Conference" },
  ],
  "nfl-playoffs-2025": [
    { id: 1, name: "Buffalo Bills", seed: 1, region: "AFC" },
    { id: 2, name: "Kansas City Chiefs", seed: 2, region: "AFC" },
    { id: 3, name: "Pittsburgh Steelers", seed: 3, region: "AFC" },
    { id: 4, name: "Houston Texans", seed: 4, region: "AFC" },
    { id: 5, name: "Baltimore Ravens", seed: 5, region: "AFC" },
    { id: 6, name: "Los Angeles Chargers", seed: 6, region: "AFC" },
    { id: 7, name: "Denver Broncos", seed: 7, region: "AFC" },
    { id: 8, name: "Detroit Lions", seed: 1, region: "NFC" },
    { id: 9, name: "Philadelphia Eagles", seed: 2, region: "NFC" },
    { id: 10, name: "Los Angeles Rams", seed: 3, region: "NFC" },
    { id: 11, name: "Tampa Bay Buccaneers", seed: 4, region: "NFC" },
    { id: 12, name: "Minnesota Vikings", seed: 5, region: "NFC" },
    { id: 13, name: "Washington Commanders", seed: 6, region: "NFC" },
    { id: 14, name: "Green Bay Packers", seed: 7, region: "NFC" },
  ],
  "stanley-cup-2025": [
    { id: 1, name: "Winnipeg Jets", seed: 1, region: "Western Conference" },
    { id: 2, name: "Vegas Golden Knights", seed: 2, region: "Western Conference" },
    { id: 3, name: "Minnesota Wild", seed: 3, region: "Western Conference" },
    { id: 4, name: "Dallas Stars", seed: 4, region: "Western Conference" },
    { id: 5, name: "Los Angeles Kings", seed: 5, region: "Western Conference" },
    { id: 6, name: "Edmonton Oilers", seed: 6, region: "Western Conference" },
    { id: 7, name: "Colorado Avalanche", seed: 7, region: "Western Conference" },
    { id: 8, name: "Vancouver Canucks", seed: 8, region: "Western Conference" },
    { id: 9, name: "Washington Capitals", seed: 1, region: "Eastern Conference" },
    { id: 10, name: "Carolina Hurricanes", seed: 2, region: "Eastern Conference" },
    { id: 11, name: "New Jersey Devils", seed: 3, region: "Eastern Conference" },
    { id: 12, name: "Toronto Maple Leafs", seed: 4, region: "Eastern Conference" },
    { id: 13, name: "Florida Panthers", seed: 5, region: "Eastern Conference" },
    { id: 14, name: "New York Rangers", seed: 6, region: "Eastern Conference" },
    { id: 15, name: "Tampa Bay Lightning", seed: 7, region: "Eastern Conference" },
    { id: 16, name: "Boston Bruins", seed: 8, region: "Eastern Conference" },
  ],
  "masters-2025": [
    { id: 1, name: "Scottie Scheffler", seed: 1, region: "Field" },
    { id: 2, name: "Xander Schauffele", seed: 2, region: "Field" },
    { id: 3, name: "Rory McIlroy", seed: 3, region: "Field" },
    { id: 4, name: "Viktor Hovland", seed: 4, region: "Field" },
    { id: 5, name: "Ludvig Aberg", seed: 5, region: "Field" },
    { id: 6, name: "Wyndham Clark", seed: 6, region: "Field" },
    { id: 7, name: "Collin Morikawa", seed: 7, region: "Field" },
    { id: 8, name: "Patrick Cantlay", seed: 8, region: "Field" },
    { id: 9, name: "Bryson DeChambeau", seed: 9, region: "Field" },
    { id: 10, name: "Max Homa", seed: 10, region: "Field" },
    { id: 11, name: "Tommy Fleetwood", seed: 11, region: "Field" },
    { id: 12, name: "Jordan Spieth", seed: 12, region: "Field" },
    { id: 13, name: "Justin Thomas", seed: 13, region: "Field" },
    { id: 14, name: "Cameron Smith", seed: 14, region: "Field" },
    { id: 15, name: "Dustin Johnson", seed: 15, region: "Field" },
    { id: 16, name: "Brooks Koepka", seed: 16, region: "Field" },
    { id: 17, name: "Tony Finau", seed: 17, region: "Field" },
    { id: 18, name: "Hideki Matsuyama", seed: 18, region: "Field" },
    { id: 19, name: "Tiger Woods", seed: 19, region: "Field" },
    { id: 20, name: "Jason Day", seed: 20, region: "Field" },
    { id: 21, name: "Adam Scott", seed: 21, region: "Field" },
    { id: 22, name: "Matt Fitzpatrick", seed: 22, region: "Field" },
    { id: 23, name: "Russell Henley", seed: 23, region: "Field" },
    { id: 24, name: "Sahith Theegala", seed: 24, region: "Field" },
    { id: 25, name: "Shane Lowry", seed: 25, region: "Field" },
    { id: 26, name: "Min Woo Lee", seed: 26, region: "Field" },
    { id: 27, name: "Tyrrell Hatton", seed: 27, region: "Field" },
    { id: 28, name: "Joaquin Niemann", seed: 28, region: "Field" },
    { id: 29, name: "Cameron Young", seed: 29, region: "Field" },
    { id: 30, name: "Sam Burns", seed: 30, region: "Field" },
  ],
  "champions-league-2025": [
    { id: 1, name: "Manchester City", seed: 1, region: "Group A" },
    { id: 2, name: "RB Leipzig", seed: 2, region: "Group A" },
    { id: 3, name: "Red Star Belgrade", seed: 3, region: "Group A" },
    { id: 4, name: "Young Boys", seed: 4, region: "Group A" },
    { id: 5, name: "Arsenal", seed: 1, region: "Group B" },
    { id: 6, name: "PSV Eindhoven", seed: 2, region: "Group B" },
    { id: 7, name: "Sevilla", seed: 3, region: "Group B" },
    { id: 8, name: "RC Lens", seed: 4, region: "Group B" },
    { id: 9, name: "Real Madrid", seed: 1, region: "Group C" },
    { id: 10, name: "Napoli", seed: 2, region: "Group C" },
    { id: 11, name: "Braga", seed: 3, region: "Group C" },
    { id: 12, name: "Union Berlin", seed: 4, region: "Group C" },
    { id: 13, name: "Real Sociedad", seed: 1, region: "Group D" },
    { id: 14, name: "Inter Milan", seed: 2, region: "Group D" },
    { id: 15, name: "Benfica", seed: 3, region: "Group D" },
    { id: 16, name: "FC Salzburg", seed: 4, region: "Group D" },
    { id: 17, name: "Atletico Madrid", seed: 1, region: "Group E" },
    { id: 18, name: "Lazio", seed: 2, region: "Group E" },
    { id: 19, name: "Feyenoord", seed: 3, region: "Group E" },
    { id: 20, name: "Celtic", seed: 4, region: "Group E" },
    { id: 21, name: "Paris Saint-Germain", seed: 1, region: "Group F" },
    { id: 22, name: "Borussia Dortmund", seed: 2, region: "Group F" },
    { id: 23, name: "AC Milan", seed: 3, region: "Group F" },
    { id: 24, name: "Newcastle United", seed: 4, region: "Group F" },
    { id: 25, name: "Manchester United", seed: 1, region: "Group G" },
    { id: 26, name: "Galatasaray", seed: 2, region: "Group G" },
    { id: 27, name: "Copenhagen", seed: 3, region: "Group G" },
    { id: 28, name: "Bayern Munich", seed: 4, region: "Group G" },
    { id: 29, name: "Barcelona", seed: 1, region: "Group H" },
    { id: 30, name: "Porto", seed: 2, region: "Group H" },
    { id: 31, name: "Shakhtar Donetsk", seed: 3, region: "Group H" },
    { id: 32, name: "Royal Antwerp", seed: 4, region: "Group H" },
  ],
  "masters-2026": [
    { id: 1, name: "Scottie Scheffler", seed: 1, region: "Field" },
    { id: 2, name: "Xander Schauffele", seed: 2, region: "Field" },
    { id: 3, name: "Rory McIlroy", seed: 3, region: "Field" },
    { id: 4, name: "Viktor Hovland", seed: 4, region: "Field" },
    { id: 5, name: "Ludvig Aberg", seed: 5, region: "Field" },
    { id: 6, name: "Wyndham Clark", seed: 6, region: "Field" },
    { id: 7, name: "Collin Morikawa", seed: 7, region: "Field" },
    { id: 8, name: "Patrick Cantlay", seed: 8, region: "Field" },
    { id: 9, name: "Bryson DeChambeau", seed: 9, region: "Field" },
    { id: 10, name: "Max Homa", seed: 10, region: "Field" },
    { id: 11, name: "Tommy Fleetwood", seed: 11, region: "Field" },
    { id: 12, name: "Jordan Spieth", seed: 12, region: "Field" },
    { id: 13, name: "Justin Thomas", seed: 13, region: "Field" },
    { id: 14, name: "Cameron Smith", seed: 14, region: "Field" },
    { id: 15, name: "Dustin Johnson", seed: 15, region: "Field" },
    { id: 16, name: "Brooks Koepka", seed: 16, region: "Field" },
    { id: 17, name: "Tony Finau", seed: 17, region: "Field" },
    { id: 18, name: "Hideki Matsuyama", seed: 18, region: "Field" },
    { id: 19, name: "Tiger Woods", seed: 19, region: "Field" },
    { id: 20, name: "Jason Day", seed: 20, region: "Field" },
    { id: 21, name: "Adam Scott", seed: 21, region: "Field" },
    { id: 22, name: "Matt Fitzpatrick", seed: 22, region: "Field" },
    { id: 23, name: "Russell Henley", seed: 23, region: "Field" },
    { id: 24, name: "Sahith Theegala", seed: 24, region: "Field" },
    { id: 25, name: "Shane Lowry", seed: 25, region: "Field" },
    { id: 26, name: "Min Woo Lee", seed: 26, region: "Field" },
    { id: 27, name: "Tyrrell Hatton", seed: 27, region: "Field" },
    { id: 28, name: "Joaquin Niemann", seed: 28, region: "Field" },
    { id: 29, name: "Cameron Young", seed: 29, region: "Field" },
    { id: 30, name: "Sam Burns", seed: 30, region: "Field" },
  ],
  "pga-championship-2026": [
    { id: 1, name: "Scottie Scheffler", seed: 1, region: "Field" },
    { id: 2, name: "Xander Schauffele", seed: 2, region: "Field" },
    { id: 3, name: "Rory McIlroy", seed: 3, region: "Field" },
    { id: 4, name: "Viktor Hovland", seed: 4, region: "Field" },
    { id: 5, name: "Ludvig Aberg", seed: 5, region: "Field" },
    { id: 6, name: "Wyndham Clark", seed: 6, region: "Field" },
    { id: 7, name: "Collin Morikawa", seed: 7, region: "Field" },
    { id: 8, name: "Patrick Cantlay", seed: 8, region: "Field" },
    { id: 9, name: "Bryson DeChambeau", seed: 9, region: "Field" },
    { id: 10, name: "Max Homa", seed: 10, region: "Field" },
    { id: 11, name: "Tommy Fleetwood", seed: 11, region: "Field" },
    { id: 12, name: "Jordan Spieth", seed: 12, region: "Field" },
    { id: 13, name: "Justin Thomas", seed: 13, region: "Field" },
    { id: 14, name: "Cameron Smith", seed: 14, region: "Field" },
    { id: 15, name: "Dustin Johnson", seed: 15, region: "Field" },
    { id: 16, name: "Brooks Koepka", seed: 16, region: "Field" },
    { id: 17, name: "Tony Finau", seed: 17, region: "Field" },
    { id: 18, name: "Hideki Matsuyama", seed: 18, region: "Field" },
    { id: 19, name: "Tiger Woods", seed: 19, region: "Field" },
    { id: 20, name: "Jason Day", seed: 20, region: "Field" },
    { id: 21, name: "Adam Scott", seed: 21, region: "Field" },
    { id: 22, name: "Matt Fitzpatrick", seed: 22, region: "Field" },
    { id: 23, name: "Russell Henley", seed: 23, region: "Field" },
    { id: 24, name: "Sahith Theegala", seed: 24, region: "Field" },
    { id: 25, name: "Shane Lowry", seed: 25, region: "Field" },
    { id: 26, name: "Min Woo Lee", seed: 26, region: "Field" },
    { id: 27, name: "Tyrrell Hatton", seed: 27, region: "Field" },
    { id: 28, name: "Joaquin Niemann", seed: 28, region: "Field" },
    { id: 29, name: "Cameron Young", seed: 29, region: "Field" },
    { id: 30, name: "Sam Burns", seed: 30, region: "Field" },
  ],
  "us-open-2026": [
    { id: 1, name: "Scottie Scheffler", seed: 1, region: "Field" },
    { id: 2, name: "Xander Schauffele", seed: 2, region: "Field" },
    { id: 3, name: "Rory McIlroy", seed: 3, region: "Field" },
    { id: 4, name: "Viktor Hovland", seed: 4, region: "Field" },
    { id: 5, name: "Ludvig Aberg", seed: 5, region: "Field" },
    { id: 6, name: "Wyndham Clark", seed: 6, region: "Field" },
    { id: 7, name: "Collin Morikawa", seed: 7, region: "Field" },
    { id: 8, name: "Patrick Cantlay", seed: 8, region: "Field" },
    { id: 9, name: "Bryson DeChambeau", seed: 9, region: "Field" },
    { id: 10, name: "Max Homa", seed: 10, region: "Field" },
    { id: 11, name: "Tommy Fleetwood", seed: 11, region: "Field" },
    { id: 12, name: "Jordan Spieth", seed: 12, region: "Field" },
    { id: 13, name: "Justin Thomas", seed: 13, region: "Field" },
    { id: 14, name: "Cameron Smith", seed: 14, region: "Field" },
    { id: 15, name: "Dustin Johnson", seed: 15, region: "Field" },
    { id: 16, name: "Brooks Koepka", seed: 16, region: "Field" },
    { id: 17, name: "Tony Finau", seed: 17, region: "Field" },
    { id: 18, name: "Hideki Matsuyama", seed: 18, region: "Field" },
    { id: 19, name: "Tiger Woods", seed: 19, region: "Field" },
    { id: 20, name: "Jason Day", seed: 20, region: "Field" },
    { id: 21, name: "Adam Scott", seed: 21, region: "Field" },
    { id: 22, name: "Matt Fitzpatrick", seed: 22, region: "Field" },
    { id: 23, name: "Russell Henley", seed: 23, region: "Field" },
    { id: 24, name: "Sahith Theegala", seed: 24, region: "Field" },
    { id: 25, name: "Shane Lowry", seed: 25, region: "Field" },
    { id: 26, name: "Min Woo Lee", seed: 26, region: "Field" },
    { id: 27, name: "Tyrrell Hatton", seed: 27, region: "Field" },
    { id: 28, name: "Joaquin Niemann", seed: 28, region: "Field" },
    { id: 29, name: "Cameron Young", seed: 29, region: "Field" },
    { id: 30, name: "Sam Burns", seed: 30, region: "Field" },
  ],
  "open-championship-2026": [
    { id: 1, name: "Scottie Scheffler", seed: 1, region: "Field" },
    { id: 2, name: "Xander Schauffele", seed: 2, region: "Field" },
    { id: 3, name: "Rory McIlroy", seed: 3, region: "Field" },
    { id: 4, name: "Viktor Hovland", seed: 4, region: "Field" },
    { id: 5, name: "Ludvig Aberg", seed: 5, region: "Field" },
    { id: 6, name: "Wyndham Clark", seed: 6, region: "Field" },
    { id: 7, name: "Collin Morikawa", seed: 7, region: "Field" },
    { id: 8, name: "Patrick Cantlay", seed: 8, region: "Field" },
    { id: 9, name: "Bryson DeChambeau", seed: 9, region: "Field" },
    { id: 10, name: "Max Homa", seed: 10, region: "Field" },
    { id: 11, name: "Tommy Fleetwood", seed: 11, region: "Field" },
    { id: 12, name: "Jordan Spieth", seed: 12, region: "Field" },
    { id: 13, name: "Justin Thomas", seed: 13, region: "Field" },
    { id: 14, name: "Cameron Smith", seed: 14, region: "Field" },
    { id: 15, name: "Dustin Johnson", seed: 15, region: "Field" },
    { id: 16, name: "Brooks Koepka", seed: 16, region: "Field" },
    { id: 17, name: "Tony Finau", seed: 17, region: "Field" },
    { id: 18, name: "Hideki Matsuyama", seed: 18, region: "Field" },
    { id: 19, name: "Tiger Woods", seed: 19, region: "Field" },
    { id: 20, name: "Jason Day", seed: 20, region: "Field" },
    { id: 21, name: "Adam Scott", seed: 21, region: "Field" },
    { id: 22, name: "Matt Fitzpatrick", seed: 22, region: "Field" },
    { id: 23, name: "Russell Henley", seed: 23, region: "Field" },
    { id: 24, name: "Sahith Theegala", seed: 24, region: "Field" },
    { id: 25, name: "Shane Lowry", seed: 25, region: "Field" },
    { id: 26, name: "Min Woo Lee", seed: 26, region: "Field" },
    { id: 27, name: "Tyrrell Hatton", seed: 27, region: "Field" },
    { id: 28, name: "Joaquin Niemann", seed: 28, region: "Field" },
    { id: 29, name: "Cameron Young", seed: 29, region: "Field" },
    { id: 30, name: "Sam Burns", seed: 30, region: "Field" },
  ],
  "us-open-tennis-2025": [
    { id: 1, name: "Novak Djokovic", seed: 1, region: "Men's Singles" },
    { id: 2, name: "Carlos Alcaraz", seed: 2, region: "Men's Singles" },
    { id: 3, name: "Daniil Medvedev", seed: 3, region: "Men's Singles" },
    { id: 4, name: "Jannik Sinner", seed: 4, region: "Men's Singles" },
    { id: 5, name: "Stefanos Tsitsipas", seed: 5, region: "Men's Singles" },
    { id: 6, name: "Alexander Zverev", seed: 6, region: "Men's Singles" },
    { id: 7, name: "Andrey Rublev", seed: 7, region: "Men's Singles" },
    { id: 8, name: "Casper Ruud", seed: 8, region: "Men's Singles" },
    { id: 9, name: "Iga Swiatek", seed: 1, region: "Women's Singles" },
    { id: 10, name: "Aryna Sabalenka", seed: 2, region: "Women's Singles" },
    { id: 11, name: "Coco Gauff", seed: 3, region: "Women's Singles" },
    { id: 12, name: "Elena Rybakina", seed: 4, region: "Women's Singles" },
    { id: 13, name: "Jessica Pegula", seed: 5, region: "Women's Singles" },
    { id: 14, name: "Ons Jabeur", seed: 6, region: "Women's Singles" },
    { id: 15, name: "Marketa Vondrousova", seed: 7, region: "Women's Singles" },
    { id: 16, name: "Maria Sakkari", seed: 8, region: "Women's Singles" },
  ],
  "epl-2025": [
    { id: 1, name: "Manchester City", seed: 1, region: "Premier League" },
    { id: 2, name: "Arsenal", seed: 2, region: "Premier League" },
    { id: 3, name: "Liverpool", seed: 3, region: "Premier League" },
    { id: 4, name: "Newcastle United", seed: 4, region: "Premier League" },
    { id: 5, name: "Manchester United", seed: 5, region: "Premier League" },
    { id: 6, name: "Brighton & Hove Albion", seed: 6, region: "Premier League" },
    { id: 7, name: "Aston Villa", seed: 7, region: "Premier League" },
    { id: 8, name: "Tottenham Hotspur", seed: 8, region: "Premier League" },
    { id: 9, name: "Brentford", seed: 9, region: "Premier League" },
    { id: 10, name: "Fulham", seed: 10, region: "Premier League" },
    { id: 11, name: "Crystal Palace", seed: 11, region: "Premier League" },
    { id: 12, name: "Chelsea", seed: 12, region: "Premier League" },
    { id: 13, name: "Wolverhampton Wanderers", seed: 13, region: "Premier League" },
    { id: 14, name: "West Ham United", seed: 14, region: "Premier League" },
    { id: 15, name: "AFC Bournemouth", seed: 15, region: "Premier League" },
    { id: 16, name: "Nottingham Forest", seed: 16, region: "Premier League" },
    { id: 17, name: "Everton", seed: 17, region: "Premier League" },
    { id: 18, name: "Leicester City", seed: 18, region: "Premier League" },
    { id: 19, name: "Leeds United", seed: 19, region: "Premier League" },
    { id: 20, name: "Southampton", seed: 20, region: "Premier League" },
  ],
  "nfl-playoffs-2024-example": [
    { id: 1, name: "Baltimore Ravens", seed: 1, region: "AFC" },
    { id: 2, name: "Buffalo Bills", seed: 2, region: "AFC" },
    { id: 3, name: "Kansas City Chiefs", seed: 3, region: "AFC" },
    { id: 4, name: "Houston Texans", seed: 4, region: "AFC" },
    { id: 5, name: "Cleveland Browns", seed: 5, region: "AFC" },
    { id: 6, name: "Miami Dolphins", seed: 6, region: "AFC" },
    { id: 7, name: "Pittsburgh Steelers", seed: 7, region: "AFC" },
    { id: 8, name: "San Francisco 49ers", seed: 1, region: "NFC" },
    { id: 9, name: "Dallas Cowboys", seed: 2, region: "NFC" },
    { id: 10, name: "Detroit Lions", seed: 3, region: "NFC" },
    { id: 11, name: "Tampa Bay Buccaneers", seed: 4, region: "NFC" },
    { id: 12, name: "Philadelphia Eagles", seed: 5, region: "NFC" },
    { id: 13, name: "Los Angeles Rams", seed: 6, region: "NFC" },
    { id: 14, name: "Green Bay Packers", seed: 7, region: "NFC" },
  ],
  "march-madness-2024": [
    { id: 1, name: "UConn Huskies", seed: 1, region: "East" },
    { id: 2, name: "North Carolina Tar Heels", seed: 8, region: "East" },
    { id: 3, name: "Duke Blue Devils", seed: 4, region: "East" },
    { id: 4, name: "Auburn Tigers", seed: 5, region: "East" },
    { id: 5, name: "San Diego State Aztecs", seed: 2, region: "East" },
    { id: 6, name: "Tennessee Volunteers", seed: 3, region: "East" },
    { id: 7, name: "Kentucky Wildcats", seed: 6, region: "East" },
    { id: 8, name: "Florida Atlantic Owls", seed: 7, region: "East" },
    { id: 9, name: "Houston Cougars", seed: 1, region: "South" },
    { id: 10, name: "Miami Hurricanes", seed: 5, region: "South" },
    { id: 11, name: "Indiana Hoosiers", seed: 4, region: "South" },
    { id: 12, name: "Xavier Musketeers", seed: 3, region: "South" },
    { id: 13, name: "Texas A&M Aggies", seed: 7, region: "South" },
    { id: 14, name: "Penn State Nittany Lions", seed: 10, region: "South" },
    { id: 15, name: "Furman Paladins", seed: 13, region: "South" },
    { id: 16, name: "Northern Kentucky Norse", seed: 14, region: "South" },
    { id: 17, name: "Kansas Jayhawks", seed: 1, region: "West" },
    { id: 18, name: "UCLA Bruins", seed: 2, region: "West" },
    { id: 19, name: "Gonzaga Bulldogs", seed: 3, region: "West" },
    { id: 20, name: "Arkansas Razorbacks", seed: 8, region: "West" },
    { id: 21, name: "Saint Mary's Gaels", seed: 5, region: "West" },
    { id: 22, name: "TCU Horned Frogs", seed: 6, region: "West" },
    { id: 23, name: "Northwestern Wildcats", seed: 7, region: "West" },
    { id: 24, name: "Boise State Broncos", seed: 10, region: "West" },
    { id: 25, name: "Purdue Boilermakers", seed: 1, region: "Midwest" },
    { id: 26, name: "Marquette Golden Eagles", seed: 2, region: "Midwest" },
    { id: 27, name: "Kansas State Wildcats", seed: 3, region: "Midwest" },
    { id: 28, name: "Tennessee Volunteers", seed: 4, region: "Midwest" },
    { id: 29, name: "Duke Blue Devils", seed: 5, region: "Midwest" },
    { id: 30, name: "Kentucky Wildcats", seed: 6, region: "Midwest" },
    { id: 31, name: "Michigan State Spartans", seed: 7, region: "Midwest" },
    { id: 32, name: "Memphis Tigers", seed: 8, region: "Midwest" },
  ],
  "march-madness-womens-2024": [
    { id: 1, name: "South Carolina Gamecocks", seed: 1, region: "East" },
    { id: 2, name: "UConn Huskies", seed: 2, region: "East" },
    { id: 3, name: "NC State Wolfpack", seed: 3, region: "East" },
    { id: 4, name: "Tennessee Lady Volunteers", seed: 4, region: "East" },
    { id: 5, name: "Stanford Cardinal", seed: 1, region: "West" },
    { id: 6, name: "Oregon Ducks", seed: 2, region: "West" },
    { id: 7, name: "UCLA Bruins", seed: 3, region: "West" },
    { id: 8, name: "Arizona Wildcats", seed: 4, region: "West" },
    { id: 9, name: "LSU Tigers", seed: 1, region: "South" },
    { id: 10, name: "Baylor Bears", seed: 2, region: "South" },
    { id: 11, name: "Texas Longhorns", seed: 3, region: "South" },
    { id: 12, name: "Oklahoma Sooners", seed: 4, region: "South" },
    { id: 13, name: "Iowa Hawkeyes", seed: 1, region: "Midwest" },
    { id: 14, name: "Notre Dame Fighting Irish", seed: 2, region: "Midwest" },
    { id: 15, name: "Michigan Wolverines", seed: 3, region: "Midwest" },
    { id: 16, name: "Ohio State Buckeyes", seed: 4, region: "Midwest" },
  ],
  "world-cup-2024": [
    { id: 1, name: "Argentina", seed: 1, region: "Group A" },
    { id: 2, name: "Poland", seed: 2, region: "Group A" },
    { id: 3, name: "Mexico", seed: 3, region: "Group A" },
    { id: 4, name: "Saudi Arabia", seed: 4, region: "Group A" },
    { id: 5, name: "France", seed: 1, region: "Group B" },
    { id: 6, name: "Australia", seed: 2, region: "Group B" },
    { id: 7, name: "Denmark", seed: 3, region: "Group B" },
    { id: 8, name: "Tunisia", seed: 4, region: "Group B" },
    { id: 9, name: "Spain", seed: 1, region: "Group C" },
    { id: 10, name: "Germany", seed: 2, region: "Group C" },
    { id: 11, name: "Japan", seed: 3, region: "Group C" },
    { id: 12, name: "Costa Rica", seed: 4, region: "Group C" },
    { id: 13, name: "Croatia", seed: 1, region: "Group D" },
    { id: 14, name: "Morocco", seed: 2, region: "Group D" },
    { id: 15, name: "Belgium", seed: 3, region: "Group D" },
    { id: 16, name: "FC Salzburg", seed: 4, region: "Group D" },
    { id: 17, name: "Atletico Madrid", seed: 1, region: "Group E" },
    { id: 18, name: "Lazio", seed: 2, region: "Group E" },
    { id: 19, name: "Feyenoord", seed: 3, region: "Group E" },
    { id: 20, name: "Celtic", seed: 4, region: "Group E" },
    { id: 21, name: "Paris Saint-Germain", seed: 1, region: "Group F" },
    { id: 22, name: "Borussia Dortmund", seed: 2, region: "Group F" },
    { id: 23, name: "AC Milan", seed: 3, region: "Group F" },
    { id: 24, name: "Newcastle United", seed: 4, region: "Group F" },
    { id: 25, name: "Manchester United", seed: 1, region: "Group G" },
    { id: 26, name: "Galatasaray", seed: 2, region: "Group G" },
    { id: 27, name: "Copenhagen", seed: 3, region: "Group G" },
    { id: 28, name: "Bayern Munich", seed: 4, region: "Group G" },
    { id: 29, name: "Barcelona", seed: 1, region: "Group H" },
    { id: 30, name: "Porto", seed: 2, region: "Group H" },
    { id: 31, name: "Shakhtar Donetsk", seed: 3, region: "Group H" },
    { id: 32, name: "Royal Antwerp", seed: 4, region: "Group H" },
  ],
  "nba-playoffs-2024": [
    { id: 1, name: "Boston Celtics", seed: 1, region: "Eastern Conference" },
    { id: 2, name: "New York Knicks", seed: 2, region: "Eastern Conference" },
    { id: 3, name: "Milwaukee Bucks", seed: 3, region: "Eastern Conference" },
    { id: 4, name: "Cleveland Cavaliers", seed: 4, region: "Eastern Conference" },
    { id: 5, name: "Orlando Magic", seed: 5, region: "Eastern Conference" },
    { id: 6, name: "Indiana Pacers", seed: 6, region: "Eastern Conference" },
    { id: 7, name: "Philadelphia 76ers", seed: 7, region: "Eastern Conference" },
    { id: 8, name: "Miami Heat", seed: 8, region: "Eastern Conference" },
    { id: 9, name: "Oklahoma City Thunder", seed: 1, region: "Western Conference" },
    { id: 10, name: "Denver Nuggets", seed: 2, region: "Western Conference" },
    { id: 11, name: "Minnesota Timberwolves", seed: 3, region: "Western Conference" },
    { id: 12, name: "LA Clippers", seed: 4, region: "Western Conference" },
    { id: 13, name: "Dallas Mavericks", seed: 5, region: "Western Conference" },
    { id: 14, name: "Phoenix Suns", seed: 6, region: "Western Conference" },
    { id: 15, name: "New Orleans Pelicans", seed: 7, region: "Western Conference" },
    { id: 16, name: "Los Angeles Lakers", seed: 8, region: "Western Conference" },
  ],
  "nfl-playoffs-2024": [
    { id: 1, name: "Baltimore Ravens", seed: 1, region: "AFC" },
    { id: 2, name: "Buffalo Bills", seed: 2, region: "AFC" },
    { id: 3, name: "Kansas City Chiefs", seed: 3, region: "AFC" },
    { id: 4, name: "Houston Texans", seed: 4, region: "AFC" },
    { id: 5, name: "Cleveland Browns", seed: 5, region: "AFC" },
    { id: 6, name: "Miami Dolphins", seed: 6, region: "AFC" },
    { id: 7, name: "Pittsburgh Steelers", seed: 7, region: "AFC" },
    { id: 8, name: "San Francisco 49ers", seed: 1, region: "NFC" },
    { id: 9, name: "Dallas Cowboys", seed: 2, region: "NFC" },
    { id: 10, name: "Detroit Lions", seed: 3, region: "NFC" },
    { id: 11, name: "Tampa Bay Buccaneers", seed: 4, region: "NFC" },
    { id: 12, name: "Philadelphia Eagles", seed: 5, region: "NFC" },
    { id: 13, name: "Los Angeles Rams", seed: 6, region: "NFC" },
    { id: 14, name: "Green Bay Packers", seed: 7, region: "NFC" },
  ],
  "stanley-cup-2024": [
    { id: 1, name: "New York Rangers", seed: 1, region: "Eastern Conference" },
    { id: 2, name: "Carolina Hurricanes", seed: 2, region: "Eastern Conference" },
    { id: 3, name: "Florida Panthers", seed: 3, region: "Eastern Conference" },
    { id: 4, name: "Boston Bruins", seed: 4, region: "Eastern Conference" },
    { id: 5, name: "Toronto Maple Leafs", seed: 5, region: "Eastern Conference" },
    { id: 6, name: "Tampa Bay Lightning", seed: 6, region: "Eastern Conference" },
    { id: 7, name: "Washington Capitals", seed: 7, region: "Eastern Conference" },
    { id: 8, name: "Philadelphia Flyers", seed: 8, region: "Eastern Conference" },
    { id: 9, name: "Dallas Stars", seed: 1, region: "Western Conference" },
    { id: 10, name: "Vancouver Canucks", seed: 2, region: "Western Conference" },
    { id: 11, name: "Winnipeg Jets", seed: 3, region: "Western Conference" },
    { id: 12, name: "Colorado Avalanche", seed: 4, region: "Western Conference" },
    { id: 13, name: "Vegas Golden Knights", seed: 5, region: "Western Conference" },
    { id: 14, name: "Edmonton Oilers", seed: 6, region: "Western Conference" },
    { id: 15, name: "Los Angeles Kings", seed: 7, region: "Western Conference" },
    { id: 16, name: "Nashville Predators", seed: 8, region: "Western Conference" },
  ],
  "masters-2024": [
    { id: 1, name: "Scottie Scheffler", seed: 1, region: "Field" },
    { id: 2, name: "Jon Rahm", seed: 2, region: "Field" },
    { id: 3, name: "Rory McIlroy", seed: 3, region: "Field" },
    { id: 4, name: "Viktor Hovland", seed: 4, region: "Field" },
    { id: 5, name: "Xander Schauffele", seed: 5, region: "Field" },
    { id: 6, name: "Wyndham Clark", seed: 6, region: "Field" },
    { id: 7, name: "Ludvig Aberg", seed: 7, region: "Field" },
    { id: 8, name: "Collin Morikawa", seed: 8, region: "Field" },
    { id: 9, name: "Patrick Cantlay", seed: 9, region: "Field" },
    { id: 10, name: "Bryson DeChambeau", seed: 10, region: "Field" },
    { id: 11, name: "Max Homa", seed: 11, region: "Field" },
    { id: 12, name: "Tommy Fleetwood", seed: 12, region: "Field" },
    { id: 13, name: "Jordan Spieth", seed: 13, region: "Field" },
    { id: 14, name: "Justin Thomas", seed: 14, region: "Field" },
    { id: 15, name: "Cameron Smith", seed: 15, region: "Field" },
    { id: 16, name: "Dustin Johnson", seed: 16, region: "Field" },
    { id: 17, name: "Brooks Koepka", seed: 17, region: "Field" },
    { id: 18, name: "Tony Finau", seed: 18, region: "Field" },
    { id: 19, name: "Hideki Matsuyama", seed: 19, region: "Field" },
    { id: 20, name: "Tiger Woods", seed: 20, region: "Field" },
    { id: 21, name: "Jason Day", seed: 21, region: "Field" },
    { id: 22, name: "Adam Scott", seed: 22, region: "Field" },
    { id: 23, name: "Matt Fitzpatrick", seed: 23, region: "Field" },
    { id: 24, name: "Russell Henley", seed: 24, region: "Field" },
    { id: 25, name: "Sahith Theegala", seed: 25, region: "Field" },
    { id: 26, name: "Shane Lowry", seed: 26, region: "Field" },
    { id: 27, name: "Min Woo Lee", seed: 27, region: "Field" },
    { id: 28, name: "Tyrrell Hatton", seed: 28, region: "Field" },
    { id: 29, name: "Joaquin Niemann", seed: 29, region: "Field" },
    { id: 30, name: "Cameron Young", seed: 30, region: "Field" },
  ],
  "champions-league-2024": [
    { id: 1, name: "Manchester City", seed: 1, region: "Group A" },
    { id: 2, name: "RB Leipzig", seed: 2, region: "Group A" },
    { id: 3, name: "Red Star Belgrade", seed: 3, region: "Group A" },
    { id: 4, name: "Young Boys", seed: 4, region: "Group A" },
    { id: 5, name: "Arsenal", seed: 1, region: "Group B" },
    { id: 6, name: "PSV Eindhoven", seed: 2, region: "Group B" },
    { id: 7, name: "Sevilla", seed: 3, region: "Group B" },
    { id: 8, name: "RC Lens", seed: 4, region: "Group B" },
    { id: 9, name: "Real Madrid", seed: 1, region: "Group C" },
    { id: 10, name: "Napoli", seed: 2, region: "Group C" },
    { id: 11, name: "Braga", seed: 3, region: "Group C" },
    { id: 12, name: "Union Berlin", seed: 4, region: "Group C" },
    { id: 13, name: "Real Sociedad", seed: 1, region: "Group D" },
    { id: 14, name: "Inter Milan", seed: 2, region: "Group D" },
    { id: 15, name: "Benfica", seed: 3, region: "Group D" },
    { id: 16, name: "FC Salzburg", seed: 4, region: "Group D" },
    { id: 17, name: "Atletico Madrid", seed: 1, region: "Group E" },
    { id: 18, name: "Lazio", seed: 2, region: "Group E" },
    { id: 19, name: "Feyenoord", seed: 3, region: "Group E" },
    { id: 20, name: "Celtic", seed: 4, region: "Group E" },
    { id: 21, name: "Paris Saint-Germain", seed: 1, region: "Group F" },
    { id: 22, name: "Borussia Dortmund", seed: 2, region: "Group F" },
    { id: 23, name: "AC Milan", seed: 3, region: "Group F" },
    { id: 24, name: "Newcastle United", seed: 4, region: "Group F" },
    { id: 25, name: "Manchester United", seed: 1, region: "Group G" },
    { id: 26, name: "Galatasaray", seed: 2, region: "Group G" },
    { id: 27, name: "Copenhagen", seed: 3, region: "Group G" },
    { id: 28, name: "Bayern Munich", seed: 4, region: "Group G" },
    { id: 29, name: "Barcelona", seed: 1, region: "Group H" },
    { id: 30, name: "Porto", seed: 2, region: "Group H" },
    { id: 31, name: "Shakhtar Donetsk", seed: 3, region: "Group H" },
    { id: 32, name: "Royal Antwerp", seed: 4, region: "Group H" },
  ],
  "2025-ryder-cup": [
    // Team USA (current qualified players)
    { id: 1, name: "Scottie Scheffler", seed: 1, region: "Team USA" },
    { id: 2, name: "Xander Schauffele", seed: 2, region: "Team USA" },
    { id: 3, name: "Bryson DeChambeau", seed: 3, region: "Team USA" },
    { id: 4, name: "Justin Thomas", seed: 4, region: "Team USA" },
    { id: 5, name: "Collin Morikawa", seed: 5, region: "Team USA" },
    { id: 6, name: "Russell Henley", seed: 6, region: "Team USA" },
    // Team Europe (current qualified players)
    { id: 7, name: "Rory McIlroy", seed: 1, region: "Team Europe" },
    { id: 8, name: "Tyrrell Hatton", seed: 2, region: "Team Europe" },
    { id: 9, name: "Shane Lowry", seed: 3, region: "Team Europe" },
    { id: 10, name: "Robert MacIntyre", seed: 4, region: "Team Europe" },
    { id: 11, name: "Sepp Straka", seed: 5, region: "Team Europe" },
    { id: 12, name: "Rasmus Højgaard", seed: 6, region: "Team Europe" },
  ],
  "2025-cancun-challenge": [
    { id: 1, name: "Samford", seed: 1, region: "Tournament Field" },
    { id: 2, name: "Georgia State", seed: 2, region: "Tournament Field" },
    { id: 3, name: "New Mexico State", seed: 3, region: "Tournament Field" },
    { id: 4, name: "South Dakota State", seed: 4, region: "Tournament Field" },
    { id: 5, name: "UC Irvine", seed: 5, region: "Tournament Field" },
    { id: 6, name: "Utah Valley", seed: 6, region: "Tournament Field" },
  ],
}

export const leagueStore = create<LeagueStore>((set, get) => ({
  leagues: [...initialLeagues],
  messages: [...initialMessages],
  directMessages: [],
  recentActivities: [...initialRecentActivities],

  getUserLeagues: (userId: string) => {
    return get().leagues.filter((league) => league.createdBy === userId || league.joinedMembers.includes(userId))
  },

  getLeague: (id: string) => {
    return get().leagues.find((league) => league.id === id)
  },

  createLeague: (
    leagueData: Omit<League, "id" | "createdAt" | "inviteCode" | "joinedMembers" | "squads"> & {
      customInviteCode?: string
    },
  ) => {
    const { customInviteCode, ...restLeagueData } = leagueData

    const squads: Squad[] = []
    if (restLeagueData.enableSquads && restLeagueData.numberOfSquads) {
      for (let i = 1; i <= restLeagueData.numberOfSquads; i++) {
        squads.push({
          id: `squad-${i}`,
          name: `Squad ${i}`,
          members: i === 1 ? [restLeagueData.createdBy] : [], // Assign creator to first squad
          totalSpent: 0,
          totalTeams: 0,
          totalWinnings: 0,
        })
      }
    }

    // Initialize auction participants if squads are enabled
    let auctionParticipants:
      | Record<string, { id: string; name: string; totalSpent: number; teamsWon: number; remainingBudget: number }>
      | undefined = undefined
    if (restLeagueData.enableSquads || restLeagueData.entryFee) {
      // Assuming entryFee implies auction
      auctionParticipants = {}
      // For simplicity, adding creator as the first participant with a default budget
      // In a real app, this would be more dynamic based on entry fee and budget settings
      auctionParticipants[restLeagueData.createdBy] = {
        id: restLeagueData.createdBy,
        name: restLeagueData.createdBy, // This should be the actual user's name
        totalSpent: 0,
        teamsWon: 0,
        remainingBudget: restLeagueData.spendingLimit || 1000, // Default budget if not set
      }
    }

    const newLeague: League = {
      ...restLeagueData,
      id: Math.random().toString(36).substring(2, 15),
      createdAt: new Date().toISOString(),
      inviteCode: customInviteCode || Math.random().toString(36).substring(2, 8).toUpperCase(),
      members: 1, // Creator is the first member
      status: "upcoming",
      nextAction: "Manage League",
      joinedMembers: [restLeagueData.createdBy],
      squads: squads.length > 0 ? squads : undefined,
      auctionParticipants: auctionParticipants,
    }

    set((state) => ({
      leagues: [...state.leagues, newLeague],
    }))

    // Add recent activity for league creation
    get().addRecentActivity({
      userId: restLeagueData.createdBy,
      type: "league_created",
      message: `You created '${newLeague.name}' league`,
    })

    return newLeague
  },

  updateLeague: (id: string, updates: Partial<League>) => {
    set((state) => ({
      leagues: state.leagues.map((league) => (league.id === id ? { ...league, ...updates } : league)),
    }))
  },

  deleteLeague: (id: string) => {
    set((state) => ({
      leagues: state.leagues.filter((league) => league.id !== id),
    }))
  },

  getAllLeagues: () => {
    return get().leagues
  },

  joinLeague: (leagueId: string, userId: string, inviteCode?: string) => {
    const leagues = get().leagues
    const league = leagues.find((l) => l.id === leagueId)

    if (!league || league.members >= league.maxMembers || league.joinedMembers.includes(userId)) return false

    // For private leagues, validate invite code
    if (!league.isPublic && inviteCode && league.inviteCode !== inviteCode) {
      return false
    }

    set((state) => ({
      leagues: state.leagues.map((l) =>
        l.id === leagueId ? { ...l, members: l.members + 1, joinedMembers: [...l.joinedMembers, userId] } : l,
      ),
    }))

    if (league.enableSquads) {
      get().assignUserToSquad(leagueId, userId)
    }

    // Add the new user to auctionParticipants if auction is enabled and they don't exist
    if (league.auctionParticipants !== undefined) {
      set((state) => ({
        leagues: state.leagues.map((l) =>
          l.id === leagueId && !l.auctionParticipants?.[userId]
            ? {
                ...l,
                auctionParticipants: {
                  ...(l.auctionParticipants || {}),
                  [userId]: {
                    id: userId,
                    name: userId, // In a real app, fetch user's actual name
                    totalSpent: 0,
                    teamsWon: 0,
                    remainingBudget: l.spendingLimit || 1000, // Use league's spending limit or a default
                  },
                },
              }
            : l,
        ),
      }))
    }

    // Add system message
    const systemMessage: LeagueMessage = {
      id: Math.random().toString(36).substring(2, 15),
      leagueId: leagueId,
      userId: "system",
      userName: "System",
      message: `A new member has joined the league`,
      timestamp: new Date().toISOString(),
      type: "system",
    }

    set((state) => ({
      messages: [...state.messages, systemMessage],
    }))

    // Add recent activity for league joining
    get().addRecentActivity({
      userId: userId,
      type: "league_joined",
      message: `You joined '${league.name}' league`,
    })

    // Add browser notification for league joining
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("League Joined!", {
        body: `You have successfully joined ${league.name}`,
        icon: "/favicon.ico",
      })
    } else if ("Notification" in window && Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification("League Joined!", {
            body: `You have successfully joined ${league.name}`,
            icon: "/favicon.ico",
          })
        }
      })
    }

    return true
  },

  isUserMember: (leagueId: string, userId: string) => {
    const league = get().leagues.find((l) => l.id === leagueId)
    return league ? league.joinedMembers.includes(userId) || league.createdBy === userId : false
  },

  removeUserFromLeague: (leagueId: string, userId: string) => {
    const leagues = get().leagues
    const league = leagues.find((l) => l.id === leagueId)

    if (!league || !league.joinedMembers.includes(userId)) return

    set((state) => ({
      leagues: state.leagues.map((l) =>
        l.id === leagueId
          ? {
              ...l,
              members: l.members - 1,
              joinedMembers: l.joinedMembers.filter((id) => id !== userId),
              squads: l.squads?.map((squad) => ({
                ...squad,
                members: squad.members.filter((memberId) => memberId !== userId),
              })),
              // Remove user from auction participants
              auctionParticipants: league.auctionParticipants
                ? Object.fromEntries(Object.entries(league.auctionParticipants).filter(([key]) => key !== userId))
                : undefined,
            }
          : l,
      ),
    }))

    // Add recent activity for league removal
    get().addRecentActivity({
      userId: userId,
      type: "league_removed",
      message: `You were removed from '${league.name}' league`,
    })

    // Add system message
    const systemMessage: LeagueMessage = {
      id: Math.random().toString(36).substring(2, 15),
      leagueId: leagueId,
      userId: "system",
      userName: "System",
      message: `A member has been removed from the league`,
      timestamp: new Date().toISOString(),
      type: "system",
    }

    set((state) => ({
      messages: [...state.messages, systemMessage],
    }))
  },

  getLeagueMessages: (leagueId: string) => {
    return get()
      .messages.filter((message) => message.leagueId === leagueId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
  },

  sendMessage: (leagueId: string, userId: string, userName: string, messageText: string) => {
    const newMessage: LeagueMessage = {
      id: Math.random().toString(36).substring(2, 15),
      leagueId: leagueId,
      userId: userId,
      userName: userName,
      message: messageText,
      timestamp: new Date().toISOString(),
      type: "message",
    }

    set((state) => ({
      messages: [...state.messages, newMessage],
    }))

    return newMessage
  },

  sendAnnouncement: (leagueId: string, userId: string, userName: string, messageText: string) => {
    const newMessage: LeagueMessage = {
      id: Math.random().toString(36).substring(2, 15),
      leagueId: leagueId,
      userId: userId,
      userName: userName,
      message: messageText,
      timestamp: new Date().toISOString(),
      type: "announcement",
    }

    set((state) => ({
      messages: [...state.messages, newMessage],
    }))

    return newMessage
  },

  getDirectMessages: (leagueId: string, userId: string, otherUserId: string) => {
    return get()
      .directMessages.filter(
        (message) =>
          message.leagueId === leagueId &&
          ((message.senderId === userId && message.receiverId === otherUserId) ||
            (message.senderId === otherUserId && message.receiverId === userId)),
      )
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
  },

  sendDirectMessage: (
    leagueId: string,
    senderId: string,
    senderName: string,
    receiverId: string,
    receiverName: string,
    messageText: string,
  ) => {
    const newMessage: DirectMessage = {
      id: Math.random().toString(36).substring(2, 15),
      leagueId: leagueId,
      senderId: senderId,
      senderName: senderName,
      receiverId: receiverId,
      receiverName: receiverName,
      message: messageText,
      timestamp: new Date().toISOString(),
    }

    set((state) => ({
      directMessages: [...state.directMessages, newMessage],
    }))

    return newMessage
  },

  getUserRecentActivities: (userId: string) => {
    return get()
      .recentActivities.filter((activity) => activity.userId === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 6)
  },

  addRecentActivity: (activity: Omit<RecentActivity, "id" | "timestamp">) => {
    const newActivity: RecentActivity = {
      ...activity,
      id: Math.random().toString(36).substring(2, 15),
      timestamp: new Date().toISOString(),
    }

    set((state) => ({
      recentActivities: [...state.recentActivities, newActivity],
    }))
  },

  getTournamentTeams: (tournamentId: string) => {
    return tournamentTeams[tournamentId] || []
  },

  getUserSquad: (leagueId: string, userId: string) => {
    const league = get().leagues.find((l) => l.id === leagueId)
    if (!league || !league.squads) return undefined

    return league.squads.find((squad) => squad.members.includes(userId))
  },

  assignUserToSquad: (leagueId: string, userId: string) => {
    const league = get().leagues.find((l) => l.id === leagueId)
    if (!league || !league.squads || !league.enableSquads) return

    // Find squad with fewest members
    const squadWithFewestMembers = league.squads.reduce((minSquad, currentSquad) =>
      currentSquad.members.length < minSquad.members.length ? currentSquad : minSquad,
    )

    set((state) => ({
      leagues: state.leagues.map((l) =>
        l.id === leagueId
          ? {
              ...l,
              squads: l.squads?.map((squad) =>
                squad.id === squadWithFewestMembers.id ? { ...squad, members: [...squad.members, userId] } : squad,
              ),
            }
          : l,
      ),
    }))
  },
}))
