import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { getCurrentUser } from "@/lib/auth-utils"
import { UsersList } from "@/components/dashboard/users-list"
import { getUsers, type User as DbUser } from "./actions"

interface DashboardUser {
  id: string
  role: string
}

export default async function UsersPage() {
  const user = await getCurrentUser() as DashboardUser | null

  if (!user) {
    redirect("/login")
  }

  const { data: users, error } = await getUsers()

  if (error || !users) {
    return (
      <div className="p-4">
        <p className="text-red-500">Error al cargar usuarios: {error}</p>
      </div>
    )
  }

  // Verificar si el usuario tiene permisos para gestionar usuarios
  const canManageUsers = user.role === "super" || user.role === "admin"

  if (!canManageUsers) {
    redirect("/dashboard")
  }



  // Convertir los datos de Supabase al formato esperado por el componente
  const formattedUsers = users.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    createdAt: new Date(u.created_at),
    status: u.isActive ? "active" : "inactive"
  }))

  // Filtrar usuarios según el rol del usuario actual
  const filteredUsers =
    user.role === "super" ? formattedUsers : formattedUsers.filter((u) => u.role !== "super" && (u.role !== "admin" || u.id === user.id))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Usuarios</h1>
          <p className="text-gray-500">Gestiona los usuarios del sistema</p>
        </div>
        {canManageUsers && (
          <Link href="/dashboard/users/create">
            <Button className="bg-green-600 hover:bg-green-700">
              <PlusCircle className="mr-2 h-4 w-4" />
              Nuevo Usuario
            </Button>
          </Link>
        )}
      </div>

      <UsersList users={filteredUsers} currentUserRole={user.role} />
    </div>
  )
}
