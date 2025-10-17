import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, useMap, Polyline, useMapEvents } from 'react-leaflet'
import { OpenStreetMapProvider } from 'leaflet-geosearch'
import L from 'leaflet'
import togpx from 'togpx'
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

  // Funktion um den nächsten Punkt auf einer Linie zu finden
  const snapPointToLine = (point: [number, number], lineStart: [number, number], lineEnd: [number, number]): [number, number] => {
    const [px, py] = [point[1], point[0]]
    const [x1, y1] = [lineStart[1], lineStart[0]]
    const [x2, y2] = [lineEnd[1], lineEnd[0]]

    const dx = x2 - x1
    const dy = y2 - y1

    if (dx === 0 && dy === 0) return lineStart

    const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy)))

    return [y1 + t * dy, x1 + t * dx]
  }

  const snapToRoad = async (points: [number, number][]) => {
    console.log('snapToRoad called with points:', points.length)
    if (points.length < 2) {
      console.log('Not enough points, returning original')
      return points
    }

    // Reduziere Punkte für die Abfrage (jeder 5. Punkt)
    const sampledPoints = points.filter((_, i) => i % 5 === 0 || i === points.length - 1)
    console.log('Sampled', sampledPoints.length, 'points for road matching')

    // Berechne Bounding Box
    const lats = sampledPoints.map(p => p[0])
    const lngs = sampledPoints.map(p => p[1])
    const minLat = Math.min(...lats) - 0.001
    const maxLat = Math.max(...lats) + 0.001
    const minLng = Math.min(...lngs) - 0.001
    const maxLng = Math.max(...lngs) + 0.001

    try {
      // Hole alle Straßen in der Bounding Box von OpenStreetMap
      const overpassQuery = `
        [out:json];
        (
          way["highway"]["highway"!~"motorway|motorway_link|trunk|trunk_link"]["footway"!="sidewalk"](${minLat},${minLng},${maxLat},${maxLng});
        );
        out geom;
      `

      console.log('Fetching roads from Overpass API...')
      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: overpassQuery
      })

      const data = await response.json()
      console.log('Got', data.elements?.length || 0, 'road segments')

      if (!data.elements || data.elements.length === 0) {
        console.log('No roads found, returning original points')
        return points
      }

      // Erstelle eine Liste aller Straßensegmente
      const roadSegments: Array<{start: [number, number], end: [number, number]}> = []

      data.elements.forEach((way: any) => {
        if (way.geometry) {
          for (let i = 0; i < way.geometry.length - 1; i++) {
            roadSegments.push({
              start: [way.geometry[i].lat, way.geometry[i].lon],
              end: [way.geometry[i + 1].lat, way.geometry[i + 1].lon]
            })
          }
        }
      })

      console.log('Created', roadSegments.length, 'road segments')

      // Snappe jeden Punkt auf das nächste Straßensegment
      const snappedPoints = sampledPoints.map(point => {
        let minDist = Infinity
        let bestSnap = point

        roadSegments.forEach(segment => {
          const snapped = snapPointToLine(point, segment.start, segment.end)
          const dist = Math.sqrt(
            Math.pow(snapped[0] - point[0], 2) +
            Math.pow(snapped[1] - point[1], 2)
          )

          if (dist < minDist) {
            minDist = dist
            bestSnap = snapped
          }
        })

        return bestSnap
      })

      console.log('Snapped', snappedPoints.length, 'points to roads')
      return snappedPoints

    } catch (error) {
      console.error('Fehler beim Snap-to-Road:', error)
      return points
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

      const snapped = await snapToRoad(drawnPoints)

      console.log('=== GEMAPPTE ROUTE ===')
      console.log('First 10 snapped points:', snapped.slice(0, 10))
      console.log('Last 10 snapped points:', snapped.slice(-10))
      console.log('Snapped bounding box:', {
        minLat: Math.min(...snapped.map(p => p[0])),
        maxLat: Math.max(...snapped.map(p => p[0])),
        minLng: Math.min(...snapped.map(p => p[1])),
        maxLng: Math.max(...snapped.map(p => p[1]))
      })

      // Finde wo die Route weit außerhalb geht
      const outliers = snapped.filter(p => p[1] < 8.405 || p[1] > 8.409)
      console.log('Points outside expected bounds:', outliers.length, 'points')
      if (outliers.length > 0) {
        console.log('First outlier:', outliers[0])
        console.log('Last outlier:', outliers[outliers.length - 1])
      }

      console.log('Setting snapped route with', snapped.length, 'points')
      setSnappedRoute(snapped)
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

    const geojson = {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: snappedRoute.map(p => [p[1], p[0]])
        },
        properties: {
          name: 'Runicorn Route',
          time: new Date().toISOString()
        }
      }]
    }

    const gpx = togpx(geojson)
    const blob = new Blob([gpx], { type: 'application/gpx+xml' })
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
      {snappedRoute.length > 0 && (
        <div className="export-container">
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
