'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface UpdateMatchResultFormProps {
  match: {
    id: string
    home_team_name: string
    away_team_name: string
  }
  onClose: () => void
}

export function UpdateMatchResultForm({
  match,
  onClose,
}: UpdateMatchResultFormProps) {
  return (
    <form className="space-y-4">
      <div className="grid grid-cols-3 gap-4 items-center">
        <div className="text-center">
          <p className="font-medium">{match.home_team_name}</p>
          <Input
            type="number"
            min="0"
            placeholder="Goles"
            className="mt-2"
            name="homeScore"
          />
        </div>
        <div className="text-center">
          <span className="text-2xl font-bold">-</span>
        </div>
        <div className="text-center">
          <p className="font-medium">{match.away_team_name}</p>
          <Input
            type="number"
            min="0"
            placeholder="Goles"
            className="mt-2"
            name="awayScore"
          />
        </div>
      </div>
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit">Guardar</Button>
      </div>
    </form>
  )
}
