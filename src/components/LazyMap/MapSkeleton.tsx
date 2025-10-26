/**
 * Copyright (c) 2025 Roman Reinelt / RNLT Labs
 *
 * This software is proprietary and confidential.
 * Unauthorized use, reproduction, or distribution is prohibited.
 * For licensing information, contact: hello@rnltlabs.de
 */

export function MapSkeleton(): React.JSX.Element {
  return (
    <div className="h-full w-full bg-muted animate-pulse flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-muted-foreground text-sm">Loading map...</span>
        </div>
        <div className="space-y-2 max-w-md mx-auto px-4">
          <div className="h-3 bg-muted-foreground/20 rounded w-3/4 mx-auto" />
          <div className="h-3 bg-muted-foreground/20 rounded w-1/2 mx-auto" />
        </div>
      </div>
    </div>
  )
}
