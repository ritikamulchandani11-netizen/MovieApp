import type { FavoriteMovie, Movie } from "@/types/movie"

const FAVORITES_KEY = "movie-explorer-favorites"

// Get all favorites from localStorage
export function getFavorites(): FavoriteMovie[] {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem(FAVORITES_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error("Error reading favorites from localStorage:", error)
    return []
  }
}

// Add movie to favorites
export function addToFavorites(movie: Movie): void {
  if (typeof window === "undefined") return

  try {
    const favorites = getFavorites()
    const isAlreadyFavorite = favorites.some((fav) => fav.id === movie.id)

    if (!isAlreadyFavorite) {
      const favoriteMovie: FavoriteMovie = {
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
        addedAt: new Date().toISOString(),
      }

      const updatedFavorites = [favoriteMovie, ...favorites]
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites))
    }
  } catch (error) {
    console.error("Error adding to favorites:", error)
  }
}

// Remove movie from favorites
export function removeFromFavorites(movieId: number): void {
  if (typeof window === "undefined") return

  try {
    const favorites = getFavorites()
    const updatedFavorites = favorites.filter((fav) => fav.id !== movieId)
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites))
  } catch (error) {
    console.error("Error removing from favorites:", error)
  }
}

// Check if movie is in favorites
export function isFavorite(movieId: number): boolean {
  const favorites = getFavorites()
  return favorites.some((fav) => fav.id === movieId)
}

// Toggle favorite status
export function toggleFavorite(movie: Movie): boolean {
  const isCurrentlyFavorite = isFavorite(movie.id)

  if (isCurrentlyFavorite) {
    removeFromFavorites(movie.id)
    return false
  } else {
    addToFavorites(movie)
    return true
  }
}
