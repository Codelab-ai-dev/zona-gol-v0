import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth-utils"
import { getTournamentTeams } from "./actions"
import { TeamsList } from "@/components/dashboard/teams-list"

interface DashboardUser {
  id: string
  role: string
}

export default async function TournamentTeamsPage({
  params,
}: {
  params: { id: string }
}) {
  const user = await getCurrentUser() as DashboardUser | null

  if (!user) {
    redirect("/login")
  }

  const { data: teams, error } = await getTournamentTeams(params.id)

  if (error) {
    return (
      <div className="p-4">
        <p className="text-red-500">Error al cargar equipos: {error}</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Equipos del Torneo</h2>
        <p className="text-gray-500">Administra los equipos participantes en este torneo</p>
      </div>

      <TeamsList teams={teams || []} userRole={user.role} tournamentId={params.id} />
    </div>
  )
}
