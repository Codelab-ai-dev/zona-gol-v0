'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { generateMatchSchedule } from "../actions"

export function GenerateScheduleForm({ tournamentId, onSuccess }: { tournamentId: string; onSuccess?: () => void }) {
  return (
    <form
      action={async (formData: FormData) => {
        await generateMatchSchedule(formData)
        onSuccess?.()
      }}
      className="space-y-4"
    >
      <input type="hidden" name="tournamentId" value={tournamentId} />
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="startDate" className="text-sm font-medium">
            Fecha de Inicio
          </label>
          <Input
            type="date"
            id="startDate"
            name="startDate"
            defaultValue={new Date().toISOString().split('T')[0]}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="defaultTime" className="text-sm font-medium">
            Hora por Defecto
          </label>
          <Input
            type="time"
            id="defaultTime"
            name="defaultTime"
            defaultValue="15:00"
          />
        </div>
      </div>
      <Button type="submit" className="w-full">
        Generar Calendario
      </Button>
    </form>
  )
}
