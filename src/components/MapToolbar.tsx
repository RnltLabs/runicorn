/**
 * Copyright (c) 2025 Roman Reinelt / RNLT Labs
 *
 * This software is proprietary and confidential.
 * Unauthorized use, reproduction, or distribution is prohibited.
 * For licensing information, contact: hello@rnltlabs.de
 */

import { useState, type FormEvent, useEffect, useRef } from "react"
import { Search, Download, TrendingUp, TrendingDown, Route, MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { OpenStreetMapProvider } from 'leaflet-geosearch'

const provider = new OpenStreetMapProvider()

// Type definition for search results from leaflet-geosearch
interface SearchResultType {
  x: number
  y: number
  label: string
  raw?: unknown
}

interface MapToolbarProps {
  onSearch: (query: string) => void
  routeStats?: {
    distance: number
    ascend: number
    descend: number
  }
  onExport: () => void
}

export function MapToolbar({ onSearch, routeStats, onExport }: MapToolbarProps) {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<SearchResultType[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Debounce search
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    const timeoutId = setTimeout(async () => {
      try {
        const results = await provider.search({ query })
        const limitedResults = results.slice(0, 5)
        setSuggestions(limitedResults)
        setShowSuggestions(limitedResults.length > 0)
      } catch (error) {
        console.error('Search error:', error)
        setSuggestions([])
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query])

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query)
      setShowSuggestions(false)
    }
  }

  const handleSuggestionClick = (suggestion: SearchResultType) => {
    setQuery(suggestion.label)
    onSearch(suggestion.label)
    setShowSuggestions(false)
    setSelectedIndex(-1)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1))
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault()
      handleSuggestionClick(suggestions[selectedIndex])
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
      setSelectedIndex(-1)
    }
  }

  return (
    <div className="border-b bg-card/95 backdrop-blur-lg overflow-visible relative z-[10000]">
      <div className="container mx-auto px-4 py-3 overflow-visible">
        <div className="flex flex-col gap-3 overflow-visible relative">
          {/* Row 1: Search + Export Button (Mobile) / Search, Stats, Export (Desktop) */}
          <div className="flex items-center gap-2 md:gap-3 overflow-visible relative">
            {/* Search - Left */}
            <form onSubmit={handleSubmit} className="flex gap-2 flex-1 md:w-64 md:flex-1-0 relative">
              <div className="relative flex-1 z-50" ref={searchRef}>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
                <Input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                  placeholder="Search location..."
                  className="pl-9 h-11"
                  autoComplete="off"
                />

                {/* Suggestions Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-xl overflow-hidden z-[10001] max-h-64 overflow-y-auto"
                       style={{ minWidth: '250px' }}>
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleSuggestionClick(suggestion)}
                        className={`w-full px-3 py-3 text-left hover:bg-accent flex items-start gap-2 transition-colors ${
                          index === selectedIndex ? 'bg-accent' : ''
                        }`}
                      >
                        <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">{suggestion.label}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </form>

            {/* Stats - Center - Desktop only in this row */}
            <div className="hidden md:flex md:absolute md:left-1/2 md:-translate-x-1/2 items-center justify-center gap-4">
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Route className="h-4 w-4 text-primary" />
                </div>
                <div className="text-sm">
                  <span className="font-semibold tabular-nums">
                    {routeStats ? (routeStats.distance / 1000).toFixed(2) : '-'}
                  </span>
                  <span className="text-muted-foreground ml-1">km</span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-primary" />
                </div>
                <div className="text-sm">
                  <span className="font-semibold tabular-nums">
                    {routeStats ? routeStats.ascend.toFixed(0) : '-'}
                  </span>
                  <span className="text-muted-foreground ml-1">m</span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <TrendingDown className="h-4 w-4 text-primary" />
                </div>
                <div className="text-sm">
                  <span className="font-semibold tabular-nums">
                    {routeStats ? routeStats.descend.toFixed(0) : '-'}
                  </span>
                  <span className="text-muted-foreground ml-1">m</span>
                </div>
              </div>
            </div>

            {/* Export - Right */}
            <Button
              onClick={onExport}
              className={`gap-2 h-11 md:ml-auto flex-shrink-0 ${!routeStats ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export GPX</span>
              <span className="sm:hidden">GPX</span>
            </Button>
          </div>

          {/* Row 2: Stats - Mobile only */}
          <div className="flex md:hidden items-center justify-center gap-4 overflow-x-auto pb-1">
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Route className="h-4 w-4 text-primary" />
              </div>
              <div className="text-sm">
                <span className="font-semibold tabular-nums">
                  {routeStats ? (routeStats.distance / 1000).toFixed(2) : '-'}
                </span>
                <span className="text-muted-foreground ml-1">km</span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
              <div className="text-sm">
                <span className="font-semibold tabular-nums">
                  {routeStats ? routeStats.ascend.toFixed(0) : '-'}
                </span>
                <span className="text-muted-foreground ml-1">m</span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingDown className="h-4 w-4 text-primary" />
              </div>
              <div className="text-sm">
                <span className="font-semibold tabular-nums">
                  {routeStats ? routeStats.descend.toFixed(0) : '-'}
                </span>
                <span className="text-muted-foreground ml-1">m</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
