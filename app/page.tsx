import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Trophy, Users, Calendar, Shield } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Shield className="h-6 w-6 text-green-600" />
            <span>Zona-Gol</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="#features" className="text-sm font-medium hover:underline underline-offset-4">
              Características
            </Link>
            <Link href="#pricing" className="text-sm font-medium hover:underline underline-offset-4">
              Precios
            </Link>
            <Link href="#about" className="text-sm font-medium hover:underline underline-offset-4">
              Acerca de
            </Link>
          </nav>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="outline">Iniciar Sesión</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-green-600 hover:bg-green-700">Registrarse</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-green-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Gestiona tus ligas de fútbol con Zona-Gol
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                  La plataforma completa para organizar torneos, equipos y jugadores en un solo lugar.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/register">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700">
                    Comenzar ahora
                  </Button>
                </Link>
                <Link href="#features">
                  <Button size="lg" variant="outline">
                    Conoce más
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Características principales
                </h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                  Todo lo que necesitas para gestionar tus ligas de fútbol de manera eficiente.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-12 mt-8">
                <div className="flex flex-col items-center space-y-2">
                  <Trophy className="h-12 w-12 text-green-600" />
                  <h3 className="text-xl font-bold">Gestión de Ligas</h3>
                  <p className="text-gray-500 text-center">
                    Crea y administra múltiples ligas con URLs personalizadas.
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <Calendar className="h-12 w-12 text-green-600" />
                  <h3 className="text-xl font-bold">Torneos</h3>
                  <p className="text-gray-500 text-center">
                    Organiza torneos con calendarios, resultados y estadísticas.
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <Shield className="h-12 w-12 text-green-600" />
                  <h3 className="text-xl font-bold">Equipos</h3>
                  <p className="text-gray-500 text-center">Gestiona equipos, plantillas y cuerpo técnico.</p>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <Users className="h-12 w-12 text-green-600" />
                  <h3 className="text-xl font-bold">Jugadores</h3>
                  <p className="text-gray-500 text-center">Seguimiento de estadísticas individuales y rendimiento.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-8">
        <div className="container flex flex-col items-center justify-center gap-4 px-4 md:px-6 md:flex-row">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" />
            <span className="text-lg font-semibold">Zona-Gol</span>
          </div>
          <p className="text-center text-sm text-gray-500 md:text-left">
            © 2024 Zona-Gol. Todos los derechos reservados.
          </p>
          <nav className="flex gap-4 md:ml-auto">
            <Link href="#" className="text-sm text-gray-500 hover:underline underline-offset-4">
              Términos
            </Link>
            <Link href="#" className="text-sm text-gray-500 hover:underline underline-offset-4">
              Privacidad
            </Link>
            <Link href="#" className="text-sm text-gray-500 hover:underline underline-offset-4">
              Contacto
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
