"use client"

import { useState, useEffect } from "react"
import { Heart, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MovieGrid } from "@/components/movie-grid"
import { getFavorites, removeFromFavorites } from "@/lib/favorites"
import type { FavoriteMovie, Movie } from "@/types/movie"

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteMovie[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<"added" | "title" | "rating" | "year">("added")

  useEffect(() => {
    const loadFavorites = () => {
      const favs = getFavorites()
      setFavorites(favs)
      setLoading(false)
    }

    loadFavorites()
  }, [])

  const handleRemoveFromFavorites = (movieId: number) => {
    removeFromFavorites(movieId)
    setFavorites((prev) => prev.filter((fav) => fav.id !== movieId))
  }

  const handleClearAllFavorites = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("movie-explorer-favorites")
      setFavorites([])
    }
  }

  const handleFavoriteChange = () => {
    // Reload favorites when a movie is unfavorited from the grid
    const updatedFavorites = getFavorites()
    setFavorites(updatedFavorites)
  }

  const sortedFavorites = [...favorites].sort((a, b) => {
    switch (sortBy) {
      case "title":
        return a.title.localeCompare(b.title)
      case "rating":
        return b.vote_average - a.vote_average
      case "year":
        return new Date(b.release_date).getFullYear() - new Date(a.release_date).getFullYear()
      case "added":
      default:
        return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
    }
  })

  // Convert FavoriteMovie to Movie for MovieGrid compatibility
  const moviesForGrid: Movie[] = sortedFavorites.map((fav) => ({
    id: fav.id,
    title: fav.title,
    poster_path: fav.poster_path,
    release_date: fav.release_date,
    vote_average: fav.vote_average,
    overview: "", // Not stored in favorites
    backdrop_path: null,
    vote_count: 0,
    popularity: 0,
    adult: false,
    genre_ids: [],
    original_language: "",
    original_title: fav.title,
    video: false,
  }))

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Favorites</h1>
          <p className="text-muted-foreground">
            {favorites.length} {favorites.length === 1 ? "movie" : "movies"} in your collection
          </p>
        </div>

        {favorites.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-0">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="px-3 py-2 border rounded-md bg-background"
            >
              <option value="added">Recently Added</option>
              <option value="title">Title (A-Z)</option>
              <option value="rating">Highest Rated</option>
              <option value="year">Newest First</option>
            </select>

            <Button
              variant="outline"
              size="sm"
              onClick={handleClearAllFavorites}
              className="gap-2 text-red-600 hover:text-red-700 bg-transparent"
            >
              <Trash2 className="h-4 w-4" />
              Clear All
            </Button>
          </div>
        )}
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-16">
          <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No favorites yet</h3>
          <p className="text-muted-foreground mb-6">
            Start adding movies to your favorites by clicking the heart icon on any movie
          </p>
          <Button asChild>
            <a href="/">Browse Movies</a>
          </Button>
        </div>
      ) : (
        <>
          <MovieGrid movies={moviesForGrid} onFavoriteChange={handleFavoriteChange} />

          {/* Favorites Stats */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <h4 className="font-semibold text-lg mb-2">Total Movies</h4>
                <p className="text-3xl font-bold text-primary">{favorites.length}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <h4 className="font-semibold text-lg mb-2">Average Rating</h4>
                <p className="text-3xl font-bold text-primary">
                  {favorites.length > 0
                    ? (favorites.reduce((sum, fav) => sum + fav.vote_average, 0) / favorites.length).toFixed(1)
                    : "0.0"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <h4 className="font-semibold text-lg mb-2">Latest Addition</h4>
                <p className="text-sm text-muted-foreground">
                  {favorites.length > 0 ? new Date(favorites[0].addedAt).toLocaleDateString() : "None yet"}
                </p>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
