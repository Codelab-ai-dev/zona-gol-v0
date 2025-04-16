"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { createLeague } from "../actions"

export default function CreateLeaguePage() {
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  // Generar slug automáticamente a partir del nombre
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value
    setName(newName)

    // Convertir a slug: minúsculas, sin acentos, espacios a guiones, sin caracteres especiales
    const newSlug = newName
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")

    setSlug(newSlug)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await createLeague({
        name,
        description,
      })

      if (result.error) {
        toast({
          variant: "destructive",
          title: "Error al crear la liga",
          description: result.error,
        })
        return
      }

      toast({
        title: "Liga creada",
        description: `La liga "${name}" ha sido creada correctamente.`,
      })

      router.push("/dashboard/leagues")
      router.refresh()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error al crear la liga",
        description: "Ha ocurrido un error inesperado. Inténtalo de nuevo.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Crear Nueva Liga</h1>
        <p className="text-gray-500">Configura los detalles de la nueva liga de fútbol</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Información de la Liga</CardTitle>
            <CardDescription>Ingresa la información básica para crear una nueva liga.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre de la Liga</Label>
              <Input
                id="name"
                value={name}
                onChange={handleNameChange}
                placeholder="Ej: Liga Municipal 2024"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">URL de la Liga</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">zonagol.com/</span>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="liga-municipal-2024"
                  required
                />
              </div>
              <p className="text-xs text-gray-500">Esta será la dirección web para acceder a la liga.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe brevemente esta liga..."
                rows={4}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href="/dashboard/leagues">
              <Button variant="outline" type="button">
                Cancelar
              </Button>
            </Link>
            <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={isLoading}>
              {isLoading ? "Creando..." : "Crear Liga"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
