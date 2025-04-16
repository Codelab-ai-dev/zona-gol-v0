import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Users, Calendar, Shield, Activity } from "lucide-react"
import { getCurrentUser } from "@/lib/auth-utils"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { getDashboardStats } from "./actions"

interface DashboardUser {
  id: string
  role: string
  league_id?: string
  team_id?: string
}

export default async function DashboardPage() {
  const user = await getCurrentUser() as DashboardUser | null

  if (!user) {
    redirect("/login")
  }

  // Obtener estadísticas del dashboard
  const { data: stats, error } = await getDashboardStats()

  if (error) {
    return <div>Error al cargar el dashboard</div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="text-gray-500">Bienvenido al panel de control de Zona-Gol</p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <DashboardStats
          title="Torneos Activos"
          value={stats?.activeTournaments.toString() || "0"}
          description="Total de torneos activos"
          icon={<Calendar className="h-5 w-5 text-green-600" />}
        />
        <DashboardStats
          title="Torneos"
          value={stats?.totalTournaments.toString() || "0"}
          description="Total de torneos"
          icon={<Trophy className="h-5 w-5 text-green-600" />}
        />
        <DashboardStats
          title="Equipos"
          value={stats?.totalTeams.toString() || "0"}
          description="Equipos registrados"
          icon={<Shield className="h-5 w-5 text-green-600" />}
        />
        <DashboardStats
          title="Ligas"
          value={stats?.totalLeagues.toString() || "0"}
          description="Ligas registradas"
          icon={<Users className="h-5 w-5 text-green-600" />}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Torneos Recientes</CardTitle>
            <CardDescription>Últimos torneos creados</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentActivity
              items={stats?.recentTournaments.map(tournament => ({
                id: tournament.id,
                title: tournament.name,
                description: `${tournament.teams_count} equipos, ${tournament.status}`,
                icon: <Trophy className="h-4 w-4" />
              })) || []}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Equipos Destacados</CardTitle>
            <CardDescription>Equipos con más puntos</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentActivity
              items={stats?.topTeams.map(team => ({
                id: team.id,
                title: team.name,
                description: `${team.points} puntos - ${team.tournament_name}`,
                icon: <Shield className="h-4 w-4" />
              })) || []}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
