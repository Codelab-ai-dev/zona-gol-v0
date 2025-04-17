export interface Tournament {
  id: string
  name: string
  start_date: string | null
  end_date: string | null
  league_id: string
  teams: Array<{
    id: string
    name: string
  }>
  matches: Array<{
    id: string
    matchday: number
    home_team_id: string
    away_team_id: string
    home_score: number | null
    away_score: number | null
    status: string
  }>
}
