import { Pencil, Check, X, RotateCcw, Eraser, Hand } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type DrawMode = 'draw' | 'erase' | 'pan'

interface DrawControlsProps {
  isDrawing: boolean
  drawMode: DrawMode
  hasRoute: boolean
  onToggleDraw: () => void
  onSetMode: (mode: DrawMode) => void
  onConfirm: () => void
  onCancel: () => void
  onReset: () => void
}

export function DrawControls({
  isDrawing,
  drawMode,
  hasRoute,
  onToggleDraw,
  onSetMode,
  onConfirm,
  onCancel,
  onReset,
}: DrawControlsProps) {
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] flex items-center gap-2 bg-white/95 backdrop-blur-lg rounded-full px-3 py-2 shadow-lg border no-select">
      {!isDrawing && !hasRoute && (
        <Button
          onClick={onToggleDraw}
          size="sm"
          className="gap-2 rounded-full"
          style={{ backgroundColor: '#fa7315' }}
        >
          <Pencil className="h-4 w-4" />
          Let's Draw
        </Button>
      )}

      {isDrawing && (
        <>
          <span className="text-sm font-medium text-muted-foreground px-2">Tools</span>

          <Button
            onClick={() => onSetMode('draw')}
            size="sm"
            variant={drawMode === 'draw' ? "default" : "outline"}
            className={cn(
              "gap-1.5 rounded-full",
              drawMode === 'draw' && "bg-blue-500 hover:bg-blue-600"
            )}
          >
            <Pencil className="h-4 w-4" />
          </Button>

          <Button
            onClick={() => onSetMode('erase')}
            size="sm"
            variant={drawMode === 'erase' ? "default" : "outline"}
            className={cn(
              "gap-1.5 rounded-full",
              drawMode === 'erase' && "bg-red-500 hover:bg-red-600"
            )}
          >
            <Eraser className="h-4 w-4" />
          </Button>

          <Button
            onClick={() => onSetMode('pan')}
            size="sm"
            variant={drawMode === 'pan' ? "default" : "outline"}
            className={cn(
              "gap-1.5 rounded-full",
              drawMode === 'pan' && "bg-green-500 hover:bg-green-600"
            )}
          >
            <Hand className="h-4 w-4" />
          </Button>

          <div className="w-px h-6 bg-gray-300" />

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
        </>
      )}

      {hasRoute && !isDrawing && (
        <Button
          onClick={onReset}
          size="sm"
          variant="secondary"
          className="gap-2 rounded-full"
        >
          <RotateCcw className="h-4 w-4" />
          New Route
        </Button>
      )}
    </div>
  )
}
