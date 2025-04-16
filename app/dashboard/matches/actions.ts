'use server'

import { createClient } from "@/utils/supabase/server"

type TeamResponse = {
  id: string
  name: string
}

type MatchResponse = {
  id: string
  tournament_id: string
  home_team_id: string
  away_team_id: string
  matchday: number
  date: string
  time: string
  status: 'pending' | 'completed'
  home_score?: number
  away_score?: number
  home_team: TeamResponse
  away_team: TeamResponse
}

interface Database {
  public: {
    Tables: {
      matches: {
        Row: {
          id: string
          tournament_id: string
          home_team_id: string
          away_team_id: string
          matchday: number
          date: string
          time: string
          status: 'pending' | 'completed'
          home_score?: number
          away_score?: number
        }
      }
      teams: {
        Row: {
          id: string
          name: string
        }
      }
    }
  }
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
}

export interface Tournament {
  id: string
  name: string
  teams: {
    id: string
    name: string
  }[]
}

export async function getMatches() {
  const supabase = await createClient()
  console.log('Obteniendo partidos...')

  try {
    const { data: matches, error } = await supabase
      .from('matches')
      .select(`
        *,
        home_team:teams!home_team_id(id, name),
        away_team:teams!away_team_id(id, name)
      `)
      .order('matchday', { ascending: true })
      .order('date', { ascending: true })
      .order('time', { ascending: true })

    const typedMatches = matches as unknown as MatchResponse[]

    if (error) {
      console.error('Error fetching matches:', error)
      return { data: null, error: error.message }
    }

    const formattedMatches = typedMatches.map(match => ({
      id: match.id,
      tournament_id: match.tournament_id,
      home_team_id: match.home_team_id,
      away_team_id: match.away_team_id,
      home_team_name: (match.home_team as TeamResponse)?.name || 'Equipo Local',
      away_team_name: (match.away_team as TeamResponse)?.name || 'Equipo Visitante',
      matchday: match.matchday,
      date: match.date,
      time: match.time,
      status: match.status,
      home_score: match.home_score,
      away_score: match.away_score
    }))

    console.log('Partidos encontrados:', formattedMatches)
    return { data: formattedMatches, error: null }
  } catch (error) {
    console.error('Error:', error)
    return { data: null, error: 'Error al obtener los partidos' }
  }
}

export async function getTournaments() {
  const supabase = await createClient()
  console.log('Obteniendo torneos...')

  try {
    const { data: tournaments, error } = await supabase
      .from('tournaments')
      .select(`
        id,
        name,
        teams (
          id,
          name
        )
      `)

    if (error) {
      console.error('Error fetching tournaments:', error)
      return { data: null, error: error.message }
    }

    console.log('Torneos encontrados:', tournaments)
    return { data: tournaments, error: null }
  } catch (error) {
    console.error('Error:', error)
    return { data: null, error: 'Error al obtener los torneos' }
  }
}

interface ScheduleMatch {
  home_team_id: string
  away_team_id: string
  matchday: number
}

function generateRoundRobinSchedule(teams: { id: string; name: string }[]): ScheduleMatch[] {
  const numTeams = teams.length
  const rounds = numTeams - 1
  const matchesPerRound = Math.floor(numTeams / 2)
  const schedule: ScheduleMatch[] = []

  // Crear una copia de los equipos para manipular
  const teamsCopy = [...teams]
  
  // Si hay un número impar de equipos, agregar un "bye" (descanso)
  if (numTeams % 2 !== 0) {
    teamsCopy.push({ id: 'bye', name: 'Descanso' })
  }

  // Generar calendario usando el algoritmo de round-robin
  for (let round = 0; round < rounds * 2; round++) {
    const roundMatches: ScheduleMatch[] = []

    for (let match = 0; match < matchesPerRound; match++) {
      const home = match
      const away = teamsCopy.length - 1 - match

      // No crear partido si uno de los equipos es "bye"
      if (teamsCopy[home].id !== 'bye' && teamsCopy[away].id !== 'bye') {
        roundMatches.push({
          home_team_id: round < rounds ? teamsCopy[home].id : teamsCopy[away].id,
          away_team_id: round < rounds ? teamsCopy[away].id : teamsCopy[home].id,
          matchday: round + 1
        })
      }
    }

    schedule.push(...roundMatches)

    // Rotar equipos para la siguiente ronda (el primer equipo se mantiene fijo)
    const lastTeam = teamsCopy[teamsCopy.length - 1]
    for (let i = teamsCopy.length - 1; i > 1; i--) {
      teamsCopy[i] = teamsCopy[i - 1]
    }
    teamsCopy[1] = lastTeam
  }

  return schedule
}

export async function generateMatchSchedule(formData: FormData) {
  try {
    console.log('Iniciando generación de calendario...')
    const tournamentId = formData.get('tournamentId') as string
    const startDate = formData.get('startDate') as string
    const defaultTime = formData.get('defaultTime') as string
    
    if (!tournamentId || !startDate || !defaultTime) {
      console.error('Faltan datos del formulario:', { tournamentId, startDate, defaultTime })
      throw new Error('Faltan datos requeridos del formulario')
    }

    const supabase = await createClient()
    console.log('Tournament ID:', tournamentId)
    console.log('Start Date:', startDate)
    console.log('Default Time:', defaultTime)

    // 1. Obtener los equipos del torneo
    const { data: teams, error: teamsError } = await supabase
      .from('teams')
      .select('id, name')
      .eq('tournament_id', tournamentId)

    console.log('Teams found:', teams)
    console.log('Teams error:', teamsError)

    if (teamsError) {
      console.error('Error al obtener equipos:', teamsError)
      throw new Error(`Error al obtener los equipos: ${teamsError.message}`)
    }

    if (!teams || teams.length < 2) {
      console.error('No hay suficientes equipos:', teams)
      throw new Error('Se necesitan al menos 2 equipos para generar el calendario')
    }

    // 2. Generar el calendario usando round-robin
    const schedule = generateRoundRobinSchedule(teams)
    console.log('Generated schedule:', schedule)

    // 3. Preparar los partidos para insertar
    const parsedStartDate = new Date(startDate)
    const matches = schedule.map((match, index) => ({
      tournament_id: tournamentId,
      home_team_id: match.home_team_id,
      away_team_id: match.away_team_id,
      matchday: match.matchday,
      // Cada partido se programa con 7 días de diferencia
      date: new Date(parsedStartDate.getTime() + (7 * Math.floor(index / (teams.length / 2)) * 24 * 60 * 60 * 1000))
        .toISOString()
        .split('T')[0],
      time: defaultTime,
      status: 'pending'
    }))

    // 4. Insertar los partidos en la base de datos
    console.log('Matches to insert:', matches)

    const { error: insertError } = await supabase
      .from('matches')
      .insert(matches)

    console.log('Insert error:', insertError)

    if (insertError) {
      console.error('Error al insertar partidos:', insertError)
      throw new Error(`Error al insertar los partidos: ${insertError.message}`)
    }

    return
  } catch (error) {
    console.error('Error al generar calendario:', error)
    if (error instanceof Error) {
      throw error
    } else {
      throw new Error('Error desconocido al generar el calendario de partidos')
    }
  }
}

export async function updateMatchResult(
  matchId: string,
  homeScore: number,
  awayScore: number
) {
  const supabase = await createClient()

  try {
    const { error } = await supabase
      .from('matches')
      .update({
        home_score: homeScore,
        away_score: awayScore,
        status: 'completed'
      })
      .eq('id', matchId)

    if (error) {
      throw new Error('Error al actualizar el resultado')
    }

    return { data: true, error: null }
  } catch (error) {
    console.error('Error:', error)
    return { data: null, error: 'Error al actualizar el resultado del partido' }
  }
}
