import { useState } from 'react'

export function useRouteDrawing() {
  const [isDrawing, setIsDrawing] = useState(false)
  const [drawnPoints, setDrawnPoints] = useState<[number, number][]>([])

  const toggleDrawing = () => {
    if (!isDrawing) {
      setDrawnPoints([])
    }
    setIsDrawing(!isDrawing)
  }

  const updatePath = (points: [number, number][]) => {
    setDrawnPoints(points)
  }

  const cancelDrawing = () => {
    setDrawnPoints([])
    setIsDrawing(false)
  }

  const confirmDrawing = () => {
    setIsDrawing(false)
    return drawnPoints
  }

  return {
    isDrawing,
    drawnPoints,
    toggleDrawing,
    updatePath,
    cancelDrawing,
    confirmDrawing,
  }
}
