"use client"

import { useState } from "react"
import Link from "next/link"
import { Calendar, MoreHorizontal, Shield, Edit, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"

export interface Tournament {
  id: string
  name: string
  description: string
  startDate: Date
  endDate: Date
  status: "upcoming" | "active" | "completed"
  teams: number
  created_at: string
}

interface TournamentsListProps {
  tournaments: Tournament[]
  userRole: string
}

export function TournamentsList({ tournaments, userRole }: TournamentsListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  // Filtrar torneos por término de búsqueda
  const filteredTournaments = tournaments.filter(
    (tournament) =>
      tournament.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tournament.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Verificar si el usuario puede editar/eliminar torneos
  const canManageTournaments = userRole === "admin" || userRole === "super"

  const handleDelete = (id: string, name: string) => {
    // Aquí iría la lógica para eliminar el torneo
    toast({
      title: "Torneo eliminado",
      description: `El torneo "${name}" ha sido eliminado correctamente.`,
    })
  }

  // Función para obtener el color de la insignia según el estado
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Activo</Badge>
      case "upcoming":
        return <Badge className="bg-blue-500">Próximo</Badge>
      case "completed":
        return <Badge variant="outline">Completado</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Buscar torneos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {filteredTournaments.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <Calendar className="h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-semibold">No se encontraron torneos</h3>
          <p className="mt-2 text-sm text-gray-500">No hay torneos que coincidan con tu búsqueda.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTournaments.map((tournament) => (
            <Card key={tournament.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle>{tournament.name}</CardTitle>

                  </div>
                  {canManageTournaments && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Acciones</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/tournaments/${tournament.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(tournament.id, tournament.name)}
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
                <p className="text-sm text-gray-500">{tournament.description}</p>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Estado:</span>
                    {getStatusBadge(tournament.status)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Fecha inicio:</span>
                    <span className="text-sm">{tournament.startDate.toLocaleDateString('es-CR', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Fecha fin:</span>
                    <span className="text-sm">{tournament.endDate.toLocaleDateString('es-CR', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Equipos:</span>
                    <div className="flex items-center gap-1">
                      <Shield className="h-3.5 w-3.5 text-gray-500" />
                      <span className="text-sm">{tournament.teams}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-3">
                <Link href={`/dashboard/tournaments/${tournament.id}/teams`}>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Shield className="h-3.5 w-3.5" />
                    Equipos
                  </Button>
                </Link>
                <Link href={`/dashboard/tournaments/${tournament.id}`}>
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
