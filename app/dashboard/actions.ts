import { createClient } from "@/utils/supabase/server"

export interface DashboardStats {
  totalTournaments: number
  activeTournaments: number
  totalTeams: number
  totalLeagues: number
  recentTournaments: {
    id: string
    name: string
    status: string
    teams_count: number
    created_at: string
  }[]
  topTeams: {
    id: string
    name: string
    points: number
    tournament_name: string
  }[]
}

interface League {
  id: string
  name: string
  teams_count: number
  tournaments_count: number
  created_at: string
}

interface Match {
  id: string
  home_team: { name: string }
  away_team: { name: string }
  date: string
  time: string
}

interface Player {
  id: string
  name: string
  team: { name: string }
  goals: number
}

export async function getDashboardStats(): Promise<{ data: DashboardStats | null; error: string | null }> {
  const supabase = await createClient()

  try {
    // Obtener estadísticas de torneos
    const [tournamentsResult, teamsResult, leaguesResult] = await Promise.all([
      supabase
        .from("tournaments")
        .select("id, status")
        .order("created_at", { ascending: false }),
      supabase
        .from("teams")
        .select("id"),
      supabase
        .from("leagues")
        .select("id")
    ])

    if (tournamentsResult.error) {
      console.error("Error getting tournaments:", tournamentsResult.error)
      return { data: null, error: tournamentsResult.error.message }
    }

    if (teamsResult.error) {
      console.error("Error getting teams:", teamsResult.error)
      return { data: null, error: teamsResult.error.message }
    }

    if (leaguesResult.error) {
      console.error("Error getting leagues:", leaguesResult.error)
      return { data: null, error: leaguesResult.error.message }
    }

    // Obtener torneos recientes con conteo de equipos
    const { data: recentTournaments, error: recentError } = await supabase
      .from("tournaments")
      .select(`
        id,
        name,
        status,
        created_at,
        teams:teams(id)
      `)
      .order("created_at", { ascending: false })
      .limit(5)

    if (recentError) {
      console.error("Error getting recent tournaments:", recentError)
      return { data: null, error: recentError.message }
    }

    // Obtener equipos con más puntos
    const { data: topTeams, error: topTeamsError } = await supabase
      .from("team_details")
      .select("id, team_name, points, tournament_name")
      .order("points", { ascending: false })
      .limit(5)

    if (topTeamsError) {
      console.error("Error getting top teams:", topTeamsError)
      return { data: null, error: topTeamsError.message }
    }

    const stats: DashboardStats = {
      totalTournaments: tournamentsResult.data.length,
      activeTournaments: tournamentsResult.data.filter(t => t.status === "active").length,
      totalTeams: teamsResult.data.length,
      totalLeagues: leaguesResult.data.length,
      recentTournaments: recentTournaments.map(t => ({
        id: t.id,
        name: t.name,
        status: t.status,
        teams_count: t.teams?.length || 0,
        created_at: t.created_at
      })),
      topTeams: topTeams.map(t => ({
        id: t.id,
        name: t.team_name,
        points: t.points,
        tournament_name: t.tournament_name
      }))
    }

    return { data: stats, error: null }
  } catch (error) {
    console.error("Error getting dashboard stats:", error)
    return { data: null, error: "Error al obtener estadísticas del dashboard" }
  }
}
















