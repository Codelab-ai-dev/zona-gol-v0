import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { getCurrentUser } from "@/lib/auth-utils"
import { TournamentsList } from "@/components/dashboard/tournaments-list"
import type { Tournament } from "@/components/dashboard/tournaments-list"
import { getTournaments } from "./actions"

interface DashboardUser {
  id: string
  role: string
}

export default async function TournamentsPage() {
  const user = await getCurrentUser() as DashboardUser | null

  if (!user) {
    redirect("/login")
  }

  const { data: tournaments, error } = await getTournaments()

  if (error || !tournaments) {
    return (
      <div className="p-4">
        <p className="text-red-500">Error al cargar torneos: {error}</p>
      </div>
    )
  }

  // Verificar si el usuario tiene permisos para crear torneos
  const canCreateTournament = user.role === "admin" || user.role === "super"



  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Torneos</h1>
          <p className="text-gray-500">Gestiona los torneos de fútbol</p>
        </div>
        {canCreateTournament && (
          <Link href="/dashboard/tournaments/create">
            <Button className="bg-green-600 hover:bg-green-700">
              <PlusCircle className="mr-2 h-4 w-4" />
              Nuevo Torneo
            </Button>
          </Link>
        )}
      </div>

      <TournamentsList tournaments={tournaments} userRole={user.role} />
    </div>
  )
}
