'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { updateMatchResult } from "../actions"
import { useToast } from "@/components/ui/use-toast"

interface UpdateMatchResultFormProps {
  match: {
    id: string
    home_team_name: string
    away_team_name: string
  }
  onClose: () => void
  onSuccess?: () => void
}

export function UpdateMatchResultForm({
  match,
  onClose,
  onSuccess,
}: UpdateMatchResultFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)
    const homeScore = parseInt(formData.get('homeScore') as string)
    const awayScore = parseInt(formData.get('awayScore') as string)
    const notes = formData.get('notes') as string

    if (isNaN(homeScore) || isNaN(awayScore)) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Por favor ingresa resultados válidos"
      })
      setIsSubmitting(false)
      return
    }

    const { error } = await updateMatchResult(
      match.id,
      homeScore,
      awayScore,
      notes
    )

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error
      })
    } else {
      toast({
        title: "Éxito",
        description: "Resultado actualizado correctamente"
      })
      onSuccess?.()
      onClose()
    }

    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-3 gap-4 items-center">
        <div className="text-center">
          <p className="font-medium">{match.home_team_name}</p>
          <Input
            type="number"
            min="0"
            placeholder="Goles"
            className="mt-2"
            name="homeScore"
            required
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
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="notes" className="text-sm font-medium">
          Notas (opcional)
        </label>
        <Textarea
          id="notes"
          name="notes"
          placeholder="Agrega notas sobre el resultado..."
          className="min-h-[100px]"
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : "Guardar"}
        </Button>
      </div>
    </form>
  )
}
