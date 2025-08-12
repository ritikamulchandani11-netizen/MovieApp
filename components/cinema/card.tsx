"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface CinemaCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const CinemaCard = React.forwardRef<HTMLDivElement, CinemaCardProps>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "cinema-gradient rounded-xl border border-gold/20 movie-shadow backdrop-blur-sm",
        "transition-all duration-300 hover:border-gold/40 hover:movie-shadow",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
})
CinemaCard.displayName = "CinemaCard"

interface CinemaCardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const CinemaCardContent = React.forwardRef<HTMLDivElement, CinemaCardContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("p-6", className)} {...props}>
        {children}
      </div>
    )
  },
)
CinemaCardContent.displayName = "CinemaCardContent"

export { CinemaCard, CinemaCardContent }
