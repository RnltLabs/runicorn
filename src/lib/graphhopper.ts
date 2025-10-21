/**
 * Copyright (c) 2025 Roman Reinelt / RNLT Labs
 *
 * This software is proprietary and confidential.
 * Unauthorized use, reproduction, or distribution is prohibited.
 * For licensing information, contact: hello@rnltlabs.de
 */

import { logger } from '@/utils/logger';

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
  logger.info('graphhopper_routing_started', {
    pointCount: points.length,
  });

  if (points.length < 2) {
    logger.warn('graphhopper_insufficient_points', {
      pointCount: points.length,
      minRequired: 2,
    });
    return { route: points, stats: { distance: 0, ascend: 0, descend: 0 } }
  }

  const simplifiedPoints = simplifyPath(points, 0.00005)
  logger.debug('graphhopper_path_simplified', {
    originalPoints: points.length,
    simplifiedPoints: simplifiedPoints.length,
    reduction: Math.round((1 - simplifiedPoints.length / points.length) * 100) + '%',
  });

  try {
    const apiKey = import.meta.env.VITE_GRAPHHOPPER_API_KEY

    if (!apiKey) {
      logger.error('graphhopper_api_key_missing', undefined, {
        environment: import.meta.env.MODE,
      });
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

              logger.warn('graphhopper_rate_limit_hit', {
                retryCount: retryCount + 1,
                maxRetries,
                waitTimeMs: waitTime,
                retryAfterHeader: retryAfter,
                batchIndex: i,
                batchSize: batch.length,
                totalPoints: simplifiedPoints.length,
              });

              await new Promise(resolve => setTimeout(resolve, waitTime))
              retryCount++
              continue
            }

            const error = new Error(`GraphHopper API error: ${response.status}`);
            logger.error('graphhopper_api_error', error, {
              statusCode: response.status,
              statusText: response.statusText,
              batchIndex: i,
              batchSize: batch.length,
              retryCount,
            });

            throw error;
          }

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
          if (retryCount >= maxRetries - 1) {
            logger.error('graphhopper_batch_failed_after_retries', error as Error, {
              batchIndex: i,
              batchSize: batch.length,
              retryCount,
              maxRetries,
            });
            break
          }
          retryCount++;
        }
      }
    }

    logger.info('graphhopper_routing_completed', {
      totalPoints: simplifiedPoints.length,
      totalBatches,
      totalDistance: Math.round(totalDistance),
      totalAscend: Math.round(totalAscend),
      totalDescend: Math.round(totalDescend),
      routePointsCount: finalRoute.length,
    });

    return {
      route: finalRoute,
      stats: { distance: totalDistance, ascend: totalAscend, descend: totalDescend }
    }
  } catch (error) {
    logger.error('graphhopper_routing_failed', error as Error, {
      pointCount: points.length,
      simplifiedPointCount: simplifiedPoints.length,
    });
    return { route: points, stats: { distance: 0, ascend: 0, descend: 0 } }
  }
}
