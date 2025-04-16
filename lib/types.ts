export interface UserType {
  id: string
  name: string
  email: string
  role: "super" | "admin" | "manager" | "user"
}

export interface League {
  id: string
  name: string
  slug: string
  description: string
  createdAt: Date
  createdBy: string
}

export interface Tournament {
  id: string
  leagueId: string
  name: string
  description: string
  startDate: Date
  endDate: Date
  status: "upcoming" | "active" | "completed"
}

export interface Team {
  id: string
  tournamentId: string
  name: string
  logo: string
  managerId: string
}

export interface Player {
  id: string
  teamId: string
  name: string
  position: string
  number: number
  stats: PlayerStats
}

export interface PlayerStats {
  goals: number
  assists: number
  yellowCards: number
  redCards: number
}

export interface Match {
  id: string
  tournamentId: string
  homeTeamId: string
  awayTeamId: string
  date: Date
  location: string
  status: "scheduled" | "completed" | "cancelled"
  homeScore?: number
  awayScore?: number
}
