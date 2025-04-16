"use client"

import { useState } from "react"
import Link from "next/link"
import { Trophy, MoreHorizontal, Calendar, Shield, Edit, Trash, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

interface League {
  id: string
  name: string
  slug: string
  description: string
  createdAt: Date
  createdBy: string
  tournaments: number
  teams: number
}

interface LeaguesListProps {
  leagues: League[]
  userRole: string
}

export function LeaguesList({ leagues, userRole }: LeaguesListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  // Filtrar ligas por término de búsqueda
  const filteredLeagues = leagues.filter(
    (league) =>
      league.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      league.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Verificar si el usuario puede editar/eliminar ligas
  const canManageLeagues = userRole === "super"

  const handleDelete = (id: string, name: string) => {
    // Aquí iría la lógica para eliminar la liga
    toast({
      title: "Liga eliminada",
      description: `La liga "${name}" ha sido eliminada correctamente.`,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Buscar ligas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {filteredLeagues.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <Trophy className="h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-semibold">No se encontraron ligas</h3>
          <p className="mt-2 text-sm text-gray-500">No hay ligas que coincidan con tu búsqueda.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredLeagues.map((league) => (
            <Card key={league.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle>{league.name}</CardTitle>
                    <CardDescription>Creada el {league.createdAt.toLocaleDateString('es-CR', { day: '2-digit', month: '2-digit', year: 'numeric' })}</CardDescription>
                  </div>
                  {canManageLeagues && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Acciones</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/leagues/${league.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(league.id, league.name)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">{league.description}</p>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{league.tournaments} torneos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{league.teams} equipos</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-3">
                <Link href={`/l?slug=${league.slug}`} target="_blank">
                  <Button variant="outline" size="sm" className="gap-1">
                    <ExternalLink className="h-3.5 w-3.5" />
                    Ver sitio
                  </Button>
                </Link>
                <Link href={`/dashboard/leagues/${league.id}`}>
                  <Button size="sm" className="gap-1 bg-green-600 hover:bg-green-700">
                    Gestionar
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
