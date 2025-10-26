/**
 * Copyright (c) 2025 Roman Reinelt / RNLT Labs
 *
 * This software is proprietary and confidential.
 * Unauthorized use, reproduction, or distribution is prohibited.
 * For licensing information, contact: hello@rnltlabs.de
 */

import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, useMap, Polyline, useMapEvents, Circle } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import { DrawControls } from '@/components/DrawControls'
import { ZoomControls } from '@/components/ZoomControls'
import { logger } from '@/utils/logger'

const ROUTE_COLOR = '#FC4C02'

function MapUpdater({ center, zoom, shouldUpdate }: { center: [number, number], zoom: number, shouldUpdate: boolean }): null {
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

function DrawingHandler({ isDrawing, drawMode, segments, onPathUpdate, onErase }: DrawingHandlerProps): React.JSX.Element {
  const [isMouseDown, setIsMouseDown] = useState(false)
  const [mousePosition, setMousePosition] = useState<[number, number] | null>(null)
  const [eraserRadius, setEraserRadius] = useState(30)
  const ERASER_PIXEL_RADIUS = 45

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
        logger.debug('map_mousedown', {
          drawMode,
          lat,
          lng,
        })
        if (drawMode === 'erase') {
          const center = map.latLngToContainerPoint([lat, lng])
          const offset = L.point(center.x + ERASER_PIXEL_RADIUS, center.y)
          const offsetLatLng = map.containerPointToLatLng(offset)
          const degreeRadius = (offsetLatLng.lng - lng)

          logger.debug('map_erase_action', {
            radius: Math.abs(degreeRadius),
          })
          onErase([lat, lng], Math.abs(degreeRadius))
        } else if (drawMode === 'draw') {
          logger.debug('map_path_update')
          onPathUpdate([lat, lng])
        }
      }
    },
    mousemove: (e) => {
      const originalEvent = e.originalEvent as MouseEvent | undefined
      const { lat, lng } = e.latlng

      const isOverUI = originalEvent && originalEvent.target &&
        ((originalEvent.target as Element).closest('.absolute') ||
         (originalEvent.target as Element).closest('button'))

      if (isDrawing && drawMode === 'erase') {
        if (isOverUI) {
          setMousePosition(null)
        } else {
          setMousePosition([lat, lng])
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
        if (drawMode === 'erase') {
          setMousePosition(null)
        }
      }
    },
    zoomend: () => {
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
        map.dragging.enable()
        map.getContainer().style.cursor = 'grab'
      } else {
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

export interface InteractiveMapProps {
  position: [number, number]
  zoom: number
  shouldUpdateMap: boolean
  isDrawing: boolean
  drawMode: DrawMode
  drawnSegments: [number, number][][]
  snappedRoute: [number, number][]
  hasRoute: boolean
  onPathUpdate: (point: [number, number]) => void
  onErase: (point: [number, number], radius: number) => void
  onToggleDraw: () => void
  onSetMode: (mode: DrawMode) => void
  onConfirm: () => void
  onCancel: () => void
  onReset: () => void
}

export function InteractiveMap({
  position,
  zoom,
  shouldUpdateMap,
  isDrawing,
  drawMode,
  drawnSegments,
  snappedRoute,
  hasRoute,
  onPathUpdate,
  onErase,
  onToggleDraw,
  onSetMode,
  onConfirm,
  onCancel,
  onReset,
}: InteractiveMapProps): React.JSX.Element {
  return (
    <MapContainer
      center={position}
      zoom={zoom}
      style={{ height: '100%', width: '100%' }}
      zoomControl={false}
      touchZoom={true}
      dragging={true}
      scrollWheelZoom={true}
      doubleClickZoom={true}
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
        onPathUpdate={onPathUpdate}
        onErase={onErase}
      />
      <DrawControls
        isDrawing={isDrawing}
        drawMode={drawMode}
        hasRoute={hasRoute}
        onToggleDraw={onToggleDraw}
        onSetMode={onSetMode}
        onConfirm={onConfirm}
        onCancel={onCancel}
        onReset={onReset}
      />
      <ZoomControls />
      {snappedRoute.length > 0 && (
        <Polyline positions={snappedRoute} color={ROUTE_COLOR} weight={4} />
      )}
    </MapContainer>
  )
}
