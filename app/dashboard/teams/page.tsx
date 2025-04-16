import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { getCurrentUser } from "@/lib/auth-utils"
import { TeamsList } from "@/components/dashboard/teams-list"
import { getTeams } from "./actions"

interface DashboardUser {
  id: string
  role: string
}

export default async function TeamsPage() {
  const user = await getCurrentUser() as DashboardUser | null

  if (!user) {
    redirect("/login")
  }

  const { data: teams, error } = await getTeams()

  if (error || !teams) {
    return (
      <div className="p-4">
        <p className="text-red-500">Error al cargar equipos: {error}</p>
      </div>
    )
  }

  // Verificar si el usuario tiene permisos para crear equipos
  const canCreateTeam = user.role === "admin" || user.role === "super" || user.role === "manager"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Equipos</h1>
          <p className="text-gray-500">Gestiona los equipos de fútbol</p>
        </div>
        {canCreateTeam && (
          <Link href="/dashboard/teams/create">
            <Button className="bg-green-600 hover:bg-green-700">
              <PlusCircle className="mr-2 h-4 w-4" />
              Nuevo Equipo
            </Button>
          </Link>
        )}
      </div>

      <TeamsList teams={teams} userRole={user.role} />
    </div>
  )
}
