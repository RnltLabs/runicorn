import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, useMap, Polyline, useMapEvents } from 'react-leaflet'
import { OpenStreetMapProvider } from 'leaflet-geosearch'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './App.css'

const provider = new OpenStreetMapProvider()
const STRAVA_ORANGE = '#FC4C02'

interface DrawControlProps {
  isDrawing: boolean
  onToggleDraw: () => void
  onConfirm: () => void
  onCancel: () => void
}

function DrawControl({ isDrawing, onToggleDraw, onConfirm, onCancel }: DrawControlProps) {
  return (
    <div className="draw-controls">
      <button
        className={`draw-button ${isDrawing ? 'active' : ''}`}
        onClick={onToggleDraw}
        title="Zeichenmodus"
      >
        ✏️
      </button>
      {isDrawing && (
        <>
          <button className="confirm-button" onClick={onConfirm} title="Bestätigen">
            ✓
          </button>
          <button className="cancel-button" onClick={onCancel} title="Abbrechen">
            ✕
          </button>
        </>
      )}
    </div>
  )
}

function SearchControl({ onSearch }: { onSearch: (query: string) => void }) {
  const [query, setQuery] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query)
    }
  }

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Suche nach Orten (z.B. Karlsruhe)..."
          className="search-input"
        />
        <button type="submit" className="search-button">Suchen</button>
      </form>
    </div>
  )
}

function MapUpdater({ center, zoom, shouldUpdate }: { center: [number, number], zoom: number, shouldUpdate: boolean }) {
  const map = useMap()

  useEffect(() => {
    if (shouldUpdate) {
      map.setView(center, zoom)
    }
  }, [center, zoom, shouldUpdate, map])

  return null
}

interface DrawingHandlerProps {
  isDrawing: boolean
  currentPath: [number, number][]
  onPathUpdate: (points: [number, number][]) => void
}

function DrawingHandler({ isDrawing, currentPath, onPathUpdate }: DrawingHandlerProps) {
  const [isMouseDown, setIsMouseDown] = useState(false)

  const map = useMapEvents({
    mousedown: (e) => {
      if (isDrawing) {
        // Prüfe ob der Klick von einem UI-Element (Button) kommt
        const originalEvent = (e as any).originalEvent
        if (originalEvent && originalEvent.target &&
            (originalEvent.target.closest('.draw-controls') ||
             originalEvent.target.closest('button'))) {
          return // Ignoriere Klicks auf Buttons
        }
        setIsMouseDown(true)
        const { lat, lng } = e.latlng
        onPathUpdate([...currentPath, [lat, lng]])
      }
    },
    mousemove: (e) => {
      if (isDrawing && isMouseDown) {
        const { lat, lng } = e.latlng
        onPathUpdate([...currentPath, [lat, lng]])
      }
    },
    mouseup: () => {
      if (isDrawing) {
        setIsMouseDown(false)
      }
    },
  })

  useEffect(() => {
    if (isDrawing) {
      map.dragging.disable()
      map.getContainer().style.cursor = 'crosshair'
    } else {
      map.dragging.enable()
      map.getContainer().style.cursor = ''
    }
  }, [isDrawing, map])

  return currentPath.length > 1 ? (
    <Polyline positions={currentPath} color={STRAVA_ORANGE} weight={3} opacity={0.7} />
  ) : null
}

function App() {
  const [position, setPosition] = useState<[number, number]>([49.0069, 8.4037])
  const [zoom, setZoom] = useState(13)
  const [isDrawing, setIsDrawing] = useState(false)
  const [drawnPoints, setDrawnPoints] = useState<[number, number][]>([])
  const [snappedRoute, setSnappedRoute] = useState<[number, number][]>([])
  const [shouldUpdateMap, setShouldUpdateMap] = useState(false)
  const [routeStats, setRouteStats] = useState<{ distance: number, ascend: number, descend: number } | null>(null)

  const handleSearch = async (query: string) => {
    try {
      const results = await provider.search({ query })
      if (results && results.length > 0) {
        const { y, x } = results[0]
        setPosition([y, x])
        setZoom(13)
        setShouldUpdateMap(true)
      } else {
        alert('Ort nicht gefunden')
      }
    } catch (error) {
      console.error('Fehler bei der Suche:', error)
      alert('Fehler bei der Suche')
    }
  }

  // Douglas-Peucker Algorithmus zur intelligenten Punkt-Reduktion
  const simplifyPath = (points: [number, number][], tolerance: number): [number, number][] => {
    if (points.length <= 2) return points

    const getPerpendicularDistance = (point: [number, number], lineStart: [number, number], lineEnd: [number, number]): number => {
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

  const snapToRoad = async (points: [number, number][]) => {
    console.log('GraphHopper Routing called with points:', points.length)
    if (points.length < 2) {
      console.log('Not enough points, returning original')
      return points
    }

    // Vereinfache den Pfad intelligent - nur wichtige Punkte (Abbiegungen) behalten
    // Tolerance: 0.00005 ≈ 5 Meter
    const simplifiedPoints = simplifyPath(points, 0.00005)
    console.log('Simplified from', points.length, 'to', simplifiedPoints.length, 'points (saved', ((1 - simplifiedPoints.length / points.length) * 100).toFixed(1), '%)')

    try {
      const apiKey = import.meta.env.VITE_GRAPHHOPPER_API_KEY

      if (!apiKey) {
        console.error('GraphHopper API Key not found!')
        return points
      }

      const finalRoute: [number, number][] = []
      const batchSize = 5 // GraphHopper Free Plan: max 5 locations per request
      let totalDistance = 0
      let totalAscend = 0
      let totalDescend = 0

      // Verarbeite in Batches von 5 Punkten
      for (let i = 0; i < simplifiedPoints.length - 1; i += batchSize - 1) {
        const batchEnd = Math.min(i + batchSize, simplifiedPoints.length)
        const batch = simplifiedPoints.slice(i, batchEnd)

        console.log(`Processing batch ${Math.floor(i / (batchSize - 1)) + 1}: points ${i} to ${batchEnd - 1}`)

        try {
          // Erstelle point Parameter: point=lat,lng&point=lat,lng...
          const pointsParam = batch.map(p => `point=${p[0]},${p[1]}`).join('&')
          const url = `https://graphhopper.com/api/1/route?${pointsParam}&profile=foot&locale=de&points_encoded=false&key=${apiKey}`

          const response = await fetch(url)
          const data = await response.json()

          if (data.paths && data.paths.length > 0) {
            const path = data.paths[0]
            const routePoints = path.points.coordinates.map((coord: [number, number]) =>
              [coord[1], coord[0]] as [number, number] // GraphHopper gibt [lng, lat], wir brauchen [lat, lng]
            )

            totalDistance += path.distance
            totalAscend += path.ascend || 0
            totalDescend += path.descend || 0

            // Füge die Route hinzu (ohne Duplikate am Anfang)
            if (finalRoute.length === 0) {
              finalRoute.push(...routePoints)
            } else {
              finalRoute.push(...routePoints.slice(1))
            }
          } else {
            console.warn('Batch routing failed:', data.message)
            // Bei Fehler: verwende die direkten Punkte
            if (finalRoute.length === 0) {
              finalRoute.push(...batch)
            } else {
              finalRoute.push(...batch.slice(1))
            }
          }

          // Kleine Pause zwischen Requests um Rate Limits zu vermeiden
          if (i + batchSize < simplifiedPoints.length) {
            await new Promise(resolve => setTimeout(resolve, 100))
          }

        } catch (error) {
          console.error('Error routing batch:', error)
          if (finalRoute.length === 0) {
            finalRoute.push(...batch)
          } else {
            finalRoute.push(...batch.slice(1))
          }
        }
      }

      console.log('Final route:', finalRoute.length, 'points')
      console.log('Total Distance:', (totalDistance / 1000).toFixed(2), 'km')
      console.log('Total Ascend:', totalAscend.toFixed(0), 'm')
      console.log('Total Descend:', totalDescend.toFixed(0), 'm')

      return { route: finalRoute, stats: { distance: totalDistance, ascend: totalAscend, descend: totalDescend } }

    } catch (error) {
      console.error('Fehler beim GraphHopper Routing:', error)
      return { route: points, stats: { distance: 0, ascend: 0, descend: 0 } }
    }
  }

  const handleConfirm = async () => {
    console.log('handleConfirm called, drawnPoints:', drawnPoints.length)

    // Analysiere die Punkte - zeige erste 10 und letzte 10
    if (drawnPoints.length > 0) {
      console.log('=== GEZEICHNETE PUNKTE ===')
      console.log('First 10 drawn points:', drawnPoints.slice(0, 10))
      console.log('Last 10 drawn points:', drawnPoints.slice(-10))
      console.log('Drawn bounding box:', {
        minLat: Math.min(...drawnPoints.map(p => p[0])),
        maxLat: Math.max(...drawnPoints.map(p => p[0])),
        minLng: Math.min(...drawnPoints.map(p => p[1])),
        maxLng: Math.max(...drawnPoints.map(p => p[1]))
      })

      const result = await snapToRoad(drawnPoints)

      console.log('=== GEMAPPTE ROUTE ===')
      console.log('First 10 snapped points:', result.route.slice(0, 10))
      console.log('Last 10 snapped points:', result.route.slice(-10))
      console.log('Snapped bounding box:', {
        minLat: Math.min(...result.route.map(p => p[0])),
        maxLat: Math.max(...result.route.map(p => p[0])),
        minLng: Math.min(...result.route.map(p => p[1])),
        maxLng: Math.max(...result.route.map(p => p[1]))
      })

      console.log('Setting snapped route with', result.route.length, 'points')
      setSnappedRoute(result.route)
      setRouteStats(result.stats)
      setDrawnPoints([])
    }
    setIsDrawing(false)
  }

  const handleCancel = () => {
    setDrawnPoints([])
    setIsDrawing(false)
  }

  const handleToggleDraw = () => {
    if (!isDrawing) {
      setDrawnPoints([])
      setShouldUpdateMap(false)
    }
    setIsDrawing(!isDrawing)
  }

  useEffect(() => {
    if (shouldUpdateMap) {
      setShouldUpdateMap(false)
    }
  }, [shouldUpdateMap])

  const handlePathUpdate = (points: [number, number][]) => {
    setDrawnPoints(points)
  }

  const exportToGPX = () => {
    if (snappedRoute.length === 0) {
      alert('Keine Route zum Exportieren vorhanden')
      return
    }

    // Erstelle GPX manuell
    const trackPoints = snappedRoute.map(p =>
      `      <trkpt lat="${p[0]}" lon="${p[1]}"></trkpt>`
    ).join('\n')

    const gpxData = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Runicorn" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata>
    <name>Runicorn Route</name>
    <time>${new Date().toISOString()}</time>
  </metadata>
  <trk>
    <name>Runicorn Route</name>
    <trkseg>
${trackPoints}
    </trkseg>
  </trk>
</gpx>`

    const blob = new Blob([gpxData], { type: 'application/gpx+xml' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `runicorn-route-${new Date().toISOString().split('T')[0]}.gpx`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <h1>Runicorn Map</h1>
      <SearchControl onSearch={handleSearch} />
      {snappedRoute.length > 0 && routeStats && (
        <div className="export-container">
          <div className="route-stats">
            <div className="stat">
              <span className="stat-label">Distanz:</span>
              <span className="stat-value">{(routeStats.distance / 1000).toFixed(2)} km</span>
            </div>
            <div className="stat">
              <span className="stat-label">Höhenmeter ↑:</span>
              <span className="stat-value">{routeStats.ascend.toFixed(0)} m</span>
            </div>
            <div className="stat">
              <span className="stat-label">Höhenmeter ↓:</span>
              <span className="stat-value">{routeStats.descend.toFixed(0)} m</span>
            </div>
          </div>
          <button onClick={exportToGPX} className="export-button">
            GPX Export
          </button>
        </div>
      )}
      <div className="map-container">
        <MapContainer center={position} zoom={zoom} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapUpdater center={position} zoom={zoom} shouldUpdate={shouldUpdateMap} />
          <DrawingHandler isDrawing={isDrawing} currentPath={drawnPoints} onPathUpdate={handlePathUpdate} />
          <DrawControl
            isDrawing={isDrawing}
            onToggleDraw={handleToggleDraw}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
          />
          {snappedRoute.length > 0 && (
            <Polyline positions={snappedRoute} color={STRAVA_ORANGE} weight={4} />
          )}
        </MapContainer>
      </div>
    </>
  )
}

export default App
