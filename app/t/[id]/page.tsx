import { createClient } from "@/utils/supabase/server"
import { Metadata } from "next"
import { PostgrestError } from "@supabase/supabase-js"
import { notFound } from "next/navigation"
import { TournamentClient } from "./components/tournament-client"
import { Tournament } from "./types"

type DatabaseError = PostgrestError & {
  details?: string;
  hint?: string;
}

async function getTournamentData(id: string) {
  try {
    if (!id) {
      console.error('ID no definido');
      return {
        hasData: false,
        hasError: true,
        errorDetails: { message: 'ID no definido' },
      };
    }

    console.log('Obteniendo datos del torneo:', id);

    const supabase = await createClient()
    console.log('Cliente de Supabase creado');
    
    console.log('Buscando torneo con ID:', id);

    // Primero obtener el torneo con sus partidos
    const { data: tournament, error: tournamentError } = await supabase
      .from("tournaments")
      .select(`
        id,
        name,
        start_date,
        end_date,
        league_id,
        matches!inner (
          id,
          matchday,
          home_team_id,
          away_team_id,
          home_score,
          away_score,
          status
        )
      `)
      .eq("id", id)
      .single();

    if (tournamentError) {
      console.error("Error al obtener el torneo:", tournamentError);
      return {
        hasData: false,
        hasError: true,
        errorDetails: tournamentError,
      };
    }

    // Luego obtener los equipos del torneo
    const { data: teamData, error: teamsError } = await supabase
      .from("teams_tournaments")
      .select(`
        teams (id, name)
      `)
      .eq("tournament_id", id);

    if (teamsError) {
      console.error("Error al obtener los equipos:", teamsError);
      return {
        hasData: false,
        hasError: true,
        errorDetails: teamsError,
      };
    }

    // Extraer los equipos del resultado y aplanar el array
    const teams = teamData
      .map(t => t.teams)
      .flat()
      .filter((team): team is { id: string; name: string } => 
        team !== null && typeof team === 'object' && 'id' in team && 'name' in team
      );

    // Combinar los datos
    const data = {
      ...tournament,
      teams
    } as Tournament;

    if (!data) {
      console.error("No se encontraron datos del torneo");
      return {
        hasData: false,
        hasError: true,
        errorDetails: { message: "No se encontraron datos del torneo" },
      };
    }

    if (!data) {
      console.log('No se encontraron datos para el torneo');
      return {
        hasData: false,
        hasError: true,
        errorDetails: { message: 'No se encontró el torneo' },
      };
    }

    console.log('Datos del torneo:', {
      id: data.id,
      name: data.name,
      teamsCount: data.teams?.length,
      matchesCount: data.matches?.length,
      matches: data.matches?.map(m => ({
        id: m.id,
        matchday: m.matchday,
        home_team_id: m.home_team_id,
        away_team_id: m.away_team_id
      }))
    });

    return {
      hasData: true,
      hasError: false,
      data: data as Tournament,
    };

  } catch (error) {
    console.error('Error al obtener el torneo:', error);
    return {
      hasData: false,
      hasError: true,
      errorDetails: error as Error,
    };
  }
}

type PageProps = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
  props: PageProps
): Promise<Metadata> {
  try {
    console.log('generateMetadata - Props recibidos:', props);
    const params = await Promise.resolve(props.params)
    console.log('generateMetadata - Params resueltos:', params);
    
    const result = await getTournamentData(params.id)

    if (result.hasError) {
      console.error('Error al cargar el torneo:', result.errorDetails);
      return {};
    }

    return {
      title: result.data ? `${result.data.name} - ZonaGol` : "Torneo - ZonaGol",
      description: result.data ? `Detalles del torneo ${result.data.name}` : "Detalles del torneo"
    }
  } catch (err) {
    console.error('Error inesperado en generateMetadata:', err);
    return {
      title: 'Error',
      description: 'No se pudo cargar el torneo'
    };
  }
}

export default async function TournamentPage(
  props: PageProps
) {
  try {
    console.log('TournamentPage - Props recibidos:', props);
    const params = await Promise.resolve(props.params)
    console.log('TournamentPage - Params resueltos:', params);

    const { data: tournament, error } = await getTournamentData(params.id)
    console.log('TournamentPage - Resultado:', {
      hasData: !!tournament,
      hasError: !!error,
      errorDetails: error ? {
        name: error.name,
        message: error.message
      } : null
    });

    // Si hay error de no encontrado, mostrar 404
    if ((error as PostgrestError)?.code === "PGRST116") {
      console.log('Torneo no encontrado, mostrando 404');
      notFound()
    }

    // Si hay otro tipo de error, mostrarlo en la UI
    if (error) {
      console.error('Error al cargar el torneo:', error);
      return (
        <div className="container mx-auto py-8">
          <div className="bg-red-50 p-4 rounded-lg">
            <h1 className="text-red-600 text-lg font-bold">Error</h1>
            <p className="text-red-600">Hubo un error al cargar el torneo: {error.message}</p>
          </div>
        </div>
      )
    }

    // Si no hay torneo, mostrar 404
    if (!tournament) {
      console.log('No se encontró el torneo, mostrando 404');
      notFound()
    }

    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
        <TournamentClient tournament={tournament} />
      </div>
    )
  } catch (err) {
    console.error('Error inesperado en TournamentPage:', err);
    return (
      <div className="container mx-auto py-8">
        <div className="bg-red-50 p-4 rounded-lg">
          <h1 className="text-red-600 text-lg font-bold">Error Inesperado</h1>
          <p className="text-red-600">Ocurrió un error inesperado. Por favor, intenta de nuevo.</p>
        </div>
      </div>
    )
  }
}
