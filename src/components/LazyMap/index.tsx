/**
 * Copyright (c) 2025 Roman Reinelt / RNLT Labs
 *
 * This software is proprietary and confidential.
 * Unauthorized use, reproduction, or distribution is prohibited.
 * For licensing information, contact: hello@rnltlabs.de
 */

import { lazy, Suspense } from 'react'
import { MapSkeleton } from './MapSkeleton'
import type { InteractiveMapProps } from './InteractiveMap'

// Lazy load the heavy Leaflet map component
// This splits the bundle and only loads when map is needed (after hero screen)
const InteractiveMap = lazy(() =>
  import('./InteractiveMap').then((module) => ({
    default: module.InteractiveMap,
  }))
)

export function LazyInteractiveMap(props: InteractiveMapProps): React.JSX.Element {
  return (
    <Suspense fallback={<MapSkeleton />}>
      <InteractiveMap {...props} />
    </Suspense>
  )
}
