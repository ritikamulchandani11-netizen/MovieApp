"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface CinemaInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const CinemaInput = React.forwardRef<HTMLInputElement, CinemaInputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-12 w-full rounded-lg cinema-gradient border border-gold/30 px-4 py-3 text-sm",
        "placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-gold focus-visible:border-gold/60 disabled:cursor-not-allowed disabled:opacity-50",
        "transition-all duration-300 hover:border-gold/50 text-foreground bg-transparent",
        className,
      )}
      ref={ref}
      {...props}
    />
  )
})
CinemaInput.displayName = "CinemaInput"

export { CinemaInput }
