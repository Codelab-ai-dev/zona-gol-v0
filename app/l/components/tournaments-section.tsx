'use client'

import { Trophy, Calendar, Users } from "lucide-react"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface Tournament {
  id: string
  name: string
  start_date: string | null
  end_date: string | null
  teams: Array<{ id: string; name: string }>
}

interface TournamentsSectionProps {
  tournaments: Tournament[]
}

export function TournamentsSection({ tournaments }: TournamentsSectionProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Torneos</h2>
          <p className="text-gray-600">Explora los torneos activos y sus detalles</p>
        </div>
      </div>

      {/* Grid de torneos */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tournaments.map(tournament => (
          <Link key={tournament.id} href={`/t/${tournament.id}`}>
            <Card className="hover:bg-green-50 transition-colors cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{tournament.name}</span>
                  <Trophy className="h-5 w-5 text-green-600" />
                </CardTitle>
                <CardDescription>
                  <div className="flex items-center gap-4 text-sm">
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
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Ver detalles del torneo y sus partidos
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}

        {tournaments.length === 0 && (
          <Card className="col-span-full bg-gray-50">
            <CardHeader>
              <CardTitle>No hay torneos</CardTitle>
              <CardDescription>
                No se encontraron torneos activos en esta liga
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>
    </div>
  )
}
