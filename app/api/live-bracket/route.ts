import { NextResponse } from "next/server"

// New route added per user request: provides LIVE tournament bracket data (real scores + advancing teams)
// for the league dashboard's Live Bracket tab. It proxies ESPN's free public scoreboard API server-side
// (avoids CORS and keeps the request off the client) and normalizes results into the same game shape the
// TournamentBracket component already renders.

// Shape returned to the client. Matches the BracketGame fields the bracket component consumes.
type LiveTeam = {
  id: number
  name: string
  seed: number
  score?: number
  region?: string
}
type LiveGame = {
  id: string
  team1: LiveTeam | null
  team2: LiveTeam | null
  winner?: LiveTeam
  round: string
  completed: boolean
  team1Score?: number
  team2Score?: number
  pointsAwarded?: number
}

// Cache upstream responses briefly so rapid client polling doesn't hammer ESPN
export const revalidate = 0

// Build a normalized team object from an ESPN competitor entry
function toTeam(competitor: any, region?: string): LiveTeam | null {
  if (!competitor || !competitor.team) return null
  return {
    // ESPN team id is a string; coerce to a number so it matches the numeric BracketTeam id type
    id: Number(competitor.id ?? competitor.team.id ?? 0),
    name: competitor.team.displayName || competitor.team.name || "TBD",
    // curatedRank.current is the seed for tournament games; default to 0 when unavailable (e.g. NFL)
    seed: Number(competitor.curatedRank?.current ?? competitor.team.seed ?? 0),
    score: competitor.score != null ? Number(competitor.score) : undefined,
    region,
  }
}

// Convert a single ESPN event into our LiveGame shape for a given round label
function toGame(event: any, round: string, region?: string): LiveGame | null {
  const comp = event?.competitions?.[0]
  if (!comp) return null
  const competitors = comp.competitors || []
  // ESPN lists home first; keep a stable order (away @ home) for consistent display
  const home = competitors.find((c: any) => c.homeAway === "home") || competitors[0]
  const away = competitors.find((c: any) => c.homeAway === "away") || competitors[1]
  const team1 = toTeam(away, region)
  const team2 = toTeam(home, region)
  const state = event?.status?.type?.state // "pre" | "in" | "post"
  const completed = state === "post"
  // Determine the winner from ESPN's winner flag
  const awayWon = away?.winner === true
  const homeWon = home?.winner === true
  let winner: LiveTeam | undefined
  if (completed) {
    if (awayWon && team1) winner = { ...team1, score: team1.score }
    else if (homeWon && team2) winner = { ...team2, score: team2.score }
  }
  return {
    id: String(event.id),
    team1,
    team2,
    winner,
    round,
    completed,
    team1Score: team1?.score,
    team2Score: team2?.score,
    // Award 1 point for a win, mirroring the existing bracket's per-win scoring convention
    pointsAwarded: completed ? 1 : undefined,
  }
}

// Fetch helper with a short timeout so a slow upstream never hangs the request
async function fetchJson(url: string) {
  const res = await fetch(url, { headers: { "User-Agent": "calcutta-live-bracket" }, next: { revalidate: 0 } })
  if (!res.ok) throw new Error(`ESPN request failed: ${res.status}`)
  return res.json()
}

// --- NFL: fetch the postseason bracket week-by-week (Wild Card -> Super Bowl) ---
async function getNflBracket(seasonYear: number): Promise<{ rounds: string[]; games: LiveGame[] }> {
  // ESPN NFL postseason weeks: 1=Wild Card, 2=Divisional, 3=Conference Championships, 5=Super Bowl
  const weekToRound: Record<number, string> = {
    1: "Wild Card",
    2: "Divisional Round",
    3: "Conference Championships",
    5: "Super Bowl",
  }
  const rounds = Object.values(weekToRound)
  const games: LiveGame[] = []
  for (const week of [1, 2, 3, 5]) {
    try {
      const url = `https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?seasontype=3&week=${week}&year=${seasonYear}`
      const data = await fetchJson(url)
      for (const event of data.events || []) {
        // ESPN groups conference into the competition's group note; pass it as region when present
        const note = event?.competitions?.[0]?.notes?.[0]?.headline as string | undefined
        const region = note?.includes("AFC") ? "AFC" : note?.includes("NFC") ? "NFC" : undefined
        const game = toGame(event, weekToRound[week], region)
        if (game) games.push(game)
      }
    } catch {
      // Skip a week that fails (e.g. future season with no data yet)
    }
  }
  return { rounds, games }
}

// --- NCAA March Madness: fetch the full tournament date range and bucket by ESPN round headline ---
async function getMarchMadnessBracket(year: number): Promise<{ rounds: string[]; games: LiveGame[] }> {
  // The tournament spans roughly Mar 18 - Apr 8; request the whole window in one call
  const start = `${year}0318`
  const end = `${year}0409`
  const rounds = ["First Four", "First Round", "Second Round", "Sweet 16", "Elite Eight", "Final Four", "Championship"]
  const games: LiveGame[] = []
  try {
    const url = `https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard?dates=${start}-${end}&groups=50&limit=400`
    const data = await fetchJson(url)
    for (const event of data.events || []) {
      // Only include actual NCAA tournament games (season type 3)
      if (event?.season?.type !== 3) continue
      const headline: string = event?.competitions?.[0]?.notes?.[0]?.headline || ""
      // ESPN's postseason feed also contains NIT/CBI/other tournaments. Only the NCAA "March Madness"
      // games carry the "Basketball Championship" headline, so exclude everything else to avoid inflating rounds.
      if (!headline.includes("Basketball Championship")) continue
      // Parse region (e.g. "East Region") and round (e.g. "1st Round") out of the headline
      const regionMatch = headline.match(/-\s*([A-Za-z]+)\s+Region/)
      const region = regionMatch ? regionMatch[1] : undefined
      const round = normalizeNcaaRound(headline)
      const game = toGame(event, round, region)
      if (game) games.push(game)
    }
  } catch {
    // Return whatever we have; the client falls back to static data when empty
  }
  return { rounds, games }
}

// Map ESPN's NCAA headline wording to our canonical round labels
function normalizeNcaaRound(headline: string): string {
  const h = headline.toLowerCase()
  if (h.includes("first four") || h.includes("opening round")) return "First Four"
  if (h.includes("national championship")) return "Championship"
  if (h.includes("final four")) return "Final Four"
  if (h.includes("elite") || h.includes("regional final")) return "Elite Eight"
  if (h.includes("sweet") || h.includes("regional semifinal")) return "Sweet 16"
  if (h.includes("2nd round") || h.includes("second round")) return "Second Round"
  if (h.includes("1st round") || h.includes("first round")) return "First Round"
  return "First Round"
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  // The bracket component passes the tournament NAME (e.g. "NFL Playoffs 2025", "March Madness 2025")
  const name = (searchParams.get("name") || "").trim()

  try {
    // NFL Playoffs (e.g. "NFL Playoffs 2025" => 2024 season postseason, played in 2025)
    const nflPlayoffs = name.match(/NFL Playoffs\s+(\d{4})/i)
    if (nflPlayoffs) {
      const seasonYear = Number(nflPlayoffs[1]) - 1
      const { rounds, games } = await getNflBracket(seasonYear)
      return NextResponse.json({ supported: true, sport: "nfl", rounds, games })
    }

    // Full NFL season (e.g. "2026-2027 NFL Season" => season starting 2026, show its postseason bracket)
    const nflSeason = name.match(/(\d{4})-\d{4}\s+NFL Season/i)
    if (nflSeason) {
      const seasonYear = Number(nflSeason[1])
      const { rounds, games } = await getNflBracket(seasonYear)
      return NextResponse.json({ supported: true, sport: "nfl", rounds, games })
    }

    // March Madness (e.g. "March Madness 2025")
    const marchMadness = name.match(/March Madness\s+(\d{4})/i)
    if (marchMadness) {
      const year = Number(marchMadness[1])
      const { rounds, games } = await getMarchMadnessBracket(year)
      return NextResponse.json({ supported: true, sport: "ncaam", rounds, games })
    }

    // Survivor and anything else have no live sports data source
    return NextResponse.json({ supported: false, reason: "No live data source for this tournament", games: [] })
  } catch (error: any) {
    // On any failure, report unsupported so the client keeps its existing static bracket
    return NextResponse.json({ supported: false, reason: error?.message || "Unknown error", games: [] })
  }
}
