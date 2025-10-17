import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, useMap, Polyline, useMapEvents } from 'react-leaflet'
import { OpenStreetMapProvider } from 'leaflet-geosearch'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import { Header } from '@/components/Header'
import { SearchBar } from '@/components/SearchBar'
import { RouteStats } from '@/components/RouteStats'
import { DrawControls } from '@/components/DrawControls'
import { ZoomControls } from '@/components/ZoomControls'
import { MapContainerWrapper } from '@/components/Map/MapContainer'
import { useRouteDrawing } from '@/hooks/useRouteDrawing'
import { snapToRoad, type RouteResult } from '@/lib/graphhopper'
import { exportToGPX } from '@/lib/gpx'

const provider = new OpenStreetMapProvider()
const STRAVA_ORANGE = '#FC4C02'

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
        const originalEvent = (e as any).originalEvent
        if (originalEvent && originalEvent.target &&
            (originalEvent.target.closest('.absolute') ||
             originalEvent.target.closest('button'))) {
          return
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
    <Polyline
      positions={currentPath}
      color="#6366f1"
      weight={4}
      opacity={1}
      dashArray="10, 6"
    />
  ) : null
}

function App() {
  const [position, setPosition] = useState<[number, number]>([49.0069, 8.4037])
  const [zoom, setZoom] = useState(13)
  const [shouldUpdateMap, setShouldUpdateMap] = useState(false)
  const [snappedRoute, setSnappedRoute] = useState<[number, number][]>([])
  const [routeStats, setRouteStats] = useState<RouteResult['stats'] | null>(null)

  const {
    isDrawing,
    drawnPoints,
    toggleDrawing,
    updatePath,
    cancelDrawing,
    confirmDrawing,
  } = useRouteDrawing()

  const handleSearch = async (query: string) => {
    try {
      const results = await provider.search({ query })
      if (results && results.length > 0) {
        const { y, x } = results[0]
        setPosition([y, x])
        setZoom(13)
        setShouldUpdateMap(true)
      } else {
        alert('Location not found')
      }
    } catch (error) {
      console.error('Search error:', error)
      alert('Search error')
    }
  }

  const handleConfirm = async () => {
    const points = confirmDrawing()
    if (points.length > 0) {
      const result = await snapToRoad(points)
      setSnappedRoute(result.route)
      setRouteStats(result.stats)
    }
  }

  const handleReset = () => {
    setSnappedRoute([])
    setRouteStats(null)
    cancelDrawing()
  }

  const handleExport = () => {
    exportToGPX(snappedRoute)
  }

  useEffect(() => {
    if (shouldUpdateMap) {
      setShouldUpdateMap(false)
    }
  }, [shouldUpdateMap])

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-background">
      <Header />
      <SearchBar onSearch={handleSearch} />
      {snappedRoute.length > 0 && routeStats && (
        <RouteStats
          distance={routeStats.distance}
          ascend={routeStats.ascend}
          descend={routeStats.descend}
          onExport={handleExport}
        />
      )}
      <MapContainerWrapper>
        <MapContainer
          center={position}
          zoom={zoom}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapUpdater center={position} zoom={zoom} shouldUpdate={shouldUpdateMap} />
          <DrawingHandler isDrawing={isDrawing} currentPath={drawnPoints} onPathUpdate={updatePath} />
          <DrawControls
            isDrawing={isDrawing}
            hasRoute={snappedRoute.length > 0}
            onToggleDraw={toggleDrawing}
            onConfirm={handleConfirm}
            onCancel={cancelDrawing}
            onReset={handleReset}
          />
          <ZoomControls />
          {snappedRoute.length > 0 && (
            <Polyline positions={snappedRoute} color={STRAVA_ORANGE} weight={4} />
          )}
        </MapContainer>
      </MapContainerWrapper>
    </div>
  )
}

export default App
