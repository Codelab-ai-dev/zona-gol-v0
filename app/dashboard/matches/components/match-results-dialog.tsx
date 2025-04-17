'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface MatchResult {
  id: string
  home_score: number
  away_score: number
  recorded_by_name: string
  notes?: string
  created_at: string
}

interface Match {
  id: string
  home_team_name: string
  away_team_name: string
  results: MatchResult[]
}

export function MatchResultsDialog({
  match,
  open,
  onClose
}: {
  match: Match | null
  open: boolean
  onClose: () => void
}) {
  if (!match) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Historial de Resultados</DialogTitle>
        </DialogHeader>
        <div>
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold">
              {match.home_team_name} vs {match.away_team_name}
            </h3>
          </div>
          {match.results?.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="text-center">Resultado</TableHead>
                  <TableHead>Registrado por</TableHead>
                  <TableHead>Notas</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {match.results.map((result) => (
                  <TableRow key={result.id}>
                    <TableCell>
                      {format(new Date(result.created_at), "PPp", { locale: es })}
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {result.home_score} - {result.away_score}
                    </TableCell>
                    <TableCell>{result.recorded_by_name}</TableCell>
                    <TableCell>{result.notes || "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-4 text-gray-500">
              No hay registros de resultados para este partido
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
