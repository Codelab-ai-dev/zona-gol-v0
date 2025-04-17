'use server'

import { createClient } from "@/utils/supabase/server"

interface Match {
  id: string
  tournament_id: string
  home_team_id: string
  away_team_id: string
  status: string
  home_score: number
  away_score: number
  home_team: { id: string; name: string }[]
  away_team: { id: string; name: string }[]
}

interface TeamStats {
  team_id: string
  team_name: string
  matches_played: number
  wins: number
  draws: number
  losses: number
  goals_for: number
  goals_against: number
  goal_difference: number
  points: number
}

interface TournamentStats {
  tournament_id: string
  tournament_name: string
  teams: TeamStats[]
}

export async function getStatistics() {
  const supabase = await createClient()

  try {
    console.log('Obteniendo estadísticas...')
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    console.log('Supabase URL:', supabaseUrl)
    console.log('Supabase Key:', supabaseKey?.substring(0, 8) + '...')

    // 1. Obtener todos los torneos activos
    const { data: tournaments, error: tournamentsError } = await supabase
      .from('tournaments')
      .select('id, name')

    console.log('Torneos encontrados:', tournaments)

    if (tournamentsError) throw tournamentsError

    const tournamentStats: TournamentStats[] = []

    // 2. Para cada torneo, obtener estadísticas de sus equipos
    for (const tournament of tournaments) {
      console.log('Procesando torneo:', tournament.name)

      // 1. Obtener los partidos completados
      const { data: matches, error: matchesError } = await supabase
        .from('matches')
        .select(`
          id,
          tournament_id,
          home_team_id,
          away_team_id,
          status,
          home_score,
          away_score,
          home_team:teams!home_team_id(id, name),
          away_team:teams!away_team_id(id, name)
        `)
        .eq('tournament_id', tournament.id)
        .eq('status', 'completed')

      console.log('Partidos completados encontrados:', matches)

      if (matchesError) throw matchesError

      // Continuar solo si hay partidos completados
      if (!matches?.length) {
        tournamentStats.push({
          tournament_id: tournament.id,
          tournament_name: tournament.name,
          teams: []
        })
        continue
      }

      // 3. Obtener todos los equipos del torneo con sus nombres
      const { data: teams, error: teamsError } = await supabase
        .from('teams')
        .select(`
          id,
          name,
          tournament_id
        `)
        .eq('tournament_id', tournament.id)

      console.log('Equipos encontrados:', teams)

      if (teamsError) throw teamsError

      // 4. Calcular estadísticas para cada equipo
      console.log('Calculando estadísticas para equipos...')
      const teamStats: TeamStats[] = teams.map(team => {
        const stats = {
          team_id: team.id,
          team_name: team.name,
          matches_played: 0,
          wins: 0,
          draws: 0,
          losses: 0,
          goals_for: 0,
          goals_against: 0,
          goal_difference: 0,
          points: 0
        }

        matches?.forEach((match: Match) => {
          console.log('Procesando partido:', {
        id: match.id,
        home_team: match.home_team?.[0]?.name,
        away_team: match.away_team?.[0]?.name,
        home_score: match.home_score,
        away_score: match.away_score
      })
          if (match.home_team_id === team.id || match.away_team_id === team.id) {
            stats.matches_played++

            if (match.home_team_id === team.id) {
              const homeScore = match.home_score || 0
              const awayScore = match.away_score || 0
              stats.goals_for += homeScore
              stats.goals_against += awayScore

              if (homeScore > awayScore) {
                stats.wins++
                stats.points += 3
              } else if (homeScore === awayScore) {
                stats.draws++
                stats.points += 1
              } else {
                stats.losses++
              }
            } else {
              const homeScore = match.home_score || 0
              const awayScore = match.away_score || 0
              stats.goals_for += awayScore
              stats.goals_against += homeScore

              if (awayScore > homeScore) {
                stats.wins++
                stats.points += 3
              } else if (awayScore === homeScore) {
                stats.draws++
                stats.points += 1
              } else {
                stats.losses++
              }
            }
          }
        })

        stats.goal_difference = stats.goals_for - stats.goals_against
        return stats
      })

      // 5. Ordenar equipos por puntos y diferencia de goles
      teamStats.sort((a, b) => {
        if (a.points !== b.points) {
          return b.points - a.points
        }
        return b.goal_difference - a.goal_difference
      })

      tournamentStats.push({
        tournament_id: tournament.id,
        tournament_name: tournament.name,
        teams: teamStats
      })
    }

    console.log('Estadísticas finales:', tournamentStats)
    return { data: tournamentStats, error: null }
  } catch (error) {
    console.error('Error:', error)
    return { data: null, error: 'Error al obtener las estadísticas' }
  }
}
