"use server"

import { createClient } from "@/utils/supabase/server"
import { createAdminClient } from "@/utils/supabase/service-role"
import { revalidatePath } from "next/cache"
import { SupabaseClient } from '@supabase/supabase-js'

export interface League {
  id: string
  name: string
  description?: string
}

export interface Team {
  id: string
  name: string
  logo_url?: string
  tournament_id: string
  tournament_name: string
  league_id: string
  league_name: string
  players_count: number // Será 0 hasta que implementemos la tabla de jugadores
  matches_played: number // Será 0 hasta que implementemos la tabla de partidos
  points: number
  created_at: string
}

export interface CreateTeamData {
  name: string
  logo?: File
  tournament_id: string
  league_id: string
}

export async function getTeams(): Promise<{ data: Team[] | null; error: string | null }> {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase
      .from("teams")
      .select(`
        *,
        tournament:tournaments (name),
        league:leagues (name)
      `)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error getting teams:", error)
      return { data: null, error: error.message }
    }

    // Convertir los datos al formato esperado
    const teams: Team[] = data.map(t => ({
      id: t.id,
      name: t.name,
      logo_url: t.logo_url,
      tournament_id: t.tournament_id,
      tournament_name: t.tournament?.name || 'Torneo no encontrado',
      league_id: t.league_id,
      league_name: t.league?.name || 'Liga no encontrada',
      players_count: 0, // Por ahora no tenemos esta información
      matches_played: 0, // Por ahora no tenemos esta información
      points: t.points || 0,
      created_at: t.created_at
    }))

    return { data: teams, error: null }
  } catch (error) {
    console.error("Error getting teams:", error)
    return { data: null, error: "Error al obtener equipos" }
  }
}

interface Bucket {
  id: string
  name: string
  owner: string
  created_at: string
  updated_at: string
  public: boolean
}

async function ensureBucketExists(supabase: SupabaseClient) {
  try {
    // Intentar obtener el bucket
    const { data: buckets, error } = await supabase.storage.listBuckets()
    
    // Verificar si el bucket existe
    const bucketExists = buckets?.some((b: Bucket) => b.name === 'team-logos')
    
    if (!bucketExists) {
      // Crear el bucket si no existe
      const { data, error: createError } = await supabase.storage.createBucket('team-logos', {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif'],
        fileSizeLimit: 2097152 // 2MB en bytes
      })
      
      if (createError) {
        console.error('Error creating bucket:', createError)
        return false
      }
    }
    
    return true
  } catch (error) {
    console.error('Error checking/creating bucket:', error)
    return false
  }
}

export async function createTeam(data: CreateTeamData) {
  const supabase = await createClient()
  const adminClient = await createAdminClient()

  try {
    let logo_url = null

    // 1. Si hay logo, subirlo primero
    if (data.logo) {
      // Asegurar que el bucket existe
      const bucketExists = await ensureBucketExists(adminClient)
      if (!bucketExists) {
        return { error: 'Error al configurar el almacenamiento' }
      }
      const fileExt = data.logo.name.split('.').pop()
      const fileName = `${Math.random().toString(36).slice(2)}.${fileExt}`

      const { data: uploadData, error: uploadError } = await adminClient.storage
        .from('team-logos')
        .upload(fileName, data.logo)

      if (uploadError) {
        console.error('Error uploading logo:', uploadError)
        return { error: 'Error al subir el logo' }
      }

      // Obtener la URL pública del logo
      const { data: publicUrl } = adminClient.storage
        .from('team-logos')
        .getPublicUrl(fileName)

      logo_url = publicUrl.publicUrl
    }

    // 2. Crear el equipo
    const { data: team, error } = await supabase
      .from("teams")
      .insert({
        name: data.name,
        logo_url: logo_url,
        tournament_id: data.tournament_id,
        league_id: data.league_id,
        points: 0
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating team:", error)
      return { error: error.message }
    }

    revalidatePath("/dashboard/teams")
    return { team }
  } catch (error) {
    console.error("Error creating team:", error)
    return { error: "Error al crear equipo" }
  }
}

export async function getLeagues() {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase
      .from("leagues")
      .select("id, name")
      .order("name")

    if (error) {
      console.error("Error getting leagues:", error)
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error) {
    console.error("Error getting leagues:", error)
    return { data: null, error: "Error al obtener ligas" }
  }
}

export async function getTournaments() {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase
      .from("tournaments")
      .select("id, name")
      .order("name")

    if (error) {
      console.error("Error getting tournaments:", error)
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error) {
    console.error("Error getting tournaments:", error)
    return { data: null, error: "Error al obtener torneos" }
  }
}
