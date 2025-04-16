"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

import { getUser, updateUser } from "./actions"

interface User {
  id: string
  name: string
  email: string
  role: string
  isActive: boolean
}

export default function EditUserPage({ params }: { params: { id: string } }) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("")
  const [isActive, setIsActive] = useState(true)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingUser, setIsLoadingUser] = useState(true)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const loadUser = async () => {
      try {
        const result = await getUser(params.id)

        if (result.error) {
          toast({
            variant: "destructive",
            title: "Error",
            description: result.error,
          })
          router.push("/dashboard/users")
          return
        }

        const user = result.data as User
        setName(user.name)
        setEmail(user.email)
        setRole(user.role)
        setIsActive(user.isActive)
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudo cargar la información del usuario",
        })
      } finally {
        setIsLoadingUser(false)
      }
    }

    loadUser()
  }, [params.id, router, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password && password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Error en el formulario",
        description: "Las contraseñas no coinciden",
      })
      return
    }

    setIsLoading(true)

    try {
      const result = await updateUser({
        id: params.id,
        name,
        email,
        role,
        isActive,
        password: password || undefined
      })

      if (result.error) {
        toast({
          variant: "destructive",
          title: "Error al actualizar el usuario",
          description: result.error,
        })
        return
      }

      toast({
        title: "Usuario actualizado",
        description: `El usuario "${name}" ha sido actualizado correctamente.`,
      })

      router.push("/dashboard/users")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error al actualizar el usuario",
        description: "Ha ocurrido un error inesperado. Inténtalo de nuevo.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingUser) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p>Cargando información del usuario...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Editar Usuario</h1>
        <p className="text-gray-500">Modifica la información del usuario</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Información del Usuario</CardTitle>
            <CardDescription>Actualiza los datos del usuario.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre completo</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Juan Pérez"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@ejemplo.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Rol</Label>
              <Select value={role} onValueChange={setRole} required>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Selecciona un rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Usuario</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="super">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="status" checked={isActive} onCheckedChange={setIsActive} />
              <Label htmlFor="status">Usuario activo</Label>
            </div>

            <div className="pt-4 border-t">
              <h3 className="text-lg font-medium mb-2">Cambiar contraseña</h3>
              <p className="text-sm text-gray-500 mb-4">
                Deja estos campos en blanco si no deseas cambiar la contraseña.
              </p>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Nueva contraseña</Label>
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar nueva contraseña</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href="/dashboard/users">
              <Button variant="outline" type="button">
                Cancelar
              </Button>
            </Link>
            <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={isLoading}>
              {isLoading ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
