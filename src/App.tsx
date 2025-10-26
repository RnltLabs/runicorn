/**
 * Copyright (c) 2025 Roman Reinelt / RNLT Labs
 *
 * This software is proprietary and confidential.
 * Unauthorized use, reproduction, or distribution is prohibited.
 * For licensing information, contact: hello@rnltlabs.de
 */

import { useState, useEffect } from 'react'

import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { MapToolbar } from '@/components/MapToolbar'
import { RouteProcessing } from '@/components/RouteProcessing'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'
import { MapContainerWrapper } from '@/components/Map/MapContainer'
import { ConsentBanner } from '@/components/ConsentBanner'
import { PrivacyPolicy } from '@/components/PrivacyPolicy'
import { LazyInteractiveMap } from '@/components/LazyMap'
import { useRouteDrawing } from '@/hooks/useRouteDrawing'
import { snapToRoad, type RouteResult } from '@/lib/graphhopper'
import { exportToGPX } from '@/lib/gpx'
import { logger } from '@/utils/logger'

type View = 'hero' | 'map' | 'privacy'

function App() {
  const [currentView, setCurrentView] = useState<View>('hero')
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

  const handleSearch = async (query: string): Promise<void> => {
    try {
      // Lazy load search provider only when needed
      const { OpenStreetMapProvider } = await import('leaflet-geosearch')
      const provider = new OpenStreetMapProvider()
      const results = await provider.search({ query })
      if (results && results.length > 0) {
        const { y, x } = results[0]
        setPosition([y, x])
        setZoom(13)
        setShouldUpdateMap(true)
      } else {
        toast.error('Location not found')
      }
    } catch (error) {
      logger.error('location_search_failed', error as Error, {
        query,
      })
      toast.error('Search error')
    }
  }

  const handleConfirm = async (): Promise<void> => {
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
          logger.error('route_processing_failed', error as Error, {
            pointCount: points.length,
          })
          toast.error('Error processing route. Please try again in a moment.')
        }
      } finally {
        setIsProcessing(false)
        setProcessingProgress(0)
        setAbortController(null)
      }
    }
  }

  const handleCancelProcessing = (): void => {
    if (abortController) {
      abortController.abort()
      setIsProcessing(false)
      setProcessingProgress(0)
      setAbortController(null)
      cancelDrawing()
    }
  }

  const handleReset = (): void => {
    setSnappedRoute([])
    setRouteStats(null)
    cancelDrawing()
  }

  const handleExport = (): void => {
    if (snappedRoute.length === 0) {
      toast.info("Get creative first! 🎨")
      return
    }
    exportToGPX(snappedRoute, () => {
      toast.success("GPX downloaded! Upload it and watch the reactions 🎉")
    })
  }

  const handleLogoClick = () => {
    setCurrentView('hero')
    window.location.hash = '/'
  }

  const handlePrivacyClick = () => {
    setCurrentView('privacy')
    window.location.hash = '/datenschutz'
  }

  const handlePrivacyBack = () => {
    setCurrentView('hero')
    window.location.hash = '/'
  }

  useEffect(() => {
    if (shouldUpdateMap) {
      setShouldUpdateMap(false)
    }
  }, [shouldUpdateMap])

  // Privacy Policy View
  if (currentView === 'privacy') {
    return (
      <div className="h-screen w-screen flex flex-col bg-background">
        <Header onLogoClick={handleLogoClick} onPrivacyClick={handlePrivacyClick} />
        <div className="flex-1 overflow-y-auto">
          <PrivacyPolicy onBack={handlePrivacyBack} />
        </div>
      </div>
    )
  }

  // Hero View
  if (currentView === 'hero') {
    return (
      <div className="h-screen w-screen flex flex-col bg-background">
        <Header onLogoClick={handleLogoClick} onPrivacyClick={handlePrivacyClick} />
        <div className="flex-1 overflow-y-auto">
          <Hero onGetStarted={() => setCurrentView('map')} />
        </div>
        <ConsentBanner />
      </div>
    )
  }

  // Map View - Lazy loaded only when user clicks "Get Started"
  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-background">
      <Header onLogoClick={handleLogoClick} onPrivacyClick={handlePrivacyClick} />
      <MapToolbar
        onSearch={handleSearch}
        routeStats={routeStats || undefined}
        onExport={handleExport}
      />
      <MapContainerWrapper>
        <LazyInteractiveMap
          position={position}
          zoom={zoom}
          shouldUpdateMap={shouldUpdateMap}
          isDrawing={isDrawing}
          drawMode={drawMode}
          drawnSegments={drawnSegments}
          snappedRoute={snappedRoute}
          hasRoute={snappedRoute.length > 0}
          onPathUpdate={updatePath}
          onErase={erasePath}
          onToggleDraw={toggleDrawing}
          onSetMode={setMode}
          onConfirm={handleConfirm}
          onCancel={cancelDrawing}
          onReset={handleReset}
        />
        {isProcessing && <RouteProcessing progress={processingProgress} onCancel={handleCancelProcessing} />}
      </MapContainerWrapper>
      <Toaster />
      <ConsentBanner />
    </div>
  )
}

export default App
