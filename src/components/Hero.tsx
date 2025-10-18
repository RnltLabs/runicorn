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
              Draw it. Export it. Run it. Upload it. Watch the kudos roll in 🔥
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

          {/* Example Routes Grid */}
          <div className="mt-12 w-full max-w-4xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Unicorn Route */}
              <div className="group relative rounded-lg border bg-card/50 backdrop-blur-sm p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center text-white font-bold text-sm">
                    R
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">The Unicorn</p>
                    <p className="text-xs text-muted-foreground">2.8 km</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    247 ❤️
                  </Badge>
                </div>
                <div className="w-full h-32 rounded-md bg-muted/50 flex items-center justify-center overflow-hidden">
                  <img
                    src={`${import.meta.env.BASE_URL}unicorn-example.png`}
                    alt="Unicorn Route"
                    className="h-20 w-auto object-contain opacity-90 group-hover:scale-105 transition-transform"
                  />
                </div>
              </div>

              {/* Heart Route */}
              <div className="group relative rounded-lg border bg-card/50 backdrop-blur-sm p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-pink-500 to-red-500 flex items-center justify-center text-white font-bold text-sm">
                    M
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">Proposal ❤️</p>
                    <p className="text-xs text-muted-foreground">5.2 km</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    892 ❤️
                  </Badge>
                </div>
                <div className="w-full h-32 rounded-md bg-muted/50 flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-full h-24 text-pink-500 opacity-90 group-hover:scale-105 transition-transform">
                    <path
                      d="M 50 80 C 50 80 20 60 20 40 C 20 25 30 20 40 20 C 45 20 50 25 50 25 C 50 25 55 20 60 20 C 70 20 80 25 80 40 C 80 60 50 80 50 80 Z"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>
                </div>
              </div>

              {/* PR Route */}
              <div className="group relative rounded-lg border bg-card/50 backdrop-blur-sm p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white font-bold text-sm">
                    R
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">PR</p>
                    <p className="text-xs text-muted-foreground">3.5 km</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    New record! 🏆
                  </Badge>
                </div>
                <div className="w-full h-32 rounded-md bg-muted/50 flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-full h-20 text-emerald-600 opacity-90 group-hover:scale-105 transition-transform">
                    <path
                      d="M 20 25 L 20 75 M 20 25 L 40 25 C 50 25 55 30 55 40 C 55 50 50 55 40 55 L 20 55 M 60 25 L 60 75 M 60 25 L 80 25 C 90 25 95 30 95 40 C 95 50 90 55 80 55 L 60 55 M 80 55 L 95 75"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
