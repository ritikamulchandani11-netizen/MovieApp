"use client"

import { useState, useEffect, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { CinemaInput } from "@/components/cinema/input"
import { CinemaButton } from "@/components/cinema/button"
import { MovieGrid } from "@/components/movie-grid"
import { tmdbClient } from "@/lib/tmdb"
import type { Movie } from "@/types/movie"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [query, setQuery] = useState(searchParams.get("q") || "")
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [totalResults, setTotalResults] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const searchMovies = useCallback(async (searchQuery: string, pageNum = 1, append = false) => {
    if (!searchQuery.trim()) {
      setMovies([])
      setHasMore(false)
      setTotalResults(0)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await tmdbClient.searchMovies(searchQuery, pageNum)

      if (append) {
        setMovies((prev) => [...prev, ...response.results])
      } else {
        setMovies(response.results)
      }

      setPage(pageNum)
      setHasMore(pageNum < response.total_pages)
      setTotalResults(response.total_results)
    } catch (error) {
      console.error("Search error:", error)
      setError(error instanceof Error ? error.message : "Failed to search movies")
    } finally {
      setLoading(false)
    }
  }, [])

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query !== searchParams.get("q")) {
        const params = new URLSearchParams(searchParams.toString())
        if (query) {
          params.set("q", query)
        } else {
          params.delete("q")
        }
        router.replace(`/search?${params.toString()}`)
      }

      searchMovies(query, 1, false)
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [query, searchMovies, router, searchParams])

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      searchMovies(query, page + 1, true)
    }
  }

  const handleFavoriteChange = () => {
    setMovies((prev) => [...prev])
  }

  const handleRetry = () => {
    searchMovies(query, 1, false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto mb-8">
          <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-gold via-gold-light to-gold bg-clip-text text-transparent">
            Search Movies
          </h1>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gold/60 h-5 w-5" />
            <CinemaInput
              type="text"
              placeholder="Search for movies..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-12 text-lg h-14 bg-black/60 border-gold/30 text-white placeholder:text-gold/60"
            />
          </div>

          {query && totalResults > 0 && (
            <p className="text-gold/80 text-center mt-6 text-lg">
              Found <span className="text-gold font-semibold">{totalResults.toLocaleString()}</span> results for "
              {query}"
            </p>
          )}
        </div>

        {error && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 text-center backdrop-blur-sm">
              <p className="text-red-300 mb-4 text-lg">{error}</p>
              <CinemaButton onClick={handleRetry} variant="secondary" size="sm">
                Try Again
              </CinemaButton>
            </div>
          </div>
        )}

        {!error && query && (
          <>
            {movies.length === 0 && !loading && (
              <div className="text-center py-16">
                <Search className="h-20 w-20 text-gold/40 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold mb-4 text-gold-light">No movies found</h3>
                <p className="text-gold/60 text-lg">Try searching with different keywords</p>
              </div>
            )}

            {movies.length > 0 && (
              <>
                <MovieGrid
                  movies={movies}
                  loading={loading && movies.length === 0}
                  onFavoriteChange={handleFavoriteChange}
                />

                {hasMore && !loading && (
                  <div className="flex justify-center pt-12">
                    <CinemaButton onClick={handleLoadMore} variant="secondary" size="lg">
                      Load More Results
                    </CinemaButton>
                  </div>
                )}

                {loading && movies.length > 0 && (
                  <div className="flex justify-center pt-8">
                    <div className="animate-spin rounded-full h-10 w-10 border-2 border-gold/30 border-t-gold"></div>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {!query && (
          <div className="text-center py-16">
            <Search className="h-20 w-20 text-gold/40 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold mb-4 text-gold-light">Search for Movies</h3>
            <p className="text-gold/60 text-lg">Enter a movie title, actor, or keyword to get started</p>
          </div>
        )}
      </div>
    </div>
  )
}
