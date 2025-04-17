'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface TeamStats {
  team_id: string
  team_name: string
  matches_played: number
  wins: number
  draws: number
  losses: number
  goals_for: number
  goals_against: number
  goal_difference: number
  points: number
}

interface TournamentStats {
  tournament_id: string
  tournament_name: string
  teams: TeamStats[]
}

export function StatisticsClient({ statistics }: { statistics: TournamentStats[] | null }) {
  if (!statistics?.length) {
    return (
      <div className="text-center py-4 text-gray-500">
        No hay estadísticas disponibles. Asegúrate de tener torneos activos con partidos completados.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Estadísticas</h1>
      </div>

      <div className="grid gap-6">
        {statistics.map((tournament) => (
          <Card key={tournament.tournament_id}>
            <CardHeader>
              <CardTitle>{tournament.tournament_name}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pos</TableHead>
                    <TableHead>Equipo</TableHead>
                    <TableHead className="text-center">PJ</TableHead>
                    <TableHead className="text-center">G</TableHead>
                    <TableHead className="text-center">E</TableHead>
                    <TableHead className="text-center">P</TableHead>
                    <TableHead className="text-center">GF</TableHead>
                    <TableHead className="text-center">GC</TableHead>
                    <TableHead className="text-center">DG</TableHead>
                    <TableHead className="text-center">Pts</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tournament.teams.map((team, index) => (
                    <TableRow key={team.team_id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>{team.team_name}</TableCell>
                      <TableCell className="text-center">{team.matches_played}</TableCell>
                      <TableCell className="text-center">{team.wins}</TableCell>
                      <TableCell className="text-center">{team.draws}</TableCell>
                      <TableCell className="text-center">{team.losses}</TableCell>
                      <TableCell className="text-center">{team.goals_for}</TableCell>
                      <TableCell className="text-center">{team.goals_against}</TableCell>
                      <TableCell className="text-center">{team.goal_difference}</TableCell>
                      <TableCell className="text-center font-bold">{team.points}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
