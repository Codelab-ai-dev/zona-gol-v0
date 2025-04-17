'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Match, Tournament } from "../types"
import { updateMatch } from "../actions"

interface EditMatchFormProps {
  match: Match
  tournament: Tournament
  onSuccess?: () => void
  onClose?: () => void
}

export function EditMatchForm({ match, tournament, onSuccess, onClose }: EditMatchFormProps) {
  const [homeTeamId, setHomeTeamId] = useState(match.home_team_id)
  const [awayTeamId, setAwayTeamId] = useState(match.away_team_id)
  const [date, setDate] = useState(match.date)
  const [time, setTime] = useState(match.time)

  return (
    <form 
      action={async (formData: FormData) => {
        const updatedMatch = {
          ...match,
          home_team_id: homeTeamId,
          away_team_id: awayTeamId,
          home_team_name: tournament.teams.find((t: { id: string; name: string }) => t.id === homeTeamId)?.name || '',
          away_team_name: tournament.teams.find((t: { id: string; name: string }) => t.id === awayTeamId)?.name || '',
          date,
          time
        }
        
        await updateMatch(updatedMatch)
        onSuccess?.()
        onClose?.()
      }}
      className="space-y-4"
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Equipo Local</Label>
          <Select 
            onValueChange={setHomeTeamId}
            value={homeTeamId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona equipo local" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {tournament.teams
                  .filter((team: { id: string }) => team.id !== awayTeamId)
                  .map((team: { id: string, name: string }) => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Equipo Visitante</Label>
          <Select
            onValueChange={setAwayTeamId}
            value={awayTeamId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona equipo visitante" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {tournament.teams
                  .filter((team: { id: string }) => team.id !== homeTeamId)
                  .map((team: { id: string, name: string }) => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Fecha</Label>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Hora</Label>
          <Input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose} type="button">
          Cancelar
        </Button>
        <Button type="submit">
          Guardar
        </Button>
      </div>
    </form>
  )
}
