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
                    className="h-full w-auto object-contain opacity-90 group-hover:scale-105 transition-transform"
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
                  <svg viewBox="0 0 100 100" className="h-24 w-24 text-pink-500 opacity-90 group-hover:scale-105 transition-transform">
                    <path d="M50,90 C50,90 10,60 10,40 C10,25 20,20 30,20 C40,20 50,30 50,30 C50,30 60,20 70,20 C80,20 90,25 90,40 C90,60 50,90 50,90 Z" fill="currentColor" />
                  </svg>
                </div>
              </div>

              {/* Cat Route */}
              <div className="group relative rounded-lg border bg-card/50 backdrop-blur-sm p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">
                    J
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">Cat Walk</p>
                    <p className="text-xs text-muted-foreground">3.4 km</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    156 ❤️
                  </Badge>
                </div>
                <div className="w-full h-32 rounded-md bg-muted/50 flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="h-20 w-20 text-purple-500 opacity-90 group-hover:scale-105 transition-transform">
                    <ellipse cx="35" cy="45" rx="8" ry="12" fill="currentColor"/>
                    <ellipse cx="65" cy="45" rx="8" ry="12" fill="currentColor"/>
                    <circle cx="50" cy="55" r="22" fill="currentColor"/>
                    <path d="M20,25 L28,35 L25,40 Z M80,25 L72,35 L75,40 Z" fill="currentColor"/>
                    <ellipse cx="45" cy="57" rx="2" ry="3" fill="white"/>
                    <ellipse cx="55" cy="57" rx="2" ry="3" fill="white"/>
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
