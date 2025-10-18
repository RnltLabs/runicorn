import { Button } from "@/components/ui/button"
import { ArrowRight, Heart, TrendingUp, Route } from "lucide-react"

interface HeroProps {
  onGetStarted: () => void
}

export function Hero({ onGetStarted }: HeroProps) {
  return (
    <div className="relative h-full flex overflow-hidden">
      {/* Colorful blob backgrounds */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-gradient-to-br from-primary/20 to-orange-300/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-gradient-to-br from-indigo-300/20 to-purple-300/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-gradient-to-br from-pink-300/20 to-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex items-center flex-1">
        <div className="max-w-6xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left side - Text content */}
            <div className="space-y-6 sm:space-y-8 text-center lg:text-left">
              {/* Headline */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
                Turn your run into
                <span className="block mt-3">
                  GPS art
                </span>
              </h1>

              {/* Subheadline */}
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-lg mx-auto lg:mx-0">
                Draw unicorns. Propose with GPS. Get more kudos than your 5K PR 🔥
              </p>

              {/* CTA */}
              <div>
                <Button
                  size="lg"
                  onClick={onGetStarted}
                  className="gap-2 text-base sm:text-lg px-8 sm:px-10 h-14 sm:h-16 rounded-2xl shadow-xl transition-all bg-orange-500 hover:bg-orange-600 hover:scale-[1.02] hover:shadow-2xl"
                >
                  Start Drawing
                  <ArrowRight className="h-5 w-5" />
                </Button>
                <p className="text-sm text-muted-foreground mt-4">
                  Free • No signup • GPX export
                </p>
              </div>
            </div>

            {/* Right side - Social media style examples */}
            <div className="hidden lg:grid grid-cols-2 gap-3">
              {/* Unicorn Run */}
              <div className="bg-white rounded-xl border shadow-sm p-3 space-y-2">
                <div className="w-full h-20 flex items-center justify-center">
                  <img
                    src="/unicorn-example.png"
                    alt="Unicorn Route"
                    className="h-full w-auto object-contain"
                  />
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-sm">The Unicorn</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Route className="h-3 w-3" />
                    <span>2.8 km</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <Heart className="h-3 w-3 fill-red-500 text-red-500" />
                    <span className="font-medium">247 kudos</span>
                  </div>
                </div>
              </div>

              {/* Proposal Run */}
              <div className="bg-white rounded-xl border shadow-sm p-3 space-y-2">
                <svg viewBox="0 0 100 100" className="w-full h-20 text-pink-500">
                  <path
                    d="M 50 80 C 50 80 20 60 20 40 C 20 25 30 20 40 20 C 45 20 50 25 50 25 C 50 25 55 20 60 20 C 70 20 80 25 80 40 C 80 60 50 80 50 80 Z"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
                <div className="space-y-1">
                  <p className="font-semibold text-sm">Proposal Run</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Route className="h-3 w-3" />
                    <span>4.2 km</span>
                  </div>
                  <p className="text-xs font-medium text-pink-600">She said yes! 💍</p>
                </div>
              </div>

              {/* Middle Finger */}
              <div className="bg-white rounded-xl border shadow-sm p-3 space-y-2">
                <svg viewBox="0 0 100 100" className="w-full h-20 text-indigo-500">
                  <path
                    d="M 35 75 L 35 55 L 42 55 L 42 35 L 50 35 L 50 25 L 58 25 L 58 35 L 65 35 L 65 55 L 72 55 L 72 75 L 65 75 L 58 75 L 50 75 L 42 75 L 35 75 M 32 75 C 32 75 32 80 35 82 C 40 84 60 84 65 82 C 68 80 68 75 68 75"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
                <div className="space-y-1">
                  <p className="font-semibold text-sm">Traffic Jam</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Route className="h-3 w-3" />
                    <span>0.8 km</span>
                  </div>
                  <p className="text-xs font-medium">Dedicated to drivers 🖕</p>
                </div>
              </div>

              {/* PR */}
              <div className="bg-white rounded-xl border shadow-sm p-3 space-y-2">
                <svg viewBox="0 0 120 100" className="w-full h-20 text-emerald-600">
                  <path
                    d="M 20 25 L 20 75 M 20 25 L 40 25 C 50 25 55 30 55 40 C 55 50 50 55 40 55 L 20 55 M 40 55 L 55 75 M 70 25 L 70 75 M 70 25 L 90 25 C 100 25 105 30 105 40 C 105 50 100 55 90 55 L 70 55"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
                <div className="space-y-1">
                  <p className="font-semibold text-sm">PR</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Route className="h-3 w-3" />
                    <span>3.5 km</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <TrendingUp className="h-3 w-3 text-emerald-600" />
                    <span className="font-medium">New record! 🏆</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
