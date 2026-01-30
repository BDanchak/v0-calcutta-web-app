export const tournamentDates: { [key: string]: Date } = {
  "March Madness 2025": new Date("2025-03-18"),
  "March Madness Women's 2025": new Date("2025-03-19"),
  "World Cup 2025": new Date("2025-06-11"),
  "NBA Playoffs 2025": new Date("2025-04-19"),
  "NFL Playoffs 2025": new Date("2025-01-11"),
  "Stanley Cup 2025": new Date("2025-04-16"),
  "The Masters 2025": new Date("2025-04-10"),
  "Champions League 2025": new Date("2025-05-31"),
  "The Masters 2026": new Date("2026-04-09"),
  "PGA Championship 2026": new Date("2026-05-14"),
  "U.S. Open 2026": new Date("2026-06-18"),
  "The Open Championship 2026": new Date("2026-07-16"),
  "U.S. Open Tennis 2025": new Date("2025-08-25"),
  "English Premier League 2025": new Date("2025-08-16"),
  "2025 Ryder Cup": new Date("2025-09-26"),
  "2025 Cancun Challenge": new Date("2025-11-25"),
  "NFL Playoffs 2024": new Date("2024-01-13"),
}

export const isTournamentCompleted = (tournamentName: string): boolean => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const tournamentDate = tournamentDates[tournamentName]
  if (!tournamentDate) {
    // If tournament date is unknown, default to not completed
    return false
  }

  // Tournament is completed if its date has passed
  return tournamentDate < today
}
