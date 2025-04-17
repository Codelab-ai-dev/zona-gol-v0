export interface MatchResult {
  id: string
  home_score: number
  away_score: number
  recorded_by_name: string
  notes?: string
  created_at: string
}

export interface Match {
  id: string
  tournament_id: string
  home_team_id: string
  away_team_id: string
  home_team_name: string
  away_team_name: string
  matchday: number
  date: string
  time: string
  status: 'pending' | 'completed'
  home_score?: number
  away_score?: number
  results?: MatchResult[]
}

export interface Tournament {
  id: string
  name: string
  teams: {
    id: string
    name: string
  }[]
}
