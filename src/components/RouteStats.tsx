import { Download, TrendingUp, TrendingDown, Route } from "lucide-react"
import { Button } from "@/components/ui/button"

interface RouteStatsProps {
  distance: number
  ascend: number
  descend: number
  onExport: () => void
}

export function RouteStats({ distance, ascend, descend, onExport }: RouteStatsProps) {
  return (
    <div className="border-b bg-white/95 backdrop-blur">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-6 lg:gap-8">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Route className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Distance</p>
                <p className="text-lg font-semibold tabular-nums">{(distance / 1000).toFixed(2)} km</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Elevation +</p>
                <p className="text-lg font-semibold tabular-nums">{ascend.toFixed(0)} m</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <TrendingDown className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Elevation -</p>
                <p className="text-lg font-semibold tabular-nums">{descend.toFixed(0)} m</p>
              </div>
            </div>
          </div>

          <Button
            onClick={onExport}
            className="gap-2 font-medium px-6"
          >
            <Download className="h-4 w-4" />
            Export GPX
          </Button>
        </div>
      </div>
    </div>
  )
}
