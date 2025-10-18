import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface RouteProcessingProps {
  progress?: number
  onCancel?: () => void
}

export function RouteProcessing({ progress = 0, onCancel }: RouteProcessingProps) {
  return (
    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-[2000] flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 text-center space-y-6 relative">
        {/* Cancel button */}
        {onCancel && (
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        <div>
          <h3 className="text-lg font-semibold mb-2">Making magic happen...</h3>
          <p className="text-sm text-muted-foreground">
            Your followers aren't ready for this 🔥
          </p>
        </div>

        {/* Progress Track */}
        <div className="relative h-16 bg-gray-100 rounded-full overflow-hidden">
          {/* Track lines */}
          <div className="absolute inset-0 flex items-center px-4">
            <div className="flex-1 border-t-2 border-dashed border-gray-300"></div>
          </div>

          {/* Runner */}
          <div
            className="absolute top-1/2 -translate-y-1/2 transition-all duration-500 ease-out"
            style={{ left: `${Math.min(progress, 100)}%` }}
          >
            <div className="text-4xl -ml-6 animate-bounce" style={{ animationDuration: '0.8s', transform: 'scaleX(-1)' }}>
              🏃
            </div>
          </div>

          {/* Finish flag */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-3xl">
            🏁
          </div>
        </div>

        {/* Progress text */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            {Math.round(progress)}% complete
          </p>
          <p className="text-xs text-muted-foreground italic">
            Takes a while, but it's free 🤷‍♂️
          </p>
        </div>
      </div>
    </div>
  )
}
