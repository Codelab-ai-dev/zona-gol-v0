"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import type { Tournament } from "@/components/dashboard/tournaments-list"

interface CreateTournamentData {
  name: string
  leagueId: string
  description: string
  startDate: Date
  endDate: Date
}

export async function getLeagues() {
  const supabase = await createClient()

  const { data: leagues, error } = await supabase
    .from('leagues')
    .select('id, name')
    .order('name')

  if (error) {
    return {
      error: error.message
    }
  }

  return { leagues }
}

export async function createTournament(data: CreateTournamentData) {
  const supabase = await createClient()

  // Verificar que la fecha de inicio sea anterior a la fecha de fin
  if (data.startDate >= data.endDate) {
    return {
      error: "La fecha de inicio debe ser anterior a la fecha de fin",
    }
  }

  // Crear el torneo en la base de datos
  const { data: tournament, error } = await supabase
    .from("tournaments")
    .insert([
      {
        name: data.name,
        league_id: data.leagueId,
        description: data.description,
        start_date: data.startDate.toISOString(),
        end_date: data.endDate.toISOString(),
        status: "upcoming",
        teams: 0,
      },
    ])
    .select()
    .single()

  if (error) {
    return {
      error: error.message,
    }
  }

  revalidatePath("/dashboard/tournaments")
  return { tournament }
}
