const TMDB_BASE_URL = "https://api.themoviedb.org/3"
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p"

// TMDB API client
class TMDBClient {
  private apiKey: string

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY || ""
  }

  private async request<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    if (!this.apiKey) {
      throw new Error(
        "TMDB API key is not configured. Please add NEXT_PUBLIC_TMDB_API_KEY to your environment variables.",
      )
    }

    const url = new URL(`${TMDB_BASE_URL}${endpoint}`)
    url.searchParams.append("api_key", this.apiKey)

    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value)
    })

    try {
      const response = await fetch(url.toString())

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Invalid TMDB API key. Please check your NEXT_PUBLIC_TMDB_API_KEY environment variable.")
        }
        throw new Error(`TMDB API error: ${response.status} ${response.statusText}`)
      }

      return response.json()
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error("Network error: Unable to connect to TMDB API. Please check your internet connection.")
      }
      throw error
    }
  }

  // Get popular movies
  async getPopularMovies(page = 1): Promise<any> {
    return this.request<any>("/movie/popular", { page: page.toString() })
  }

  // Get now playing movies
  async getNowPlayingMovies(page = 1): Promise<any> {
    return this.request<any>("/movie/now_playing", { page: page.toString() })
  }

  // Get top rated movies
  async getTopRatedMovies(page = 1): Promise<any> {
    return this.request<any>("/movie/top_rated", { page: page.toString() })
  }

  // Search movies
  async searchMovies(query: string, page = 1): Promise<any> {
    return this.request<any>("/search/movie", {
      query: encodeURIComponent(query),
      page: page.toString(),
    })
  }

  // Get movie details
  async getMovieDetails(movieId: number): Promise<any> {
    return this.request<any>(`/movie/${movieId}`)
  }

  // Get movie credits
  async getMovieCredits(movieId: number): Promise<any> {
    return this.request<any>(`/movie/${movieId}/credits`)
  }

  // Helper method to get full image URL
  getImageUrl(path: string | null, size: "w200" | "w300" | "w400" | "w500" | "w780" | "original" = "w500"): string {
    if (!path) return "/placeholder.svg?height=750&width=500"
    return `${TMDB_IMAGE_BASE_URL}/${size}${path}`
  }

  // Helper method to get backdrop URL
  getBackdropUrl(path: string | null, size: "w300" | "w780" | "w1280" | "original" = "w1280"): string {
    if (!path) return "/placeholder.svg?height=720&width=1280"
    return `${TMDB_IMAGE_BASE_URL}/${size}${path}`
  }
}

// Export singleton instance
export const tmdbClient = new TMDBClient()
