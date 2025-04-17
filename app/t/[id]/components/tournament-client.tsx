'use client'

import { Trophy, Calendar, Users } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tournament } from "../types"
import { MatchesSection } from "./matches-section"
import { BackToLeague } from "./back-to-league"

interface TournamentClientProps {
  tournament: Tournament
}

export function TournamentClient({ tournament }: TournamentClientProps) {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <BackToLeague leagueId={tournament.league_id} />
          </div>
          <h1 className="text-4xl font-bold">{tournament.name}</h1>
          <div className="flex items-center gap-4 text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>
                {tournament.start_date ? new Date(tournament.start_date).toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                }) : 'Fecha no definida'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>{tournament.teams?.length || 0} equipos</span>
            </div>
          </div>
        </div>
        <Trophy className="h-16 w-16 text-green-600" />
      </div>

      {/* Equipos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-green-600" />
            Equipos Participantes
          </CardTitle>
          <CardDescription>
            Lista de equipos registrados en el torneo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tournament.teams?.map(team => (
              <Card key={team.id} className="bg-white">
                <CardHeader>
                  <CardTitle className="text-lg">{team.name}</CardTitle>
                </CardHeader>
              </Card>
            ))}

            {tournament.teams?.length === 0 && (
              <p className="text-gray-500 col-span-full text-center py-4">
                No hay equipos registrados en este torneo
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Partidos */}
      <MatchesSection matches={tournament.matches || []} teams={tournament.teams} />
    </div>
  )
}
