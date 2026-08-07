export const tournamentDates: { [key: string]: Date } = {
  // Changed to the tournament END date (championship game April 7, 2025) so the league stays in Active
  // for the full live window and only moves to History after the tournament actually finishes per user request
  "March Madness 2025": new Date("2025-04-07"),
  "March Madness Women's 2025": new Date("2025-03-19"),
  "World Cup 2025": new Date("2025-06-11"),
  "NBA Playoffs 2025": new Date("2025-04-19"),
  // Changed to the tournament END date (Super Bowl LIX, February 9, 2025) so the league stays in Active
  // during the entire live playoff window and only shifts to History once the tournament has ended per user request
  "NFL Playoffs 2025": new Date("2025-02-09"),
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
  // Added Survivor 50 end date so its completed leagues shift to League History once the tournament has ended per user request
  "Survivor 50": new Date("2026-05-21"),
  // Added 2026-2027 NFL Season end date (Super Bowl) so its completed leagues shift to League History once the tournament has ended per user request
  "2026-2027 NFL Season": new Date("2027-02-14"),
}

export const isTournamentCompleted = (tournamentName: string): boolean => {
  // Uses new Date() so the active/history split is re-evaluated against the real current date every day per user request
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const tournamentDate = tournamentDates[tournamentName]
  if (!tournamentDate) {
    // If tournament date is unknown, default to not completed
    return false
  }

  // Changed meaning: tournamentDate is the tournament's END date. A tournament counts as completed (→ League History)
  // only once its end date has passed; while it is still live or upcoming it is NOT completed so its leagues stay in
  // the Active Leagues section. This makes "only show in Active if the tournament is live during the current date"
  // (plus upcoming) hold true every day, e.g. finished tournaments like Survivor 50 shift to League History per user request
  return tournamentDate < today
}
