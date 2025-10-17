import { Pencil, Check, X, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface DrawControlsProps {
  isDrawing: boolean
  hasRoute: boolean
  onToggleDraw: () => void
  onConfirm: () => void
  onCancel: () => void
  onReset: () => void
}

export function DrawControls({
  isDrawing,
  hasRoute,
  onToggleDraw,
  onConfirm,
  onCancel,
  onReset,
}: DrawControlsProps) {
  if (isDrawing) {
    return (
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] flex items-center gap-2 bg-white/95 backdrop-blur-lg rounded-full px-3 py-2 shadow-lg border no-select">
        <span className="text-sm font-medium text-muted-foreground px-2">Draw your route</span>
        <Button
          onClick={onConfirm}
          size="sm"
          className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 rounded-full"
        >
          <Check className="h-4 w-4" />
          Finish
        </Button>
        <Button
          onClick={onCancel}
          size="sm"
          variant="outline"
          className="gap-1.5 rounded-full"
        >
          <X className="h-4 w-4" />
          Cancel
        </Button>
      </div>
    )
  }

  if (hasRoute) {
    return (
      <div className="absolute top-4 left-4 z-[1000]">
        <Button
          onClick={onReset}
          size="default"
          variant="secondary"
          className="gap-2 shadow-lg backdrop-blur-sm"
        >
          <RotateCcw className="h-4 w-4" />
          New Route
        </Button>
      </div>
    )
  }

  return (
    <div className="absolute top-4 left-4 z-[1000]">
      <Button
        onClick={onToggleDraw}
        size="default"
        className="gap-2 shadow-lg"
      >
        <Pencil className="h-4 w-4" />
        Start Drawing
      </Button>
    </div>
  )
}
