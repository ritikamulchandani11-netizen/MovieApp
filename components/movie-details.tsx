"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Heart, Star, Calendar, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { tmdbClient } from "@/lib/tmdb"
import { addToFavorites, removeFromFavorites, isFavorite } from "@/lib/favorites"
import type { Movie, MovieCredits } from "@/types/movie"

interface MovieDetailsProps {
  movie: Movie & {
    runtime?: number
    genres?: Array<{ id: number; name: string }>
    production_countries?: Array<{ name: string }>
    budget?: number
    revenue?: number
    tagline?: string
  }
  credits: MovieCredits
}

export function MovieDetails({ movie, credits }: MovieDetailsProps) {
  const [isFav, setIsFav] = useState(isFavorite(movie.id))

  const toggleFavorite = () => {
    if (isFav) {
      removeFromFavorites(movie.id)
      setIsFav(false)
    } else {
      addToFavorites(movie)
      setIsFav(true)
    }
  }

  const formatRuntime = (minutes?: number) => {
    if (!minutes) return "N/A"
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const formatCurrency = (amount?: number) => {
    if (!amount) return "N/A"
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const director = credits.crew?.find((person) => person.job === "Director")
  const mainCast = credits.cast?.slice(0, 8) || []

  return (
    <div className="relative">
      {/* Backdrop */}
      <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <Image
          src={tmdbClient.getBackdropUrl(movie.backdrop_path, "original") || "/placeholder.svg"}
          alt={movie.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

        {/* Back button */}
        <div className="absolute top-4 left-4 z-10">
          <Link href="/">
            <Button variant="secondary" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 -mt-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Poster */}
          <div className="lg:col-span-1">
            <Card className="overflow-hidden">
              <div className="aspect-[2/3] relative">
                <Image
                  src={tmdbClient.getImageUrl(movie.poster_path, "w500") || "/placeholder.svg"}
                  alt={movie.title}
                  fill
                  className="object-cover"
                />
              </div>
            </Card>
          </div>

          {/* Movie Info */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
              {movie.tagline && <p className="text-lg text-muted-foreground italic mb-4">{movie.tagline}</p>}

              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{movie.vote_average?.toFixed(1)}</span>
                  <span className="text-muted-foreground">({movie.vote_count} votes)</span>
                </div>

                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(movie.release_date).getFullYear()}</span>
                </div>

                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{formatRuntime(movie.runtime)}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genres?.map((genre) => (
                  <Badge key={genre.id} variant="secondary">
                    {genre.name}
                  </Badge>
                ))}
              </div>

              <div className="flex gap-3 mb-6">
                <Button onClick={toggleFavorite} variant={isFav ? "default" : "outline"} className="gap-2">
                  <Heart className={`h-4 w-4 ${isFav ? "fill-current" : ""}`} />
                  {isFav ? "Remove from Favorites" : "Add to Favorites"}
                </Button>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-3">Overview</h2>
              <p className="text-muted-foreground leading-relaxed">{movie.overview}</p>
            </div>

            {director && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Director</h3>
                <p>{director.name}</p>
              </div>
            )}

            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">Budget</h4>
                  <p className="text-muted-foreground">{formatCurrency(movie.budget)}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">Revenue</h4>
                  <p className="text-muted-foreground">{formatCurrency(movie.revenue)}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Cast */}
        {mainCast.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-6">Cast</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {mainCast.map((actor) => (
                <Card key={actor.id} className="overflow-hidden">
                  <div className="aspect-[2/3] relative">
                    <Image
                      src={tmdbClient.getImageUrl(actor.profile_path, "w200") || "/placeholder.svg"}
                      alt={actor.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-3">
                    <h4 className="font-semibold text-sm truncate">{actor.name}</h4>
                    <p className="text-xs text-muted-foreground truncate">{actor.character}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
