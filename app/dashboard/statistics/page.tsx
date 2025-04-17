import { StatisticsClient } from "./components/statistics-client"
import { getStatistics } from "./actions"

export const revalidate = 0

export default async function StatisticsPage() {
  const { data: statistics, error } = await getStatistics()

  if (error) {
    throw new Error('Error al cargar las estadísticas')
  }

  return <StatisticsClient statistics={statistics} />
}
