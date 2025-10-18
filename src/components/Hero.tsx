/**
 * Copyright (c) 2025 Roman Reinelt / RNLT Labs
 *
 * This software is proprietary and confidential.
 * Unauthorized use, reproduction, or distribution is prohibited.
 * For licensing information, contact: hello@rnltlabs.de
 */

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Sparkles, Route, Award } from "lucide-react"

interface HeroProps {
  onGetStarted: () => void
}

export function Hero({ onGetStarted }: HeroProps) {
  return (
    <div className="relative h-full flex items-center justify-center bg-gradient-to-b from-background via-background to-muted/20">
      {/* Grid pattern background */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,transparent,black)] dark:bg-grid-slate-700/25" />

      {/* Content */}
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center space-y-8 max-w-3xl mx-auto">
          {/* Badge */}
          <Badge variant="secondary" className="gap-1.5 px-3 py-1">
            <Sparkles className="h-3 w-3" />
            <span className="text-xs font-medium">GPS Route Drawing Made Simple</span>
          </Badge>

          {/* Headline */}
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
              Turn your runs into
              <span className="block mt-2 bg-gradient-to-r from-primary via-orange-500 to-primary bg-clip-text text-transparent">
                GPS art
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Draw unicorns, spell words, create proposals. Export to GPX and upload to Strava for all the kudos.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Button
              size="lg"
              onClick={onGetStarted}
              className="gap-2 h-12 px-8 text-base font-medium"
            >
              Start Drawing
              <ArrowRight className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Route className="h-4 w-4" />
                <span>Free forever</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Award className="h-4 w-4" />
                <span>No signup</span>
              </div>
            </div>
          </div>

          {/* Example Route Preview */}
          <div className="mt-8 w-full max-w-md mx-auto">
            <div className="relative rounded-lg border bg-card/50 backdrop-blur-sm p-4 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center text-white font-bold text-sm">
                  R
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">Example Route</p>
                  <p className="text-xs text-muted-foreground">The Unicorn • 2.8 km</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  247 ❤️
                </Badge>
              </div>
              <div className="w-full h-32 rounded-md bg-muted/50 flex items-center justify-center">
                <img
                  src={`${import.meta.env.BASE_URL}unicorn-example.png`}
                  alt="Unicorn Route Example"
                  className="h-full w-auto object-contain opacity-90"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
