import { Suspense } from "react"
import { notFound } from "next/navigation"
import { tmdbClient } from "@/lib/tmdb"
import { MovieDetails } from "@/components/movie-details"
import { MovieDetailsSkeleton } from "@/components/movie-details-skeleton"

interface MoviePageProps {
  params: {
    id: string
  }
}

async function getMovieData(id: string) {
  try {
    const [movie, credits] = await Promise.all([
      tmdbClient.getMovieDetails(Number.parseInt(id)),
      tmdbClient.getMovieCredits(Number.parseInt(id)),
    ])
    return { movie, credits }
  } catch (error) {
    console.error("Error fetching movie data:", error)
    return null
  }
}

export default async function MoviePage({ params }: MoviePageProps) {
  const data = await getMovieData(params.id)

  if (!data) {
    notFound()
  }

  return (
    <div className="min-h-screen">
      <Suspense fallback={<MovieDetailsSkeleton />}>
        <MovieDetails movie={data.movie} credits={data.credits} />
      </Suspense>
    </div>
  )
}
