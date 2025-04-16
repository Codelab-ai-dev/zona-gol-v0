"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export interface TournamentTeam {
  id: string
  name: string
  logo_url?: string
  league_name: string
  points: number
  matches_played: number
  created_at: string
}

export async function getTournamentTeams(tournamentId: string): Promise<{ data: TournamentTeam[] | null; error: string | null }> {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase
      .from("team_details")
      .select()
      .eq("tournament_id", tournamentId)
      .order("points", { ascending: false })

    if (error) {
      console.error("Error getting tournament teams:", error)
      return { data: null, error: error.message }
    }

    const teams: TournamentTeam[] = data.map(team => ({
      id: team.id,
      name: team.team_name,
      logo_url: team.logo_url,
      league_name: team.league_name,
      points: team.points,
      matches_played: 0, // Por ahora es 0 hasta implementar partidos
      created_at: team.created_at
    }))

    return { data: teams, error: null }
  } catch (error) {
    console.error("Error getting tournament teams:", error)
    return { data: null, error: "Error al obtener equipos del torneo" }
  }
}

export async function removeTeamFromTournament(teamId: string) {
  const supabase = await createClient()

  try {
    const { error } = await supabase
      .from("teams")
      .delete()
      .eq("id", teamId)

    if (error) {
      console.error("Error removing team:", error)
      return { error: error.message }
    }

    revalidatePath("/dashboard/tournaments/[id]/teams")
    return { error: null }
  } catch (error) {
    console.error("Error removing team:", error)
    return { error: "Error al eliminar equipo" }
  }
}
