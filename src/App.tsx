import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, useMap, Polyline, useMapEvents } from 'react-leaflet'
import { OpenStreetMapProvider } from 'leaflet-geosearch'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { MapToolbar } from '@/components/MapToolbar'
import { RouteProcessing } from '@/components/RouteProcessing'
import { Toast } from '@/components/Toast'
import { DrawControls } from '@/components/DrawControls'
import { ZoomControls } from '@/components/ZoomControls'
import { MapContainerWrapper } from '@/components/Map/MapContainer'
import { useRouteDrawing } from '@/hooks/useRouteDrawing'
import { snapToRoad, type RouteResult } from '@/lib/graphhopper'
import { exportToGPX } from '@/lib/gpx'

const provider = new OpenStreetMapProvider()
const ROUTE_COLOR = '#FC4C02'

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
  const [showHero, setShowHero] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [position, setPosition] = useState<[number, number]>([49.0069, 8.4037])
  const [zoom, setZoom] = useState(13)
  const [shouldUpdateMap, setShouldUpdateMap] = useState(false)
  const [snappedRoute, setSnappedRoute] = useState<[number, number][]>([])
  const [routeStats, setRouteStats] = useState<RouteResult['stats'] | null>(null)
  const [showCreativeHint, setShowCreativeHint] = useState(false)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [abortController, setAbortController] = useState<AbortController | null>(null)

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
      const controller = new AbortController()
      setAbortController(controller)
      setIsProcessing(true)
      setProcessingProgress(0)
      try {
        const result = await snapToRoad(points, (current, total) => {
          const progress = (current / total) * 100
          setProcessingProgress(progress)
        })
        if (!controller.signal.aborted) {
          setSnappedRoute(result.route)
          setRouteStats(result.stats)
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error('Error processing route:', error)
          alert('Error processing route. Please try again in a moment.')
        }
      } finally {
        setIsProcessing(false)
        setProcessingProgress(0)
        setAbortController(null)
      }
    }
  }

  const handleCancelProcessing = () => {
    if (abortController) {
      abortController.abort()
      setIsProcessing(false)
      setProcessingProgress(0)
      setAbortController(null)
      cancelDrawing()
    }
  }

  const handleReset = () => {
    setSnappedRoute([])
    setRouteStats(null)
    cancelDrawing()
  }

  const handleExport = () => {
    if (snappedRoute.length === 0) {
      setShowCreativeHint(true)
      return
    }
    exportToGPX(snappedRoute, () => {
      setShowToast(true)
    })
  }

  useEffect(() => {
    if (shouldUpdateMap) {
      setShouldUpdateMap(false)
    }
  }, [shouldUpdateMap])

  if (showHero) {
    return (
      <div className="h-screen w-screen flex flex-col overflow-hidden bg-background">
        <Header onLogoClick={() => setShowHero(true)} />
        <div className="flex-1 overflow-hidden">
          <Hero onGetStarted={() => setShowHero(false)} />
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-background">
      <Header onLogoClick={() => setShowHero(true)} />
      <MapToolbar
        onSearch={handleSearch}
        routeStats={routeStats || undefined}
        onExport={handleExport}
      />
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
            <Polyline positions={snappedRoute} color={ROUTE_COLOR} weight={4} />
          )}
        </MapContainer>
        {isProcessing && <RouteProcessing progress={processingProgress} onCancel={handleCancelProcessing} />}
      </MapContainerWrapper>
      {showToast && (
        <Toast
          message="GPX downloaded! Upload it and watch the reactions 🎉"
          onClose={() => setShowToast(false)}
        />
      )}
      {showCreativeHint && (
        <Toast
          message="Get creative first! 🎨"
          onClose={() => setShowCreativeHint(false)}
        />
      )}
    </div>
  )
}

export default App
