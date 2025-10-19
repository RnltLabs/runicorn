/**
 * Copyright (c) 2025 Roman Reinelt / RNLT Labs
 *
 * This software is proprietary and confidential.
 * Unauthorized use, reproduction, or distribution is prohibited.
 * For licensing information, contact: hello@rnltlabs.de
 */

// Helper function: Calculate distance between two points in meters
function calculateDistance(p1: [number, number], p2: [number, number]): number {
  const R = 6371e3 // Earth radius in meters
  const φ1 = (p1[0] * Math.PI) / 180
  const φ2 = (p2[0] * Math.PI) / 180
  const Δφ = ((p2[0] - p1[0]) * Math.PI) / 180
  const Δλ = ((p2[1] - p1[1]) * Math.PI) / 180

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c
}

// Helper function: Calculate bearing/heading between two points in degrees
function calculateBearing(p1: [number, number], p2: [number, number]): number {
  const φ1 = (p1[0] * Math.PI) / 180
  const φ2 = (p2[0] * Math.PI) / 180
  const Δλ = ((p2[1] - p1[1]) * Math.PI) / 180

  const y = Math.sin(Δλ) * Math.cos(φ2)
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ)
  const θ = Math.atan2(y, x)

  return ((θ * 180) / Math.PI + 360) % 360
}

// Helper function: Calculate perpendicular distance from point to line segment
function perpendicularDistance(
  point: [number, number],
  lineStart: [number, number],
  lineEnd: [number, number]
): number {
  const [lat, lon] = point
  const [lat1, lon1] = lineStart
  const [lat2, lon2] = lineEnd

  const A = lat - lat1
  const B = lon - lon1
  const C = lat2 - lat1
  const D = lon2 - lon1

  const dot = A * C + B * D
  const lenSq = C * C + D * D
  let param = -1

  if (lenSq !== 0) param = dot / lenSq

  let xx, yy

  if (param < 0) {
    xx = lat1
    yy = lon1
  } else if (param > 1) {
    xx = lat2
    yy = lon2
  } else {
    xx = lat1 + param * C
    yy = lon1 + param * D
  }

  const dx = lat - xx
  const dy = lon - yy

  return Math.sqrt(dx * dx + dy * dy) * 111000 // rough conversion to meters
}

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

export async function snapToRoad(
  points: [number, number][],
  onProgress?: (current: number, total: number) => void
): Promise<RouteResult> {
  console.group('🗺️ ROUTING ANALYSIS')
  console.log('📍 Input Points:', {
    total: points.length,
    first: points[0],
    last: points[points.length - 1]
  })

  if (points.length < 2) {
    console.groupEnd()
    return { route: points, stats: { distance: 0, ascend: 0, descend: 0 } }
  }

  const simplifiedPoints = simplifyPath(points, 0.00005)
  console.log('✂️ Simplification:', {
    before: points.length,
    after: simplifiedPoints.length,
    removed: points.length - simplifiedPoints.length,
    reduction: `${((1 - simplifiedPoints.length / points.length) * 100).toFixed(1)}%`,
    tolerance: 0.00005
  })

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

    // Calculate total batches for progress
    const totalBatches = Math.ceil((simplifiedPoints.length - 1) / (batchSize - 1))
    let currentBatch = 0

    for (let i = 0; i < simplifiedPoints.length - 1; i += batchSize - 1) {
      const batchEnd = Math.min(i + batchSize, simplifiedPoints.length)
      const batch = simplifiedPoints.slice(i, batchEnd)

      console.log(`📦 Batch ${currentBatch + 1}/${totalBatches}:`, {
        points: batch.length,
        coordinates: batch.map(p => ({ lat: p[0].toFixed(6), lon: p[1].toFixed(6) }))
      })

      let retryCount = 0
      const maxRetries = 3
      let success = false

      while (!success && retryCount < maxRetries) {
        try {
          const pointsParam = batch.map(p => `point=${p[0]},${p[1]}`).join('&')
          const url = `https://graphhopper.com/api/1/route?${pointsParam}&profile=foot&locale=de&points_encoded=false&key=${apiKey}`

          const response = await fetch(url)

          if (!response.ok) {
            if (response.status === 429) {
              // Check for Retry-After header
              const retryAfter = response.headers.get('Retry-After')
              const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : 2000 * Math.pow(2, retryCount)

              console.log(`Rate limit hit. Waiting ${waitTime}ms before retry ${retryCount + 1}/${maxRetries}`)
              await new Promise(resolve => setTimeout(resolve, waitTime))
              retryCount++
              continue
            }
            throw new Error(`GraphHopper API error: ${response.status}`)
          }

          const data = await response.json()

          if (data.paths && data.paths.length > 0) {
            const path = data.paths[0]
            const routePoints = path.points.coordinates.map((coord: [number, number]) =>
              [coord[1], coord[0]] as [number, number]
            )

            console.log(`✅ Batch ${currentBatch + 1} Response:`, {
              distance: `${(path.distance / 1000).toFixed(2)}km`,
              routePoints: routePoints.length,
              ascend: `${(path.ascend || 0).toFixed(0)}m`,
              descend: `${(path.descend || 0).toFixed(0)}m`
            })

            totalDistance += path.distance
            totalAscend += path.ascend || 0
            totalDescend += path.descend || 0

            if (finalRoute.length === 0) {
              finalRoute.push(...routePoints)
            } else {
              finalRoute.push(...routePoints.slice(1))
            }
          }

          success = true
          currentBatch++

          // Report progress
          if (onProgress) {
            onProgress(currentBatch, totalBatches)
          }

          // Longer delay between batches to avoid rate limiting
          if (i + batchSize < simplifiedPoints.length) {
            await new Promise(resolve => setTimeout(resolve, 1500))
          }
        } catch (error) {
          if (retryCount >= maxRetries) {
            console.error('Error routing batch after retries:', error)
            break
          }
        }
      }
    }

    // Deviation Analysis: Compare input points vs routed output
    console.log('📊 Deviation Analysis:')

    const deviations: number[] = []
    simplifiedPoints.forEach((inputPoint, idx) => {
      // Find closest point in final route
      let minDist = Infinity
      finalRoute.forEach(routePoint => {
        const dist = calculateDistance(inputPoint, routePoint)
        if (dist < minDist) minDist = dist
      })
      deviations.push(minDist)
    })

    const avgDeviation = deviations.reduce((a, b) => a + b, 0) / deviations.length
    const maxDeviation = Math.max(...deviations)
    const outliers = deviations.filter(d => d > 50).length // Points >50m off

    console.log({
      avgDeviation: `${avgDeviation.toFixed(1)}m`,
      maxDeviation: `${maxDeviation.toFixed(1)}m`,
      outliers: outliers,
      totalPoints: simplifiedPoints.length
    })

    // Direction Changes Analysis
    const directionChanges: number[] = []
    for (let i = 1; i < finalRoute.length - 1; i++) {
      const bearing1 = calculateBearing(finalRoute[i - 1], finalRoute[i])
      const bearing2 = calculateBearing(finalRoute[i], finalRoute[i + 1])
      let change = Math.abs(bearing2 - bearing1)
      if (change > 180) change = 360 - change
      if (change > 90) {
        directionChanges.push(change)
      }
    }

    console.log('🔄 Sharp Direction Changes (>90°):', {
      count: directionChanges.length,
      sharpest: directionChanges.length > 0 ? `${Math.max(...directionChanges).toFixed(0)}°` : 'none'
    })

    console.groupEnd()

    return {
      route: finalRoute,
      stats: { distance: totalDistance, ascend: totalAscend, descend: totalDescend }
    }
  } catch (error) {
    console.error('Error in snapToRoad:', error)
    console.groupEnd()
    return { route: points, stats: { distance: 0, ascend: 0, descend: 0 } }
  }
}
