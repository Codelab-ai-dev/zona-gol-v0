import { getMatches, getTournaments } from "./actions"
import { MatchesClient } from "./components/matches-client"

export default async function MatchesPage() {
  const { data: matches, error: matchesError } = await getMatches()
  const { data: tournaments, error: tournamentsError } = await getTournaments()

  if (matchesError || tournamentsError) {
    throw new Error('Error al cargar los datos')
  }

  return <MatchesClient matches={matches} tournaments={tournaments} />
}
