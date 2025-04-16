"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

interface UpdateUserData {
  id: string
  name: string
  email: string
  role: string
  isActive: boolean
  password?: string
}

export async function getUser(id: string) {
  const supabase = await createClient(true)

  try {
    // 1. Obtener el usuario de Auth
    const { data: authData, error: authError } = await supabase.auth.admin.getUserById(id)

    if (authError) {
      return { error: authError.message }
    }

    if (!authData.user) {
      return { error: "Usuario no encontrado" }
    }

    // 2. Obtener el perfil del usuario
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single()

    if (profileError) {
      return { error: profileError.message }
    }

    // Verificar si el usuario está baneado
    const metadata = authData.user.user_metadata || {}
    const bannedUntil = metadata.banned_until as string | null
    const isActive = !bannedUntil || new Date(bannedUntil).getTime() < Date.now()

    return {
      data: {
        id: authData.user.id,
        email: authData.user.email,
        name: profile.name,
        role: profile.role,
        isActive
      }
    }
  } catch (error) {
    console.error("Error getting user:", error)
    return { error: "Error al obtener el usuario" }
  }
}

export async function updateUser(data: UpdateUserData) {
  const supabase = await createClient(true)

  try {
    // 1. Actualizar el perfil
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        name: data.name,
        role: data.role,
      })
      .eq("id", data.id)

    if (profileError) {
      return { error: profileError.message }
    }

    // 2. Actualizar el email si cambió
    const { data: userData, error: getUserError } = await supabase.auth.admin.getUserById(data.id)
    
    if (getUserError) {
      return { error: getUserError.message }
    }

    if (userData.user.email !== data.email) {
      const { error: updateAuthError } = await supabase.auth.admin.updateUserById(
        data.id,
        { email: data.email }
      )

      if (updateAuthError) {
        return { error: updateAuthError.message }
      }
    }

    // 3. Actualizar la contraseña si se proporcionó una nueva
    if (data.password) {
      const { error: passwordError } = await supabase.auth.admin.updateUserById(
        data.id,
        { password: data.password }
      )

      if (passwordError) {
        return { error: passwordError.message }
      }
    }

    // 4. Actualizar el estado del usuario (activo/inactivo)
    const { error: banError } = await supabase.auth.admin.updateUserById(
      data.id,
      { 
        user_metadata: {
          banned_until: data.isActive ? null : '2100-01-01T00:00:00Z'
        }
      }
    )

    if (banError) {
      return { error: banError.message }
    }

    // 5. Revalidar la página de usuarios
    revalidatePath("/dashboard/users")

    return {
      success: true,
      message: "Usuario actualizado exitosamente"
    }

  } catch (error) {
    console.error("Error updating user:", error)
    return { error: "Error al actualizar el usuario" }
  }
}
