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
