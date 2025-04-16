"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

interface CreateUserData {
  name: string
  email: string
  password: string
  role: string
}

export async function createUser(data: CreateUserData) {
  console.log('Iniciando creación de usuario:', { email: data.email, role: data.role })
  const supabase = await createClient(true) // Use admin client

  try {
    // 0. Verificar si el usuario ya existe
    const { data: existingUser } = await supabase.auth.admin.listUsers()
    const userExists = existingUser?.users?.some(user => user.email === data.email)
    
    if (userExists) {
      return { error: 'Ya existe un usuario con este correo electrónico' }
    }

    // 1. Crear el usuario en Authentication
    console.log('Intentando crear usuario en Auth...')
    console.log('Datos de creación:', { email: data.email })
    let authResult
    try {
      // Validar datos requeridos
      if (!data.email || !data.password || !data.name || !data.role) {
        throw new Error('Todos los campos son requeridos')
      }

      // Validar formato de email
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        throw new Error('El formato del correo electrónico no es válido')
      }

      // Validar longitud de contraseña
      if (data.password.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres')
      }

      authResult = await supabase.auth.admin.createUser({
        email: data.email,
        password: data.password,
        email_confirm: true,
        user_metadata: {
          name: data.name,
          role: data.role
        }
      })
      console.log('Respuesta de auth:', authResult)
    } catch (authError) {
      console.error('Error en auth.admin.createUser:', authError)
      return { error: 'Error al crear el usuario en autenticación: ' + (authError instanceof Error ? authError.message : String(authError)) }
    }

    const { data: authData, error: authError } = authResult

    if (authError) {
      return {
        error: authError.message
      }
    }

    if (!authData.user) {
      return {
        error: "No se pudo crear el usuario"
      }
    }

    // 2. Crear o actualizar perfil en la base de datos
    const profileData = {
      id: authData.user.id,
      name: data.name,
      role: data.role
    }

    console.log("Intentando crear/actualizar perfil...")
    console.log("Datos del perfil:", profileData)

    // Primero intentamos obtener el perfil existente
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select()
      .eq("id", profileData.id)
      .single()

    let profileError

    if (existingProfile) {
      // Si existe, actualizamos
      const { error: updateError } = await supabase
        .from("profiles")
        .update(profileData)
        .eq("id", profileData.id)
      profileError = updateError
    } else {
      // Si no existe, insertamos
      const { error: insertError } = await supabase
        .from("profiles")
        .insert(profileData)
      profileError = insertError
    }

    if (profileError) {
      console.error("Error al crear/actualizar perfil:", profileError)
      // Si falla la creación del perfil, eliminar el usuario de Auth
      await supabase.auth.admin.deleteUser(authData.user.id)
      return {
        error: profileError.message,
      }
    }

    console.log('Perfil creado/actualizado:', profileData)

    // 3. Revalidar la página de usuarios
    console.log('Perfil creado exitosamente')
    revalidatePath("/dashboard/users")

    return {
      success: true,
      message: "Usuario creado exitosamente"
    }

  } catch (error) {
    console.error("Error creating user:", error)
    // Mostrar el error específico para debugging
    const errorMessage = error instanceof Error ? error.message : JSON.stringify(error)
    return {
      error: `Error interno del servidor: ${errorMessage}`
    }
  }
}
