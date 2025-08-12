"use client"

import { MovieCard } from "./movie-card"
import { Skeleton } from "@/components/ui/skeleton"
import type { Movie } from "@/types/movie"

interface MovieGridProps {
  movies: Movie[]
  loading?: boolean
  onFavoriteChange?: () => void
}

export function MovieGrid({ movies, loading = false, onFavoriteChange }: MovieGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 sm:gap-4 md:gap-6">
        {Array.from({ length: 20 }).map((_, index) => (
          <div key={index} className="space-y-2 sm:space-y-3">
            <Skeleton className="aspect-[2/3] w-full rounded-lg cinema-gradient" />
            <Skeleton className="h-3 sm:h-4 w-3/4 cinema-gradient rounded" />
            <Skeleton className="h-2 sm:h-3 w-1/2 cinema-gradient rounded" />
          </div>
        ))}
      </div>
    )
  }

  if (movies.length === 0) {
    return (
      <div className="text-center py-12 sm:py-16 lg:py-20">
        <p className="text-muted-foreground text-base sm:text-lg lg:text-xl">No movies found</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 sm:gap-4 md:gap-6">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} onFavoriteChange={onFavoriteChange} />
      ))}
    </div>
  )
}
