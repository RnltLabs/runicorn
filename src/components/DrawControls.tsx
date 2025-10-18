/**
 * Copyright (c) 2025 Roman Reinelt / RNLT Labs
 *
 * This software is proprietary and confidential.
 * Unauthorized use, reproduction, or distribution is prohibited.
 * For licensing information, contact: hello@rnltlabs.de
 */

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
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] flex items-center gap-2 bg-card/95 backdrop-blur-lg rounded-full px-3 py-2 shadow-lg border no-select">
      {!isDrawing && !hasRoute && (
        <Button
          onClick={onToggleDraw}
          className="gap-2 h-11 px-4 rounded-full"
          style={{ backgroundColor: '#fa7315' }}
        >
          <Pencil className="h-4 w-4" />
          Let's Draw
        </Button>
      )}

      {isDrawing && (
        <>
          <span className="text-sm font-medium text-muted-foreground px-2 hidden sm:inline">Tools</span>

          <Button
            onClick={() => onSetMode('draw')}
            variant={drawMode === 'draw' ? "default" : "outline"}
            className={cn(
              "gap-1.5 h-11 w-11 p-0 rounded-full",
              drawMode === 'draw' && "bg-blue-500 hover:bg-blue-600"
            )}
          >
            <Pencil className="h-5 w-5" />
          </Button>

          <Button
            onClick={() => onSetMode('erase')}
            variant={drawMode === 'erase' ? "default" : "outline"}
            className={cn(
              "gap-1.5 h-11 w-11 p-0 rounded-full",
              drawMode === 'erase' && "bg-red-500 hover:bg-red-600"
            )}
          >
            <Eraser className="h-5 w-5" />
          </Button>

          <Button
            onClick={() => onSetMode('pan')}
            variant={drawMode === 'pan' ? "default" : "outline"}
            className={cn(
              "gap-1.5 h-11 w-11 p-0 rounded-full",
              drawMode === 'pan' && "bg-green-500 hover:bg-green-600"
            )}
          >
            <Hand className="h-5 w-5" />
          </Button>

          <div className="w-px h-6 bg-border hidden sm:block" />

          <Button
            onClick={onConfirm}
            className="gap-1.5 h-11 px-4 bg-emerald-600 hover:bg-emerald-700 rounded-full"
          >
            <Check className="h-4 w-4" />
            <span className="hidden sm:inline">Finish</span>
          </Button>
          <Button
            onClick={onCancel}
            variant="outline"
            className="gap-1.5 h-11 px-4 sm:px-3 rounded-full"
          >
            <X className="h-4 w-4" />
            <span className="hidden sm:inline">Cancel</span>
          </Button>
        </>
      )}

      {hasRoute && !isDrawing && (
        <Button
          onClick={onReset}
          variant="secondary"
          className="gap-2 h-11 px-4 rounded-full"
        >
          <RotateCcw className="h-4 w-4" />
          New Route
        </Button>
      )}
    </div>
  )
}
