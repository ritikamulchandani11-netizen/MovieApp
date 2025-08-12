"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface CinemaButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline"
  size?: "sm" | "md" | "lg" | "icon"
  asChild?: boolean
  children: React.ReactNode
}

const CinemaButton = React.forwardRef<HTMLButtonElement, CinemaButtonProps>(
  ({ className, variant = "primary", size = "md", asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? "span" : "button"

    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover-glow"

    const variants = {
      primary: "gold-gradient text-black shadow-lg hover:shadow-xl border border-gold/20",
      secondary: "cinema-gradient text-gold border border-gold/30 hover:border-gold/50",
      ghost: "hover:cinema-gradient hover:text-gold-light text-muted-foreground",
      outline: "border-2 border-gold/40 text-gold hover:cinema-gradient hover:border-gold/60",
    }

    const sizes = {
      sm: "h-8 px-3 text-sm rounded-md",
      md: "h-10 px-4 py-2 rounded-lg",
      lg: "h-12 px-6 text-lg rounded-xl",
      icon: "h-10 w-10 rounded-lg",
    }

    return (
      <Comp className={cn(baseStyles, variants[variant], sizes[size], className)} ref={ref} {...props}>
        {children}
      </Comp>
    )
  },
)
CinemaButton.displayName = "CinemaButton"

export { CinemaButton }
