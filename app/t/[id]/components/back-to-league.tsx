'use client'

import { useEffect, useState } from "react"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { createBrowserClient } from "@supabase/ssr"

interface BackToLeagueProps {
  leagueId: string
}

export function BackToLeague({ leagueId }: BackToLeagueProps) {
  const [leagueSlug, setLeagueSlug] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function getLeagueSlug() {
      try {
        setIsLoading(true);
        setError(null);

        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const { data: league, error } = await supabase
          .from("leagues")
          .select("slug")
          .eq("id", leagueId)
          .single();

        if (error) throw error;

        if (league?.slug) {
          setLeagueSlug(league.slug);
        }
      } catch (err) {
        console.error('Error al obtener el slug de la liga:', err);
        setError(err instanceof Error ? err : new Error('Error desconocido'));
      } finally {
        setIsLoading(false);
      }
    }

    if (leagueId) {
      getLeagueSlug();
    }
  }, [leagueId])

  if (isLoading) {
    return (
      <Button variant="ghost" size="sm" className="gap-2" disabled>
        <ArrowLeft className="h-4 w-4" />
        Cargando...
      </Button>
    )
  }

  if (error || !leagueSlug) {
    return (
      <Button variant="ghost" size="sm" className="gap-2" disabled>
        <ArrowLeft className="h-4 w-4" />
        Volver
      </Button>
    )
  }

  return (
    <Link href={`/l?slug=${leagueSlug}`}>
      <Button variant="ghost" size="sm" className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        Volver a la liga
      </Button>
    </Link>
  )
}
