"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Film, Search, Heart, User, LogIn, Menu, X } from "lucide-react"
import { CinemaButton } from "@/components/cinema/button"
import { CinemaInput } from "@/components/cinema/input"
import { ThemeToggle } from "@/components/theme-toggle"
import { getCurrentUser, logoutUser } from "@/lib/auth"
import type { User as UserType } from "@/lib/auth"

const navigationItems = [
  {
    name: "Movies",
    href: "/",
    icon: Film,
  },
  {
    name: "Search",
    href: "/search",
    icon: Search,
  },
  {
    name: "Favorites",
    href: "/favorites",
    icon: Heart,
  },
]

export function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<UserType | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    setUser(getCurrentUser())
  }, [pathname])

  const handleLogout = () => {
    logoutUser()
    setUser(null)
    setMobileMenuOpen(false)
    window.location.href = "/"
  }

  const handleSearchInput = (value: string) => {
    setSearchQuery(value)
    if (value.trim()) {
      router.push(`/search?q=${encodeURIComponent(value)}`)
    }
  }

  const handleSearchFocus = () => {
    if (pathname !== "/search") {
      router.push("/search")
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gold/20 backdrop-blur-cinema bg-black/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 hover-glow rounded-lg px-3 py-2 flex-shrink-0">
            <Film className="h-6 w-6 text-gold" />
            <span className="font-bold text-xl text-gold-light hidden sm:block">MovieExplorer</span>
            <span className="font-bold text-lg text-gold-light sm:hidden">ME</span>
          </Link>

          {/* Desktop Search - only show if not on search page */}
          {pathname !== "/search" && (
            <div className="hidden lg:block flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gold/60 h-4 w-4" />
                <CinemaInput
                  type="text"
                  placeholder="Search movies..."
                  value={searchQuery}
                  onChange={(e) => handleSearchInput(e.target.value)}
                  onFocus={handleSearchFocus}
                  className="pl-10 bg-black/40 border-gold/30 text-white placeholder:text-gold/60"
                />
              </div>
            </div>
          )}

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2 flex-shrink-0">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))

              return (
                <CinemaButton
                  key={item.name}
                  variant={isActive ? "primary" : "ghost"}
                  size="sm"
                  asChild
                  className="flex items-center space-x-2 px-3 py-2 min-w-fit"
                >
                  <Link href={item.href}>
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span className="hidden xl:inline whitespace-nowrap">{item.name}</span>
                  </Link>
                </CinemaButton>
              )
            })}

            <div className="flex items-center space-x-2 ml-2 border-l border-gold/20 pl-2">
              <ThemeToggle />

              {user ? (
                <CinemaButton
                  variant={pathname === "/profile" ? "primary" : "ghost"}
                  size="sm"
                  asChild
                  className="flex items-center space-x-2 px-3 py-2"
                >
                  <Link href="/profile">
                    <User className="h-4 w-4 flex-shrink-0" />
                    <span className="hidden xl:inline whitespace-nowrap">{user.name}</span>
                  </Link>
                </CinemaButton>
              ) : (
                <CinemaButton variant="ghost" size="sm" asChild className="flex items-center space-x-2 px-3 py-2">
                  <Link href="/login">
                    <LogIn className="h-4 w-4 flex-shrink-0" />
                    <span className="hidden xl:inline whitespace-nowrap">Sign In</span>
                  </Link>
                </CinemaButton>
              )}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <CinemaButton
            variant="ghost"
            size="icon"
            className="md:hidden flex-shrink-0"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </CinemaButton>
        </div>

        {/* Mobile Search - only show if not on search page */}
        {pathname !== "/search" && (
          <div className="lg:hidden border-t border-gold/20 px-0 py-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gold/60 h-4 w-4" />
              <CinemaInput
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => handleSearchInput(e.target.value)}
                onFocus={handleSearchFocus}
                className="pl-10 bg-black/40 border-gold/30 text-white placeholder:text-gold/60"
              />
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gold/20 py-4 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))

              return (
                <CinemaButton
                  key={item.name}
                  variant={isActive ? "primary" : "ghost"}
                  size="sm"
                  asChild
                  className="w-full justify-start space-x-3 px-4 py-3"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Link href={item.href}>
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                </CinemaButton>
              )
            })}

            <div className="flex items-center justify-between pt-4 border-t border-gold/20 px-4">
              <ThemeToggle />

              {user ? (
                <CinemaButton
                  variant={pathname === "/profile" ? "primary" : "ghost"}
                  size="sm"
                  asChild
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Link href="/profile" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>{user.name}</span>
                  </Link>
                </CinemaButton>
              ) : (
                <CinemaButton variant="ghost" size="sm" asChild onClick={() => setMobileMenuOpen(false)}>
                  <Link href="/login" className="flex items-center space-x-2">
                    <LogIn className="h-4 w-4" />
                    <span>Sign In</span>
                  </Link>
                </CinemaButton>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
