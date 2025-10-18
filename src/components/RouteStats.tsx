/**
 * Copyright (c) 2025 Roman Reinelt / RNLT Labs
 *
 * This software is proprietary and confidential.
 * Unauthorized use, reproduction, or distribution is prohibited.
 * For licensing information, contact: hello@rnltlabs.de
 */

import { Download, TrendingUp, TrendingDown, Route } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

interface RouteStatsProps {
  distance: number
  ascend: number
  descend: number
  onExport: () => void
}

export function RouteStats({ distance, ascend, descend, onExport }: RouteStatsProps) {
  return (
    <div className="border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Stats Section */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-4">
            {/* Distance */}
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center h-11 w-11 rounded-md bg-primary/10">
                <Route className="h-5 w-5 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Distance</span>
                <span className="text-base font-semibold tabular-nums">{(distance / 1000).toFixed(2)} km</span>
              </div>
            </div>

            <Separator orientation="vertical" className="h-10 hidden sm:block" />

            {/* Elevation Gain */}
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center h-11 w-11 rounded-md bg-emerald-500/10">
                <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Gain</span>
                <span className="text-base font-semibold tabular-nums">{ascend.toFixed(0)} m</span>
              </div>
            </div>

            <Separator orientation="vertical" className="h-10 hidden sm:block" />

            {/* Elevation Loss */}
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center h-11 w-11 rounded-md bg-blue-500/10">
                <TrendingDown className="h-5 w-5 text-blue-600 dark:text-blue-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Loss</span>
                <span className="text-base font-semibold tabular-nums">{descend.toFixed(0)} m</span>
              </div>
            </div>
          </div>

          {/* Export Button */}
          <Button
            onClick={onExport}
            className="gap-2 h-11 px-4 font-medium w-full sm:w-auto"
          >
            <Download className="h-4 w-4" />
            Export GPX
          </Button>
        </div>
      </div>
    </div>
  )
}
