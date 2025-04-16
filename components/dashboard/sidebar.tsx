"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Trophy, Calendar, Shield, Users, Settings, BarChart, Home, ClipboardList } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { UserType } from "@/lib/types"

interface DashboardSidebarProps {
  user: UserType
}

export default function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname()

  // Menú para Super Admin
  if (user.role === "super") {
    return (
      <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40 w-64">
        <div className="flex flex-col gap-2 p-4">
          <SidebarLink
            href="/dashboard"
            icon={<Home className="h-4 w-4" />}
            label="Dashboard"
            isActive={pathname === "/dashboard"}
          />
          <SidebarLink
            href="/dashboard/leagues"
            icon={<Trophy className="h-4 w-4" />}
            label="Ligas"
            isActive={pathname.startsWith("/dashboard/leagues")}
          />
          <SidebarLink
            href="/dashboard/users"
            icon={<Users className="h-4 w-4" />}
            label="Usuarios"
            isActive={pathname.startsWith("/dashboard/users")}
          />
          <SidebarLink
            href="/dashboard/settings"
            icon={<Settings className="h-4 w-4" />}
            label="Configuración"
            isActive={pathname.startsWith("/dashboard/settings")}
          />
          <SidebarLink
            href="/dashboard/reports"
            icon={<BarChart className="h-4 w-4" />}
            label="Reportes"
            isActive={pathname.startsWith("/dashboard/reports")}
          />
        </div>
      </div>
    )
  }

  // Menú para Admin
  if (user.role === "admin") {
    return (
      <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40 w-64">
        <div className="flex flex-col gap-2 p-4">
          <SidebarLink
            href="/dashboard"
            icon={<Home className="h-4 w-4" />}
            label="Dashboard"
            isActive={pathname === "/dashboard"}
          />
          <SidebarLink
            href="/dashboard/tournaments"
            icon={<Calendar className="h-4 w-4" />}
            label="Torneos"
            isActive={pathname.startsWith("/dashboard/tournaments")}
          />
          <SidebarLink
            href="/dashboard/teams"
            icon={<Shield className="h-4 w-4" />}
            label="Equipos"
            isActive={pathname.startsWith("/dashboard/teams")}
          />
          <SidebarLink
            href="/dashboard/users"
            icon={<Users className="h-4 w-4" />}
            label="Usuarios"
            isActive={pathname.startsWith("/dashboard/users")}
          />
          <SidebarLink
            href="/dashboard/matches"
            icon={<ClipboardList className="h-4 w-4" />}
            label="Partidos"
            isActive={pathname.startsWith("/dashboard/matches")}
          />
          <SidebarLink
            href="/dashboard/statistics"
            icon={<BarChart className="h-4 w-4" />}
            label="Estadísticas"
            isActive={pathname.startsWith("/dashboard/statistics")}
          />
          <SidebarLink
            href="/dashboard/settings"
            icon={<Settings className="h-4 w-4" />}
            label="Configuración"
            isActive={pathname.startsWith("/dashboard/settings")}
          />
        </div>
      </div>
    )
  }

  // Menú para Manager
  if (user.role === "manager") {
    return (
      <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40 w-64">
        <div className="flex flex-col gap-2 p-4">
          <SidebarLink
            href="/dashboard"
            icon={<Home className="h-4 w-4" />}
            label="Dashboard"
            isActive={pathname === "/dashboard"}
          />
          <SidebarLink
            href="/dashboard/team"
            icon={<Shield className="h-4 w-4" />}
            label="Mi Equipo"
            isActive={pathname.startsWith("/dashboard/team")}
          />
          <SidebarLink
            href="/dashboard/players"
            icon={<Users className="h-4 w-4" />}
            label="Jugadores"
            isActive={pathname.startsWith("/dashboard/players")}
          />
          <SidebarLink
            href="/dashboard/matches"
            icon={<ClipboardList className="h-4 w-4" />}
            label="Partidos"
            isActive={pathname.startsWith("/dashboard/matches")}
          />
          <SidebarLink
            href="/dashboard/statistics"
            icon={<BarChart className="h-4 w-4" />}
            label="Estadísticas"
            isActive={pathname.startsWith("/dashboard/statistics")}
          />
          <SidebarLink
            href="/dashboard/settings"
            icon={<Settings className="h-4 w-4" />}
            label="Configuración"
            isActive={pathname.startsWith("/dashboard/settings")}
          />
        </div>
      </div>
    )
  }

  // Menú para Usuario normal
  return (
    <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40 w-64">
      <div className="flex flex-col gap-2 p-4">
        <SidebarLink
          href="/dashboard"
          icon={<Home className="h-4 w-4" />}
          label="Inicio"
          isActive={pathname === "/dashboard"}
        />
        <SidebarLink
          href="/dashboard/leagues"
          icon={<Trophy className="h-4 w-4" />}
          label="Ligas"
          isActive={pathname.startsWith("/dashboard/leagues")}
        />
        <SidebarLink
          href="/dashboard/tournaments"
          icon={<Calendar className="h-4 w-4" />}
          label="Torneos"
          isActive={pathname.startsWith("/dashboard/tournaments")}
        />
        <SidebarLink
          href="/dashboard/teams"
          icon={<Shield className="h-4 w-4" />}
          label="Equipos"
          isActive={pathname.startsWith("/dashboard/teams")}
        />
        <SidebarLink
          href="/dashboard/statistics"
          icon={<BarChart className="h-4 w-4" />}
          label="Estadísticas"
          isActive={pathname.startsWith("/dashboard/statistics")}
        />
        <SidebarLink
          href="/dashboard/settings"
          icon={<Settings className="h-4 w-4" />}
          label="Configuración"
          isActive={pathname.startsWith("/dashboard/settings")}
        />
      </div>
    </div>
  )
}

interface SidebarLinkProps {
  href: string
  icon: React.ReactNode
  label: string
  isActive: boolean
}

function SidebarLink({ href, icon, label, isActive }: SidebarLinkProps) {
  return (
    <Link href={href}>
      <Button variant="ghost" className={cn("w-full justify-start gap-2", isActive && "bg-gray-200 dark:bg-gray-700")}>
        {icon}
        {label}
      </Button>
    </Link>
  )
}
