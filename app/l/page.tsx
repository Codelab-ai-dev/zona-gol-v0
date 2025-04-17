import { createClient } from "@/utils/supabase/server"
import { notFound } from "next/navigation"
import { 
  Trophy, 
  Shield, 
  CalendarDays, 
  Users, 
  Medal,
  UserPlus,
  Calendar 
} from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Metadata } from "next"
import { TournamentsSection } from "./components/tournaments-section"

type Props = {
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await Promise.resolve(props.searchParams)
  const slug = params.slug
  if (!slug) return { title: "Liga - ZonaGol" }

  const supabase = await createClient()

  const { data: league } = await supabase
    .from("leagues")
    .select("name, description")
    .eq("slug", slug)
    .single()

  return {
    title: league ? `${league.name} - ZonaGol` : "Liga - ZonaGol",
    description: league?.description || "Plataforma de gestión de ligas y torneos de fútbol",
  }
}

export default async function LeaguePage(props: Props) {
  const params = await Promise.resolve(props.searchParams)
  const slug = params.slug
  if (!slug) return notFound()

  const supabase = await createClient()

  // Obtener la liga por su slug
  console.log('Buscando liga con slug:', slug)
  const { data: league, error } = await supabase
    .from("leagues")
    .select(`
      id, 
      name, 
      description, 
      created_at,
      tournaments(id, name, start_date, end_date, teams(id, name))
    `)
    .eq("slug", slug)
    .single()

  console.log('Resultado de la búsqueda:', { league, error })

  // Solo mostrar 404 si hay un error de tipo no encontrado
  if (error?.code === "PGRST116") {
    notFound()
  }

  // Si hay otro tipo de error, mostrarlo en la UI
  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card className="max-w-4xl mx-auto bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600">Hubo un error al cargar la liga. Por favor, intenta de nuevo.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Si no hay liga, mostrar 404
  if (!league) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-green-600 text-white">
        <div className="absolute inset-0 bg-[url('/soccer-pattern.png')] opacity-10"></div>
        <div className="container mx-auto px-4 py-16 relative">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{league.name}</h1>
              <p className="text-green-100 text-lg mb-6">{league.description}</p>
              <div className="flex items-center gap-2 text-sm">
                <CalendarDays className="h-4 w-4" />
                <span>Desde el {" "}
                  {new Date(league.created_at).toLocaleDateString("es-CR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric"
                  })}
                </span>
              </div>
            </div>
            <Trophy className="h-24 w-24 text-green-400 hidden md:block" />
          </div>
        </div>
      </div>

      {/* Características */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-white/50 border-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-600" />
                Competencia
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Participa en torneos emocionantes y demuestra el potencial de tu equipo</p>
            </CardContent>
          </Card>

          <Card className="bg-white/50 border-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                Comunidad
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Forma parte de una comunidad apasionada por el fútbol y haz nuevas conexiones</p>
            </CardContent>
          </Card>

          <Card className="bg-white/50 border-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Medal className="h-5 w-5 text-green-600" />
                Logros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Compite por trofeos y reconocimientos que destaquen tus victorias</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Torneos */}
      <div className="container mx-auto px-4 py-16">
        <TournamentsSection tournaments={league.tournaments || []}/>


        {/* Call to Action */}
        <div className="mt-8">
          <Card className="bg-green-50 border-none">
            <CardHeader>
              <CardTitle className="text-2xl text-green-800">¿Listo para competir?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-green-700">Únete a la liga y sé parte de la emoción del fútbol</p>
              <Button className="bg-green-600 hover:bg-green-700">
                <UserPlus className="mr-2 h-4 w-4" />
                Registrar Equipo
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
