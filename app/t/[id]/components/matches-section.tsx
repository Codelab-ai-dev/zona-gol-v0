'use client'

import { useState } from "react"
import { Calendar } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type Match = {
  id: string
  matchday: number
  home_team_id: string
  away_team_id: string
  home_score: number | null
  away_score: number | null
  status: string
}

interface MatchesSectionProps {
  matches: Match[]
  teams: Array<{
    id: string
    name: string
  }>
}

export function MatchesSection({ matches, teams }: MatchesSectionProps) {
  // Agrupar partidos por jornada eliminando duplicados por ID
  const matchesByRound = matches.reduce<Record<number, Match[]>>((acc, match) => {
    const matchday = match.matchday;
    
    if (!acc[matchday]) {
      acc[matchday] = [];
    }

    // Verificar si ya existe un partido con el mismo ID
    const existingMatch = acc[matchday].find(m => m.id === match.id);
    
    if (!existingMatch) {
      acc[matchday].push(match);
    } else {
      console.log('Partido duplicado encontrado:', {
        matchday,
        matchId: match.id,
        existingMatch,
        newMatch: match
      });
    }

    return acc;
  }, {});

  console.log('Partidos agrupados:', matchesByRound);

  // Obtener jornadas únicas ordenadas
  const rounds = Object.keys(matchesByRound)
    .map(Number)
    .sort((a, b) => a - b);

  // Estado para la jornada seleccionada
  const [selectedRound, setSelectedRound] = useState(rounds[0] || 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-green-600" />
          Calendario de Partidos
        </CardTitle>
        <CardDescription>
          Ver los partidos por jornada
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Selector de jornadas */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {rounds.map(round => (
            <Button
              key={round}
              variant={selectedRound === round ? "default" : "outline"}
              onClick={() => setSelectedRound(round)}
            >
              Jornada {round}
            </Button>
          ))}
        </div>

        {/* Lista de partidos */}
        <div className="grid gap-4">
          {(matchesByRound[selectedRound] || []).map((match) => (
            <div
              key={match.id}
              className="flex items-center justify-between py-2 px-4 bg-white rounded-lg shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="flex-1 text-center">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 text-right">
                      {teams.find((t: { id: string }) => t.id === match.home_team_id)?.name}
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-8 text-center ${match.status === "completed" ? "font-bold" : "text-gray-500"}`}
                      >
                        {match.home_score ?? "-"}
                      </div>
                      <div className="text-gray-300">vs</div>
                      <div
                        className={`w-8 text-center ${match.status === "completed" ? "font-bold" : "text-gray-500"}`}
                      >
                        {match.away_score ?? "-"}
                      </div>
                    </div>
                    <div className="flex-1 text-left">
                      {teams.find((t: { id: string }) => t.id === match.away_team_id)?.name}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {(!matchesByRound[selectedRound] || matchesByRound[selectedRound].length === 0) && (
            <p className="text-center text-gray-500 py-4">
              No hay partidos programados para esta jornada
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
