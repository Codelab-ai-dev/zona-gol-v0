import { createClient } from "@/utils/supabase/server"

export interface User {
  id: string
  name: string
  email: string
  role: string
  created_at: string
  isActive: boolean
}

export async function getUsers(): Promise<{ data: User[] | null; error: string | null }> {
  const supabase = await createClient(true)

  try {
    // 1. Obtener usuarios de Auth
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()

    if (authError) {
      console.error("Error getting users from auth:", authError)
      return { data: null, error: authError.message }
    }

    // 2. Obtener perfiles de la base de datos
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, name, role")

    if (profilesError) {
      console.error("Error getting profiles:", profilesError)
      return { data: null, error: profilesError.message }
    }

    // 3. Combinar datos de auth y perfiles
    const users: User[] = authUsers.users.map(authUser => {
      const profile = profiles.find(p => p.id === authUser.id)
      const metadata = authUser.user_metadata || {}
      const bannedUntil = metadata.banned_until as string | null
      const isActive = !bannedUntil || new Date(bannedUntil).getTime() < Date.now()

      return {
        id: authUser.id,
        email: authUser.email || "",
        name: profile?.name || "Usuario sin nombre",
        role: profile?.role || "user",
        created_at: authUser.created_at,
        isActive
      }
    })

    return { data: users, error: null }
  } catch (error) {
    console.error("Error getting users:", error)
    return { data: null, error: "Error al obtener usuarios" }
  }
}
