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
  onDrawnPoints: (points: [number, number][]) => void
}

function DrawingHandler({ isDrawing, onDrawnPoints }: DrawingHandlerProps) {
  const [isMouseDown, setIsMouseDown] = useState(false)
  const [currentPath, setCurrentPath] = useState<[number, number][]>([])

  const map = useMapEvents({
    mousedown: (e) => {
      if (isDrawing) {
        setIsMouseDown(true)
        const { lat, lng } = e.latlng
        setCurrentPath(prev => [...prev, [lat, lng]])
      }
    },
    mousemove: (e) => {
      if (isDrawing && isMouseDown) {
        const { lat, lng } = e.latlng
        setCurrentPath(prev => [...prev, [lat, lng]])
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
      if (currentPath.length > 0) {
        onDrawnPoints(currentPath)
        setCurrentPath([])
      }
    }
  }, [isDrawing, map])

  useEffect(() => {
    if (!isDrawing) {
      setCurrentPath([])
    }
  }, [isDrawing])

  return currentPath.length > 1 ? (
    <Polyline positions={currentPath} color={STRAVA_ORANGE} weight={3} opacity={0.7} />
  ) : null
}

function App() {
  const [position, setPosition] = useState<[number, number]>([51.505, -0.09])
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

  const snapToRoad = async (points: [number, number][]) => {
    if (points.length < 2) return points

    // Reduziere die Punkte für OSRM (zu viele Punkte können problematisch sein)
    const reducedPoints = points.filter((_, index) => index % 5 === 0 || index === points.length - 1)

    try {
      const coordinates = reducedPoints.map(p => `${p[1]},${p[0]}`).join(';')
      const url = `https://router.project-osrm.org/route/v1/foot/${coordinates}?overview=full&geometries=geojson`

      const response = await fetch(url)
      const data = await response.json()

      if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
        const route = data.routes[0].geometry.coordinates
        return route.map((coord: [number, number]) => [coord[1], coord[0]] as [number, number])
      }

      return points
    } catch (error) {
      console.error('Fehler beim Snap-to-Road:', error)
      return points
    }
  }

  const handleConfirm = async () => {
    if (drawnPoints.length > 0) {
      const snapped = await snapToRoad(drawnPoints)
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

  const handleDrawnPoints = (points: [number, number][]) => {
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
          <DrawingHandler isDrawing={isDrawing} onDrawnPoints={handleDrawnPoints} />
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
