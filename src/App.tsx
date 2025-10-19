/**
 * Copyright (c) 2025 Roman Reinelt / RNLT Labs
 *
 * This software is proprietary and confidential.
 * Unauthorized use, reproduction, or distribution is prohibited.
 * For licensing information, contact: hello@rnltlabs.de
 */

import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, useMap, Polyline, useMapEvents, Circle } from 'react-leaflet'
import { OpenStreetMapProvider } from 'leaflet-geosearch'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { MapToolbar } from '@/components/MapToolbar'
import { RouteProcessing } from '@/components/RouteProcessing'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'
import { DrawControls } from '@/components/DrawControls'
import { ZoomControls } from '@/components/ZoomControls'
import { MapContainerWrapper } from '@/components/Map/MapContainer'
import { CookieBanner } from '@/components/CookieBanner'
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

type DrawMode = 'draw' | 'erase' | 'pan'

interface DrawingHandlerProps {
  isDrawing: boolean
  drawMode: DrawMode
  segments: [number, number][][]
  onPathUpdate: (point: [number, number]) => void
  onErase: (point: [number, number], radius: number) => void
}

function DrawingHandler({ isDrawing, drawMode, segments, onPathUpdate, onErase }: DrawingHandlerProps) {
  const [isMouseDown, setIsMouseDown] = useState(false)
  const [mousePosition, setMousePosition] = useState<[number, number] | null>(null)
  const [eraserRadius, setEraserRadius] = useState(30) // Pixel radius
  const ERASER_PIXEL_RADIUS = 45 // Fixed pixel size on screen (increased for mobile)

  const map = useMapEvents({
    mousedown: (e) => {
      if (isDrawing && drawMode !== 'pan') {
        const originalEvent = e.originalEvent as MouseEvent | undefined
        if (originalEvent && originalEvent.target &&
            ((originalEvent.target as Element).closest('.absolute') ||
             (originalEvent.target as Element).closest('button'))) {
          return
        }
        setIsMouseDown(true)
        const { lat, lng } = e.latlng
        console.log(`mousedown: drawMode=${drawMode}, lat=${lat}, lng=${lng}`)
        if (drawMode === 'erase') {
          // Calculate geographic radius based on pixel radius
          const center = map.latLngToContainerPoint([lat, lng])
          const offset = L.point(center.x + ERASER_PIXEL_RADIUS, center.y)
          const offsetLatLng = map.containerPointToLatLng(offset)
          const degreeRadius = (offsetLatLng.lng - lng)

          console.log(`Calling onErase with radius: ${Math.abs(degreeRadius)}`)
          onErase([lat, lng], Math.abs(degreeRadius))
        } else if (drawMode === 'draw') {
          console.log('Calling onPathUpdate')
          onPathUpdate([lat, lng])
        }
      }
    },
    mousemove: (e) => {
      const originalEvent = e.originalEvent as MouseEvent | undefined
      const { lat, lng } = e.latlng

      // Check if mouse is over UI elements
      const isOverUI = originalEvent && originalEvent.target &&
        ((originalEvent.target as Element).closest('.absolute') ||
         (originalEvent.target as Element).closest('button'))

      if (isDrawing && drawMode === 'erase') {
        if (isOverUI) {
          setMousePosition(null)
        } else {
          setMousePosition([lat, lng])
          // Update radius based on zoom
          const center = map.latLngToContainerPoint([lat, lng])
          const offset = L.point(center.x + ERASER_PIXEL_RADIUS, center.y)
          const offsetLatLng = map.containerPointToLatLng(offset)
          const radius = map.distance([lat, lng], [offsetLatLng.lat, offsetLatLng.lng])
          setEraserRadius(radius)
        }
      }
      if (isDrawing && isMouseDown && !isOverUI && drawMode !== 'pan') {
        if (drawMode === 'erase') {
          const center = map.latLngToContainerPoint([lat, lng])
          const offset = L.point(center.x + ERASER_PIXEL_RADIUS, center.y)
          const offsetLatLng = map.containerPointToLatLng(offset)
          const degreeRadius = (offsetLatLng.lng - lng)
          onErase([lat, lng], Math.abs(degreeRadius))
        } else if (drawMode === 'draw') {
          onPathUpdate([lat, lng])
        }
      }
    },
    mouseup: () => {
      if (isDrawing) {
        setIsMouseDown(false)
        // Hide eraser circle on mobile after touch ends
        if (drawMode === 'erase') {
          setMousePosition(null)
        }
      }
    },
    zoomend: () => {
      // Update eraser radius when zoom changes
      if (drawMode === 'erase' && mousePosition) {
        const center = map.latLngToContainerPoint(mousePosition)
        const offset = L.point(center.x + ERASER_PIXEL_RADIUS, center.y)
        const offsetLatLng = map.containerPointToLatLng(offset)
        const radius = map.distance(mousePosition, [offsetLatLng.lat, offsetLatLng.lng])
        setEraserRadius(radius)
      }
    }
  })

  useEffect(() => {
    if (isDrawing) {
      if (drawMode === 'pan') {
        // Enable dragging in pan mode
        map.dragging.enable()
        map.getContainer().style.cursor = 'grab'
      } else {
        // Disable dragging in draw/erase modes
        map.dragging.disable()
        if (drawMode === 'erase') {
          map.getContainer().style.cursor = 'none'
        } else {
          map.getContainer().style.cursor = 'crosshair'
        }
      }
    } else {
      map.dragging.enable()
      map.getContainer().style.cursor = ''
      setMousePosition(null)
    }
  }, [isDrawing, drawMode, map])

  return (
    <>
      {segments.map((segment, index) =>
        segment.length > 1 && (
          <Polyline
            key={index}
            positions={segment}
            color="#6366f1"
            weight={4}
            opacity={1}
            dashArray="10, 6"
          />
        )
      )}
      {drawMode === 'erase' && mousePosition && (
        <Circle
          center={mousePosition}
          radius={eraserRadius}
          pathOptions={{
            color: '#ef4444',
            fillColor: '#ef4444',
            fillOpacity: 0.2,
            weight: 2
          }}
        />
      )}
    </>
  )
}

function App() {
  const [showHero, setShowHero] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [position, setPosition] = useState<[number, number]>([49.0069, 8.4037])
  const [zoom, setZoom] = useState(13)
  const [shouldUpdateMap, setShouldUpdateMap] = useState(false)
  const [snappedRoute, setSnappedRoute] = useState<[number, number][]>([])
  const [routeStats, setRouteStats] = useState<RouteResult['stats'] | null>(null)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [abortController, setAbortController] = useState<AbortController | null>(null)

  const {
    isDrawing,
    drawnSegments,
    drawMode,
    toggleDrawing,
    setMode,
    updatePath,
    erasePath,
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
      toast.info("Get creative first! 🎨")
      return
    }
    exportToGPX(snappedRoute, () => {
      toast.success("GPX downloaded! Upload it and watch the reactions 🎉")
    })
  }

  useEffect(() => {
    if (shouldUpdateMap) {
      setShouldUpdateMap(false)
    }
  }, [shouldUpdateMap])

  if (showHero) {
    return (
      <div className="h-screen w-screen flex flex-col bg-background">
        <Header onLogoClick={() => setShowHero(true)} />
        <div className="flex-1 overflow-y-auto">
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
          touchZoom={true}
          dragging={true}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapUpdater center={position} zoom={zoom} shouldUpdate={shouldUpdateMap} />
          <DrawingHandler
            isDrawing={isDrawing}
            drawMode={drawMode}
            segments={drawnSegments}
            onPathUpdate={updatePath}
            onErase={erasePath}
          />
          <DrawControls
            isDrawing={isDrawing}
            drawMode={drawMode}
            hasRoute={snappedRoute.length > 0}
            onToggleDraw={toggleDrawing}
            onSetMode={setMode}
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
      <Toaster />
      <CookieBanner />
    </div>
  )
}

export default App
