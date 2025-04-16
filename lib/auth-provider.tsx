"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { UserType } from "./types"

interface AuthContextType {
  user: UserType | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserType | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Aquí se implementaría la lógica para verificar la sesión del usuario
    // Por ahora, simulamos una carga de usuario
    const checkAuth = async () => {
      try {
        // Simulación de verificación de autenticación
        const storedUser = localStorage.getItem("zona-gol-user")

        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error("Error al verificar autenticación:", error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
