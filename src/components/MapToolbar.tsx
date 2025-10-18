import { useState, FormEvent } from "react"
import { Search, Download, TrendingUp, TrendingDown, Route } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query)
    }
  }

  return (
    <div className="border-b bg-white/95 backdrop-blur-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search - Left */}
          <form onSubmit={handleSubmit} className="flex gap-2 md:w-64">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search location..."
                className="pl-9 h-10"
              />
            </div>
          </form>

          {/* Stats - Center - Always visible */}
          <div className="flex-1 flex items-center justify-center gap-4 overflow-x-auto pb-1 md:pb-0">
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
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
              <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="text-sm">
                <span className="font-semibold tabular-nums">
                  {routeStats ? routeStats.ascend.toFixed(0) : '-'}
                </span>
                <span className="text-muted-foreground ml-1">m</span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <TrendingDown className="h-4 w-4 text-blue-600" />
              </div>
              <div className="text-sm">
                <span className="font-semibold tabular-nums">
                  {routeStats ? routeStats.descend.toFixed(0) : '-'}
                </span>
                <span className="text-muted-foreground ml-1">m</span>
              </div>
            </div>
          </div>

          {/* Export - Right - Always visible */}
          <Button
            onClick={onExport}
            className={`gap-2 md:ml-auto w-full md:w-auto ${!routeStats ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Download className="h-4 w-4" />
            Export GPX
          </Button>
        </div>
      </div>
    </div>
  )
}
