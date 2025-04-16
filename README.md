# Zona Gol

Plataforma web para la gestión de torneos de fútbol amateur. Permite organizar torneos, equipos, jugadores y llevar el control de partidos y estadísticas.

## Características

- **Gestión de Torneos**
  - Crear y administrar torneos
  - Asignar equipos a torneos
  - Generación automática de calendarios de juegos

- **Gestión de Equipos**
  - Registro de equipos
  - Administración de jugadores
  - Estadísticas del equipo

- **Rol de Juegos**
  - Calendario de partidos por torneo
  - Registro de resultados
  - Estado de los partidos (pendiente, finalizado)

## Tecnologías

- **Frontend**
  - Next.js 14
  - React
  - TypeScript
  - Tailwind CSS
  - Shadcn UI

- **Backend**
  - Supabase (PostgreSQL)
  - Next.js Server Actions

## Requisitos

- Node.js 18.17 o superior
- pnpm

## Instalación

1. Clonar el repositorio:
```bash
git clone <url-del-repositorio>
cd zona-gol-v0
```

2. Instalar dependencias:
```bash
pnpm install
```

3. Configurar variables de entorno:
Crear un archivo `.env.local` con las siguientes variables:
```
NEXT_PUBLIC_SUPABASE_URL=tu-url-de-supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-de-supabase
```

4. Iniciar el servidor de desarrollo:
```bash
pnpm dev
```

## Estructura del Proyecto

```
zona-gol-v0/
├── app/                    # Rutas y componentes de la aplicación
│   ├── dashboard/         # Panel de administración
│   │   ├── matches/      # Gestión de partidos
│   │   ├── teams/        # Gestión de equipos
│   │   └── tournaments/  # Gestión de torneos
│   └── ...
├── components/            # Componentes reutilizables
├── lib/                   # Utilidades y configuraciones
└── utils/                 # Funciones de utilidad
```

## Uso

1. **Crear un Torneo**
   - Acceder a la sección de torneos
   - Hacer clic en "Nuevo Torneo"
   - Llenar la información requerida

2. **Agregar Equipos**
   - Ir a la sección de equipos
   - Crear nuevos equipos
   - Asignar equipos a un torneo

3. **Generar Calendario**
   - En la sección de partidos
   - Seleccionar un torneo
   - Usar el formulario de generación de calendario
   - Especificar fecha de inicio y hora por defecto

4. **Registrar Resultados**
   - En el rol de juegos
   - Buscar el partido
   - Usar el menú de acciones para registrar el resultado

## Contribuir

1. Hacer fork del repositorio
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit de tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.
