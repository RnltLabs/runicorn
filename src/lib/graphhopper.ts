// Douglas-Peucker algorithm for path simplification
export function simplifyPath(points: [number, number][], tolerance: number): [number, number][] {
  if (points.length <= 2) return points

  const getPerpendicularDistance = (
    point: [number, number],
    lineStart: [number, number],
    lineEnd: [number, number]
  ): number => {
    const [x, y] = point
    const [x1, y1] = lineStart
    const [x2, y2] = lineEnd

    const dx = x2 - x1
    const dy = y2 - y1

    if (dx === 0 && dy === 0) {
      return Math.sqrt(Math.pow(x - x1, 2) + Math.pow(y - y1, 2))
    }

    const numerator = Math.abs(dy * x - dx * y + x2 * y1 - y2 * x1)
    const denominator = Math.sqrt(dx * dx + dy * dy)
    return numerator / denominator
  }

  const douglasPeucker = (pts: [number, number][], epsilon: number): [number, number][] => {
    let maxDistance = 0
    let index = 0

    for (let i = 1; i < pts.length - 1; i++) {
      const distance = getPerpendicularDistance(pts[i], pts[0], pts[pts.length - 1])
      if (distance > maxDistance) {
        maxDistance = distance
        index = i
      }
    }

    if (maxDistance > epsilon) {
      const left = douglasPeucker(pts.slice(0, index + 1), epsilon)
      const right = douglasPeucker(pts.slice(index), epsilon)
      return [...left.slice(0, -1), ...right]
    }

    return [pts[0], pts[pts.length - 1]]
  }

  return douglasPeucker(points, tolerance)
}

interface RouteStats {
  distance: number
  ascend: number
  descend: number
}

export interface RouteResult {
  route: [number, number][]
  stats: RouteStats
}

export async function snapToRoad(points: [number, number][]): Promise<RouteResult> {
  console.log('GraphHopper Routing called with points:', points.length)

  if (points.length < 2) {
    return { route: points, stats: { distance: 0, ascend: 0, descend: 0 } }
  }

  const simplifiedPoints = simplifyPath(points, 0.00005)
  console.log('Simplified from', points.length, 'to', simplifiedPoints.length, 'points')

  try {
    const apiKey = import.meta.env.VITE_GRAPHHOPPER_API_KEY

    if (!apiKey) {
      console.error('GraphHopper API Key not found!')
      return { route: points, stats: { distance: 0, ascend: 0, descend: 0 } }
    }

    const finalRoute: [number, number][] = []
    const batchSize = 5
    let totalDistance = 0
    let totalAscend = 0
    let totalDescend = 0

    for (let i = 0; i < simplifiedPoints.length - 1; i += batchSize - 1) {
      const batchEnd = Math.min(i + batchSize, simplifiedPoints.length)
      const batch = simplifiedPoints.slice(i, batchEnd)

      try {
        const pointsParam = batch.map(p => `point=${p[0]},${p[1]}`).join('&')
        const url = `https://graphhopper.com/api/1/route?${pointsParam}&profile=foot&locale=de&points_encoded=false&key=${apiKey}`

        const response = await fetch(url)
        const data = await response.json()

        if (data.paths && data.paths.length > 0) {
          const path = data.paths[0]
          const routePoints = path.points.coordinates.map((coord: [number, number]) =>
            [coord[1], coord[0]] as [number, number]
          )

          totalDistance += path.distance
          totalAscend += path.ascend || 0
          totalDescend += path.descend || 0

          if (finalRoute.length === 0) {
            finalRoute.push(...routePoints)
          } else {
            finalRoute.push(...routePoints.slice(1))
          }
        }

        if (i + batchSize < simplifiedPoints.length) {
          await new Promise(resolve => setTimeout(resolve, 100))
        }
      } catch (error) {
        console.error('Error routing batch:', error)
      }
    }

    return {
      route: finalRoute,
      stats: { distance: totalDistance, ascend: totalAscend, descend: totalDescend }
    }
  } catch (error) {
    console.error('Error in snapToRoad:', error)
    return { route: points, stats: { distance: 0, ascend: 0, descend: 0 } }
  }
}
