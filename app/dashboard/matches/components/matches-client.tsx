'use client'

import { useState } from "react"
import { History } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
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
import { MatchResultsDialog } from "./match-results-dialog"
import { EditMatchForm } from "./edit-match-form"
import { getMatchResults } from "../actions"
import { Match, Tournament, MatchResult } from "../types"

export function MatchesClient({ matches: initialMatches, tournaments }: { matches: Match[] | null, tournaments: Tournament[] | null }) {
  const { toast } = useToast()
  const [matches, setMatches] = useState(initialMatches)
  console.log('MatchesClient - matches:', matches)
  console.log('MatchesClient - tournaments:', tournaments)

  const { getMatches } = require('../actions')
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)
  const [selectedHistoryMatch, setSelectedHistoryMatch] = useState<(Match & { results: MatchResult[] }) | null>(null)
  const [matchResults, setMatchResults] = useState<MatchResult[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [showScheduleForm, setShowScheduleForm] = useState(false)
  const [showHistoryDialog, setShowHistoryDialog] = useState(false)
  const [selectedTournament, setSelectedTournament] = useState<string | null>(null)
  const [selectedEditMatch, setSelectedEditMatch] = useState<{ match: Match, tournament: Tournament } | null>(null)

  const matchesByTournament = matches?.reduce((acc, match) => {
    if (!acc[match.tournament_id]) {
      acc[match.tournament_id] = []
    }
    acc[match.tournament_id].push(match)
    return acc
  }, {} as Record<string, typeof matches>)

  return (
    <>
      {selectedMatch && (
        <Dialog open onOpenChange={() => setSelectedMatch(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registrar Resultado</DialogTitle>
            </DialogHeader>
            <UpdateMatchResultForm
              match={selectedMatch}
              onClose={() => setSelectedMatch(null)}
              onSuccess={async () => {
                const { data } = await getMatches()
                if (data) {
                  setMatches(data)
                }
              }}
            />
          </DialogContent>
        </Dialog>
      )}

      <MatchResultsDialog
        match={selectedHistoryMatch}
        open={showHistoryDialog}
        onClose={() => {
          setShowHistoryDialog(false)
          setSelectedHistoryMatch(null)
        }}
      />

      {selectedEditMatch && (
        <Dialog open onOpenChange={() => setSelectedEditMatch(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Partido</DialogTitle>
            </DialogHeader>
            <EditMatchForm
              match={selectedEditMatch.match}
              tournament={selectedEditMatch.tournament}
              onSuccess={async () => {
                const { data } = await getMatches()
                if (data) {
                  setMatches(data)
                }
              }}
              onClose={() => setSelectedEditMatch(null)}
            />
          </DialogContent>
        </Dialog>
      )}

      {showScheduleForm && (
        <Dialog open onOpenChange={() => setShowScheduleForm(false)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Generar Calendario</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="space-y-2">
                <label>Seleccionar Torneo</label>
                <Select 
                  onValueChange={(value) => setSelectedTournament(value)}
                  value={selectedTournament || undefined}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un torneo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {tournaments?.map((tournament) => (
                        <SelectItem key={tournament.id} value={tournament.id}>
                          {tournament.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              {selectedTournament && (
                <GenerateScheduleForm 
                  tournamentId={selectedTournament}
                  onSuccess={() => {
                    setShowScheduleForm(false)
                    setSelectedTournament(null)
                  }}
                />
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Partidos</h1>
          <div className="flex gap-2">
            <Button onClick={() => setShowScheduleForm(true)}>
              Generar Calendario
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowScheduleForm(true)}
              disabled={!tournaments?.length}
            >
              Reagendar Partidos
            </Button>
          </div>
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
                                    <div className="flex items-center space-x-2 justify-end">
                                      {match.status === "pending" && (
                                        <>
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setSelectedMatch(match)}
                                          >
                                            Registrar
                                          </Button>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={async () => {
                                              const { data } = await getMatchResults(match.id)
                                              if (data && data.length > 0) {
                                                setMatchResults(data)
                                                setSelectedHistoryMatch({
                                                  ...match,
                                                  results: data
                                                })
                                                setShowHistoryDialog(true)
                                              } else {
                                                toast({
                                                  description: 'No hay registros de resultados para este partido',
                                                  variant: 'default'
                                                })
                                              }
                                            }}
                                          >
                                            <History className="h-4 w-4" />
                                          </Button>
                                        </>
                                      )}
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                          const tournament = tournaments?.find(t => t.id === match.tournament_id)
                                          if (tournament) {
                                            setSelectedEditMatch({ match, tournament })
                                          }
                                        }}
                                      >
                                        Editar
                                      </Button>
                                    </div>
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
