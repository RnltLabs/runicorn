/**
 * Copyright (c) 2025 Roman Reinelt / RNLT Labs
 *
 * This software is proprietary and confidential.
 * Unauthorized use, reproduction, or distribution is prohibited.
 * For licensing information, contact: hello@rnltlabs.de
 */

import { type ReactNode } from "react"

interface MapContainerWrapperProps {
  children: ReactNode
}

export function MapContainerWrapper({ children }: MapContainerWrapperProps) {
  return (
    <div className="relative flex-1 w-full">
      {children}
    </div>
  )
}
