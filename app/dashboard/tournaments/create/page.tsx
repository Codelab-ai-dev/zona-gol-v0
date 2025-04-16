"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { createTournament, getLeagues } from "../create/actions"

interface League {
  id: string
  name: string
}

export default function CreateTournamentPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [leagues, setLeagues] = useState<League[]>([])
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    async function fetchLeagues() {
      const { leagues, error } = await getLeagues()
      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudieron cargar las ligas",
        })
        return
      }
      setLeagues(leagues || [])
    }
    fetchLeagues()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const data = {
        name: formData.get("name") as string,
        leagueId: formData.get("leagueId") as string,
        description: formData.get("description") as string,
        startDate: new Date(formData.get("startDate") as string),
        endDate: new Date(formData.get("endDate") as string),
      }

      const result = await createTournament(data)

      if (result.error) {
        toast({
          variant: "destructive",
          title: "Error al crear el torneo",
          description: result.error,
        })
        return
      }

      toast({
        title: "Torneo creado",
        description: "El torneo ha sido creado exitosamente.",
      })
      router.push("/dashboard/tournaments")
      router.refresh()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error al crear el torneo",
        description: "Ha ocurrido un error inesperado.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto max-w-2xl py-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-green-600" />
            <CardTitle>Crear Nuevo Torneo</CardTitle>
          </div>
          <CardDescription>Ingresa los datos del nuevo torneo</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del torneo</Label>
              <Input
                id="name"
                name="name"
                placeholder="Ej: Torneo Apertura 2024"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="leagueId">Liga</Label>
              <Select name="leagueId" required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una liga" />
                </SelectTrigger>
                <SelectContent>
                  {leagues.map((league) => (
                    <SelectItem key={league.id} value={league.id}>
                      {league.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe el torneo..."
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Fecha de inicio</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">Fecha de fin</Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700"
              disabled={isLoading}
            >
              {isLoading ? "Creando..." : "Crear Torneo"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
