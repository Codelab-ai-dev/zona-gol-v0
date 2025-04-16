import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { getCurrentUser } from "@/lib/auth-utils"
import { LeaguesList } from "@/components/dashboard/leagues-list"
import { createClient } from "@/utils/supabase/server"

export default async function LeaguesPage() {
  const user = await getCurrentUser()
  console.log(user)
  if (!user) {
    redirect("/login")
  }

  // Verificar si el usuario tiene permisos para crear ligas
  const canCreateLeague = user.role === "super"

  // Obtener las ligas de Supabase
  const supabase = await createClient()

  const { data: rawLeagues, error } = await supabase
    .from('leagues')
    .select(`
      id,
      name,
      slug,
      description,
      created_at
    `)
    .order('name')

  console.log('Ligas encontradas:', { rawLeagues, error })

  const leagues = rawLeagues?.map(league => ({
    id: league.id,
    name: league.name,
    slug: league.slug,
    description: league.description,
    createdAt: new Date(league.created_at),
    createdBy: "Admin",
    tournaments: 0, // Por ahora no tenemos torneos
    teams: 0, // Por ahora no tenemos equipos
  })) || []

  if (error) {
    console.error('Error fetching leagues:', error)
    return (
      <div className="p-4 text-red-500">
        Error al cargar las ligas. Por favor, intenta de nuevo.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Ligas</h1>
          <p className="text-gray-500">Gestiona las ligas de fútbol</p>
        </div>
        {canCreateLeague && (
          <Link href="/dashboard/leagues/create">
            <Button className="bg-green-600 hover:bg-green-700">
              <PlusCircle className="mr-2 h-4 w-4" />
              Nueva Liga
            </Button>
          </Link>
        )}
      </div>

      <LeaguesList leagues={leagues} userRole={user.role} />
    </div>
  )
}
