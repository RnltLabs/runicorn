import { Loader2 } from "lucide-react"

export function RouteProcessing() {
  return (
    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-[2000] flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm mx-4 text-center space-y-4">
        <div className="relative">
          <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto" />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Making magic happen...</h3>
          <p className="text-sm text-muted-foreground">
            Your followers aren't ready for this 🔥
          </p>
        </div>
      </div>
    </div>
  )
}
