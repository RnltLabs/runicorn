/**
 * Copyright (c) 2025 Roman Reinelt / RNLT Labs
 *
 * This software is proprietary and confidential.
 * Unauthorized use, reproduction, or distribution is prohibited.
 * For licensing information, contact: hello@rnltlabs.de
 */

import { useState } from 'react'
import { logger } from '@/utils/logger'

type DrawMode = 'draw' | 'erase' | 'pan'

interface UseRouteDrawingReturn {
  isDrawing: boolean
  drawnSegments: [number, number][][]
  drawMode: DrawMode
  toggleDrawing: () => void
  setMode: (mode: DrawMode) => void
  updatePath: (point: [number, number]) => void
  erasePath: (point: [number, number], radius: number) => void
  cancelDrawing: () => void
  confirmDrawing: () => [number, number][]
}

export function useRouteDrawing(): UseRouteDrawingReturn {
  const [isDrawing, setIsDrawing] = useState(false)
  const [drawnSegments, setDrawnSegments] = useState<[number, number][][]>([[]])
  const [drawMode, setDrawMode] = useState<DrawMode>('draw')

  const toggleDrawing = (): void => {
    if (!isDrawing) {
      setDrawnSegments([[]])
      setDrawMode('draw')
    }
    setIsDrawing(!isDrawing)
  }

  const setMode = (mode: DrawMode): void => {
    logger.debug('draw_mode_changed', {
      oldMode: drawMode,
      newMode: mode,
    })
    const previousMode = drawMode
    setDrawMode(mode)

    // When switching from eraser back to draw, start a new segment
    if (previousMode === 'erase' && mode === 'draw') {
      setDrawnSegments(prev => [...prev, []])
    }
  }

  const updatePath = (point: [number, number]): void => {
    setDrawnSegments(prev => {
      const newSegments = [...prev]
      const lastSegment = [...newSegments[newSegments.length - 1]]
      lastSegment.push(point)
      newSegments[newSegments.length - 1] = lastSegment
      logger.debug('path_point_added', {
        segmentLength: lastSegment.length,
      })
      return newSegments
    })
  }

  const erasePath = (point: [number, number], radius: number): void => {
    logger.debug('path_erase_started', {
      point,
      radius,
    })

    const newSegments: [number, number][][] = []

    drawnSegments.forEach(segment => {
      const currentSegment: [number, number][] = []

      segment.forEach(([lat, lng]) => {
        const dLat = lat - point[0]
        const dLng = lng - point[1]
        const distance = Math.sqrt(dLat * dLat + dLng * dLng)

        if (distance > radius) {
          // Point is outside eraser radius, keep it
          currentSegment.push([lat, lng])
        } else {
          // Point is inside eraser radius, remove it
          // This creates a break in the line
          if (currentSegment.length > 0) {
            newSegments.push(currentSegment.slice())
            currentSegment.length = 0
          }
        }
      })

      // Add remaining points as a segment
      if (currentSegment.length > 0) {
        newSegments.push(currentSegment)
      }
    })

    // If all points were erased, keep at least one empty segment
    if (newSegments.length === 0) {
      newSegments.push([])
    }

    logger.debug('path_erase_completed', {
      segmentsBefore: drawnSegments.length,
      segmentsAfter: newSegments.length,
    })
    setDrawnSegments(newSegments)
  }

  const cancelDrawing = (): void => {
    setDrawnSegments([[]])
    setIsDrawing(false)
    setDrawMode('draw')
  }

  const confirmDrawing = (): [number, number][] => {
    setIsDrawing(false)
    setDrawMode('draw')
    // Flatten all segments into one array for processing
    return drawnSegments.flat()
  }

  return {
    isDrawing,
    drawnSegments,
    drawMode,
    toggleDrawing,
    setMode,
    updatePath,
    erasePath,
    cancelDrawing,
    confirmDrawing,
  }
}
