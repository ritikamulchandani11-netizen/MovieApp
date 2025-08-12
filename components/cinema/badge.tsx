"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface CinemaBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "gold" | "outline"
  children: React.ReactNode
}

const CinemaBadge = React.forwardRef<HTMLDivElement, CinemaBadgeProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    const variants = {
      default: "backdrop-blur-cinema text-white border border-white/20",
      gold: "gold-gradient text-black border border-gold/30",
      outline: "border-2 border-gold/50 text-gold bg-black/40 backdrop-blur-sm",
    }

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-all duration-300",
          variants[variant],
          className,
        )}
        {...props}
      >
        {children}
      </div>
    )
  },
)
CinemaBadge.displayName = "CinemaBadge"

export { CinemaBadge }
