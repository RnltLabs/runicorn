import { useState } from 'react'

type DrawMode = 'draw' | 'erase' | 'pan'

export function useRouteDrawing() {
  const [isDrawing, setIsDrawing] = useState(false)
  const [drawnSegments, setDrawnSegments] = useState<[number, number][][]>([[]])
  const [drawMode, setDrawMode] = useState<DrawMode>('draw')

  const toggleDrawing = () => {
    if (!isDrawing) {
      setDrawnSegments([[]])
      setDrawMode('draw')
    }
    setIsDrawing(!isDrawing)
  }

  const setMode = (mode: DrawMode) => {
    console.log('setMode:', { oldMode: drawMode, newMode: mode })
    const previousMode = drawMode
    setDrawMode(mode)

    // When switching from eraser back to draw, start a new segment
    if (previousMode === 'erase' && mode === 'draw') {
      setDrawnSegments(prev => [...prev, []])
    }
  }

  const updatePath = (point: [number, number]) => {
    setDrawnSegments(prev => {
      const newSegments = [...prev]
      const lastSegment = [...newSegments[newSegments.length - 1]]
      lastSegment.push(point)
      newSegments[newSegments.length - 1] = lastSegment
      console.log(`updatePath: added point, segment now has ${lastSegment.length} points`)
      return newSegments
    })
  }

  const erasePath = (point: [number, number], radius: number) => {
    console.log(`erasePath: point=[${point[0]}, ${point[1]}], radius=${radius}`)

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

    console.log(`Segments: ${drawnSegments.length} -> ${newSegments.length}`)
    setDrawnSegments(newSegments)
  }

  const cancelDrawing = () => {
    setDrawnSegments([[]])
    setIsDrawing(false)
    setDrawMode('draw')
  }

  const confirmDrawing = () => {
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
