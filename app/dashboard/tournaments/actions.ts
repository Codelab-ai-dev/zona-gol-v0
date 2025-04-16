"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import type { Tournament } from "@/components/dashboard/tournaments-list"

export async function getTournaments(): Promise<{ data: Tournament[] | null; error: string | null }> {
  const supabase = await createClient()

  try {
    const { data: tournaments, error: tournamentsError } = await supabase
      .from("tournaments")
      .select()
      .order("start_date", { ascending: false })

    if (tournamentsError) {
      console.error("Error getting tournaments:", tournamentsError)
      return { data: null, error: tournamentsError.message }
    }

    // Obtener el conteo de equipos para cada torneo
    const teamsCountPromises = tournaments.map(async (tournament) => {
      const { count, error: countError } = await supabase
        .from("teams")
        .select("id", { count: "exact" })
        .eq("tournament_id", tournament.id)

      if (countError) {
        console.error(`Error getting teams count for tournament ${tournament.id}:`, countError)
        return 0
      }

      return count || 0
    })

    const teamsCounts = await Promise.all(teamsCountPromises)



    // Convertir los datos al formato esperado
    const formattedTournaments = tournaments.map((t, index) => ({
      id: t.id,
      name: t.name,
      description: t.description,
      startDate: new Date(t.start_date),
      endDate: new Date(t.end_date),
      status: t.status,
      teams: teamsCounts[index],
      created_at: t.created_at,
    }))

    return { data: formattedTournaments, error: null }
  } catch (error) {
    console.error("Error getting tournaments:", error)
    return { data: null, error: "Error al obtener torneos" }
  }
}

interface CreateTournamentData {
  name: string
  description: string
  startDate: Date
  endDate: Date
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
