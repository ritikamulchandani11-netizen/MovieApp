"use client"

import type React from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, Star } from "lucide-react"
import { CinemaCard, CinemaCardContent } from "@/components/cinema/card"
import { CinemaButton } from "@/components/cinema/button"
import { CinemaBadge } from "@/components/cinema/badge"
import { tmdbClient } from "@/lib/tmdb"
import { toggleFavorite, isFavorite } from "@/lib/favorites"
import type { Movie } from "@/types/movie"
import { useState, useEffect } from "react"

interface MovieCardProps {
  movie: Movie
  onFavoriteChange?: () => void
}

export function MovieCard({ movie, onFavoriteChange }: MovieCardProps) {
  const [isMovieFavorite, setIsMovieFavorite] = useState(false)

  useEffect(() => {
    setIsMovieFavorite(isFavorite(movie.id))
  }, [movie.id])

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const newFavoriteStatus = toggleFavorite(movie)
    setIsMovieFavorite(newFavoriteStatus)
    onFavoriteChange?.()
  }

  const formatReleaseYear = (dateString: string) => {
    return dateString ? new Date(dateString).getFullYear() : "TBA"
  }

  const formatRating = (rating: number) => {
    return rating.toFixed(1)
  }

  return (
    // Enhanced responsive movie card with better mobile interactions
    <CinemaCard className="group overflow-hidden transition-all duration-500 hover:scale-105 hover:rotate-1">
      <Link href={`/movie/${movie.id}`}>
        <div className="relative aspect-[2/3] overflow-hidden">
          <Image
            src={tmdbClient.getImageUrl(movie.poster_path, "w500") || "/placeholder.svg"}
            alt={movie.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <CinemaButton
            variant="ghost"
            size="icon"
            className="absolute top-2 sm:top-3 right-2 sm:right-3 backdrop-blur-cinema opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 h-8 w-8 sm:h-10 sm:w-10"
            onClick={handleFavoriteClick}
          >
            <Heart
              className={`h-4 w-4 sm:h-5 sm:w-5 ${isMovieFavorite ? "fill-red-500 text-red-500" : "text-white"}`}
            />
          </CinemaButton>

          <CinemaBadge variant="gold" className="absolute top-2 sm:top-3 left-2 sm:left-3 text-xs">
            <Star className="h-2 w-2 sm:h-3 sm:w-3 mr-1 fill-current" />
            {formatRating(movie.vote_average)}
          </CinemaBadge>
        </div>
      </Link>

      <CinemaCardContent className="p-3 sm:p-4">
        <Link href={`/movie/${movie.id}`}>
          <h3 className="font-bold text-sm sm:text-base lg:text-lg line-clamp-2 mb-2 text-gold-light group-hover:text-gold transition-colors duration-300">
            {movie.title}
          </h3>
        </Link>

        <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">
          <span className="text-gold/80">{formatReleaseYear(movie.release_date)}</span>
          <span className="hidden sm:inline">{movie.vote_count} votes</span>
        </div>

        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 sm:line-clamp-3 leading-relaxed">
          {movie.overview}
        </p>
      </CinemaCardContent>
    </CinemaCard>
  )
}
