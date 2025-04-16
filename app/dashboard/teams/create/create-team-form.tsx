"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { createTeam } from "../actions"

const createTeamSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  logo: z.instanceof(File).optional(),
  tournament_id: z.string().min(1, "Selecciona un torneo"),
  league_id: z.string().min(1, "Selecciona una liga"),
})

type CreateTeamData = z.infer<typeof createTeamSchema>

interface Tournament {
  id: string
  name: string
}

interface League {
  id: string
  name: string
}

interface CreateTeamFormProps {
  tournaments: Tournament[]
  leagues: League[]
}

export function CreateTeamForm({ tournaments, leagues }: CreateTeamFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateTeamData>({
    resolver: zodResolver(createTeamSchema),
  })

  const onSubmit = async (data: CreateTeamData) => {
    setIsLoading(true)

    try {
      const result = await createTeam(data)

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Equipo creado",
        description: "El equipo ha sido creado correctamente.",
      })

      router.push("/dashboard/teams")
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Ha ocurrido un error al crear el equipo.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre del equipo</Label>
        <Input id="name" {...register("name")} />
        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="tournament">Torneo</Label>
        <Select onValueChange={(value) => setValue("tournament_id", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un torneo" />
          </SelectTrigger>
          <SelectContent>
            {tournaments.map((tournament) => (
              <SelectItem key={tournament.id} value={tournament.id}>
                {tournament.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.tournament_id && <p className="text-sm text-red-500">{errors.tournament_id.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="league">Liga</Label>
        <Select onValueChange={(value) => setValue("league_id", value)}>
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
        {errors.league_id && <p className="text-sm text-red-500">{errors.league_id.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="logo">Logo del equipo (opcional)</Label>
        <Input
          id="logo"
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) {
              // Validar tamaño (max 2MB)
              if (file.size > 2 * 1024 * 1024) {
                toast({
                  title: "Error",
                  description: "El archivo no debe superar los 2MB",
                  variant: "destructive",
                })
                e.target.value = ""
                return
              }
              // Validar tipo
              if (!file.type.startsWith("image/")) {
                toast({
                  title: "Error",
                  description: "El archivo debe ser una imagen",
                  variant: "destructive",
                })
                e.target.value = ""
                return
              }
              setValue("logo", file)
            }
          }}
          className="cursor-pointer"
        />
        <p className="text-xs text-gray-500">Máximo 2MB. Formatos: JPG, PNG, GIF</p>
        {errors.logo && <p className="text-sm text-red-500">{errors.logo.message}</p>}
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
        <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={isLoading}>
          {isLoading ? "Creando..." : "Crear equipo"}
        </Button>
      </div>
    </form>
  )
}
