export interface Movie {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  vote_count: number
  popularity: number
  adult: boolean
  genre_ids: number[]
  original_language: string
  original_title: string
  video: boolean
}

// Movie list response from TMDB API
export interface MovieListResponse {
  page: number
  results: Movie[]
  total_pages: number
  total_results: number
}

// Detailed movie information
export interface MovieDetails extends Omit<Movie, "genre_ids"> {
  budget: number
  genres: Genre[]
  homepage: string | null
  imdb_id: string | null
  production_companies: ProductionCompany[]
  production_countries: ProductionCountry[]
  revenue: number
  runtime: number | null
  spoken_languages: SpokenLanguage[]
  status: string
  tagline: string | null
}

// Genre interface
export interface Genre {
  id: number
  name: string
}

// Production company interface
export interface ProductionCompany {
  id: number
  logo_path: string | null
  name: string
  origin_country: string
}

// Production country interface
export interface ProductionCountry {
  iso_3166_1: string
  name: string
}

// Spoken language interface
export interface SpokenLanguage {
  english_name: string
  iso_639_1: string
  name: string
}

// Cast member interface
export interface CastMember {
  id: number
  name: string
  character: string
  profile_path: string | null
  order: number
}

// Crew member interface
export interface CrewMember {
  id: number
  name: string
  job: string
  department: string
  profile_path: string | null
}

// Movie credits interface
export interface MovieCredits {
  id: number
  cast: CastMember[]
  crew: CrewMember[]
}

// Alias for consistency with component
export interface Credits extends MovieCredits {}

// Local favorites interface (for localStorage)
export interface FavoriteMovie {
  id: number
  title: string
  poster_path: string | null
  release_date: string
  vote_average: number
  addedAt: string
}
