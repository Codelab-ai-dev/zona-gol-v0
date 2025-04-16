import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth-utils"
import { CreateTeamForm } from "@/app/dashboard/teams/create/create-team-form"
import { getTournaments, getLeagues } from "../actions"

interface DashboardUser {
  id: string
  role: string
}

export default async function CreateTeamPage() {
  const user = await getCurrentUser() as DashboardUser | null

  if (!user) {
    redirect("/login")
  }

  // Solo admin, super y manager pueden crear equipos
  const canCreateTeam = user.role === "admin" || user.role === "super" || user.role === "manager"

  if (!canCreateTeam) {
    redirect("/dashboard/teams")
  }

  // Obtener lista de torneos y ligas
  const [tournamentsResult, leaguesResult] = await Promise.all([
    getTournaments(),
    getLeagues()
  ])

  if (tournamentsResult.error || !tournamentsResult.data) {
    return (
      <div className="p-4">
        <p className="text-red-500">Error al cargar torneos: {tournamentsResult.error}</p>
      </div>
    )
  }

  if (leaguesResult.error || !leaguesResult.data) {
    return (
      <div className="p-4">
        <p className="text-red-500">Error al cargar ligas: {leaguesResult.error}</p>
      </div>
    )
  }



  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Crear Equipo</h1>
        <p className="text-gray-500">Ingresa los datos del nuevo equipo</p>
      </div>

      <CreateTeamForm tournaments={tournamentsResult.data} leagues={leaguesResult.data} />
    </div>
  )
}
