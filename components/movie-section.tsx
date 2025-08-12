"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { MovieGrid } from "./movie-grid"
import type { Movie, MovieListResponse } from "@/types/movie"

interface MovieSectionProps {
  title: string
  fetchMovies: (page: number) => Promise<MovieListResponse>
  initialMovies?: Movie[]
}

export function MovieSection({ title, fetchMovies, initialMovies = [] }: MovieSectionProps) {
  const [movies, setMovies] = useState<Movie[]>(initialMovies)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (initialMovies.length === 0) {
      loadMovies(1, true)
    }
  }, [])

  const loadMovies = async (pageNum: number, replace = false) => {
    setLoading(true)
    setError(null) // Clear previous errors
    try {
      const response = await fetchMovies(pageNum)

      if (replace) {
        setMovies(response.results)
      } else {
        setMovies((prev) => [...prev, ...response.results])
      }

      setPage(pageNum)
      setHasMore(pageNum < response.total_pages)
    } catch (error) {
      console.error("Error loading movies:", error)
      setError(error instanceof Error ? error.message : "Failed to load movies")
    } finally {
      setLoading(false)
    }
  }

  const loadMore = () => {
    if (!loading && hasMore) {
      loadMovies(page + 1)
    }
  }

  const handleFavoriteChange = () => {
    // Force re-render to update favorite status
    setMovies((prev) => [...prev])
  }

  const handleRetry = () => {
    loadMovies(1, true)
  }

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold">{title}</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-800 mb-3">{error}</p>
          <Button onClick={handleRetry} variant="outline" size="sm">
            Try Again
          </Button>
        </div>
      )}

      {!error && (
        <>
          <MovieGrid movies={movies} loading={loading && movies.length === 0} onFavoriteChange={handleFavoriteChange} />

          {hasMore && !loading && (
            <div className="flex justify-center pt-8">
              <Button onClick={loadMore} variant="outline" size="lg">
                Load More Movies
              </Button>
            </div>
          )}

          {loading && movies.length > 0 && (
            <div className="flex justify-center pt-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}
        </>
      )}
    </section>
  )
}
