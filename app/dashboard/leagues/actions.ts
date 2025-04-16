"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

interface CreateLeagueData {
  name: string
  description: string
}

export async function createLeague(data: CreateLeagueData) {
  const supabase = await createClient()

  // Validar que el nombre no esté vacío
  if (!data.name.trim()) {
    return {
      error: "El nombre de la liga es requerido"
    }
  }

  // Generar slug a partir del nombre
  const slug = data.name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")

  // Crear la liga en la base de datos
  const { data: league, error } = await supabase
    .from("leagues")
    .insert([
      {
        name: data.name,
        slug,
        description: data.description,
      },
    ])
    .select()
    .single()

  if (error) {
    return {
      error: error.message
    }
  }

  revalidatePath("/dashboard/leagues")
  return { league }
}
