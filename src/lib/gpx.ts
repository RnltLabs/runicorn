/**
 * Copyright (c) 2025 Roman Reinelt / RNLT Labs
 *
 * This software is proprietary and confidential.
 * Unauthorized use, reproduction, or distribution is prohibited.
 * For licensing information, contact: hello@rnltlabs.de
 */

import { toast } from 'sonner'

export function exportToGPX(route: [number, number][], onSuccess?: () => void): void {
  if (route.length === 0) {
    toast.error('No route to export')
    return
  }

  const trackPoints = route
    .map(p => `      <trkpt lat="${p[0]}" lon="${p[1]}"></trkpt>`)
    .join('\n')

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

  if (onSuccess) {
    onSuccess()
  }
}
