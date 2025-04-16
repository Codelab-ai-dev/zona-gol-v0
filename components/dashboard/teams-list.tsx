"use client"

import { useState } from "react"
import Link from "next/link"
import { Shield, MoreHorizontal, Edit, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"
import { removeTeamFromTournament } from "@/app/dashboard/tournaments/[id]/teams/actions"

export interface Team {
  id: string
  name: string
  logo_url?: string
  league_name: string
  points: number
  matches_played: number
  created_at: string
}

interface TeamsListProps {
  teams: Team[]
  userRole: string
  tournamentId: string
}

export function TeamsList({ teams, userRole, tournamentId }: TeamsListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  // Filtrar equipos por término de búsqueda
  const filteredTeams = teams.filter(
    (team) =>
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.league_name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Verificar si el usuario puede editar/eliminar equipos
  const canManageTeams = userRole === "admin" || userRole === "super"

  const handleDelete = async (id: string, name: string) => {
    const { error } = await removeTeamFromTournament(id)

    if (error) {
      toast({
        title: "Error",
        description: `No se pudo eliminar el equipo: ${error}`,
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Equipo eliminado",
      description: `El equipo "${name}" ha sido eliminado del torneo.`,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <Input
          placeholder="Buscar equipos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {filteredTeams.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <Shield className="h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-semibold">No se encontraron equipos</h3>
          <p className="mt-2 text-sm text-gray-500">No hay equipos que coincidan con tu búsqueda.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTeams.map((team) => (
            <Card key={team.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                      {team.logo_url ? (
                        <Image
                          src={team.logo_url}
                          alt={team.name}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      ) : (
                        <Shield className="h-6 w-6 text-gray-500" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <CardTitle>{team.name}</CardTitle>
                      <CardDescription>{team.league_name}</CardDescription>
                    </div>
                  </div>
                  {canManageTeams && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Acciones</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/teams/${team.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(team.id, team.name)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Eliminar del Torneo
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Partidos jugados:</span>
                    <span className="text-sm">{team.matches_played}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Puntos:</span>
                    <Badge variant="outline">{team.points}</Badge>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-3">

                <Link href={`/dashboard/teams/${team.id}`}>
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
