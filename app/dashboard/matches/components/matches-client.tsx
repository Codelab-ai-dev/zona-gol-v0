'use client'

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { GenerateScheduleForm } from "./generate-schedule-form"
import { UpdateMatchResultForm } from "./update-match-result-form"

interface Match {
  id: string
  tournament_id: string
  home_team_id: string
  away_team_id: string
  home_team_name: string
  away_team_name: string
  matchday: number
  date: string
  time: string
  status: 'pending' | 'completed'
  home_score?: number
  away_score?: number
}

interface Tournament {
  id: string
  name: string
  teams: {
    id: string
    name: string
  }[]
}

export function MatchesClient({ matches, tournaments }: { matches: Match[] | null, tournaments: Tournament[] | null }) {
  console.log('MatchesClient - matches:', matches)
  console.log('MatchesClient - tournaments:', tournaments)
  const [selectedMatch, setSelectedMatch] = useState<{
    id: string
    home_team_name: string
    away_team_name: string
  } | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const matchesByTournament = matches?.reduce((acc, match) => {
    if (!acc[match.tournament_id]) {
      acc[match.tournament_id] = []
    }
    acc[match.tournament_id].push(match)
    return acc
  }, {} as Record<string, typeof matches>)

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Resultado</DialogTitle>
          </DialogHeader>
          {selectedMatch && (
            <UpdateMatchResultForm
              match={selectedMatch}
              onClose={() => setDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Rol de Juegos</h1>
        </div>

        <div className="grid gap-6">
          {tournaments?.map((tournament) => (
            <Card key={tournament.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{tournament.name}</CardTitle>
                {(!matchesByTournament || !matchesByTournament[tournament.id]) && (
                  <div className="w-96">
                    <GenerateScheduleForm tournamentId={tournament.id} />
                  </div>
                )}
              </CardHeader>
              <CardContent>
                {matchesByTournament?.[tournament.id]?.length ? (
                  <div className="space-y-4">
                    {Array.from(
                      new Set(
                        matchesByTournament[tournament.id].map(
                          (match) => match.matchday
                        )
                      )
                    ).map((matchday) => (
                      <div key={matchday} className="space-y-2">
                        <h3 className="text-lg font-semibold">Jornada {matchday}</h3>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Local</TableHead>
                              <TableHead className="text-center">Resultado</TableHead>
                              <TableHead>Visitante</TableHead>
                              <TableHead>Fecha</TableHead>
                              <TableHead>Hora</TableHead>
                              <TableHead>Estado</TableHead>
                              <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {matchesByTournament[tournament.id]
                              .filter((match) => match.matchday === matchday)
                              .map((match) => (
                                <TableRow key={match.id}>
                                  <TableCell>{match.home_team_name}</TableCell>
                                  <TableCell className="text-center">
                                    {match.status === "completed"
                                      ? `${match.home_score} - ${match.away_score}`
                                      : "vs"}
                                  </TableCell>
                                  <TableCell>{match.away_team_name}</TableCell>
                                  <TableCell>{match.date}</TableCell>
                                  <TableCell>{match.time}</TableCell>
                                  <TableCell>
                                    {match.status === "completed"
                                      ? "Finalizado"
                                      : "Pendiente"}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    {match.status === "pending" && (
                                      <Select
                                        onValueChange={(value) => {
                                          if (value === 'update') {
                                            setSelectedMatch(match)
                                            setDialogOpen(true)
                                          }
                                        }}
                                      >
                                        <SelectTrigger className="w-40">
                                          <SelectValue placeholder="Acciones" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectGroup>
                                            <SelectItem value="update">
                                              Registrar Resultado
                                            </SelectItem>
                                            <SelectItem value="reschedule">
                                              Reprogramar
                                            </SelectItem>
                                            <SelectItem value="cancel">
                                              Cancelar Partido
                                            </SelectItem>
                                          </SelectGroup>
                                        </SelectContent>
                                      </Select>
                                    )}
                                  </TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    No hay partidos programados para este torneo
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  )
}
