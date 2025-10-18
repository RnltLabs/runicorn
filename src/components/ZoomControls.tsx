import { Plus, Minus } from "lucide-react"
import { useMap } from "react-leaflet"
import { Button } from "@/components/ui/button"

export function ZoomControls() {
  const map = useMap()

  const handleZoomIn = () => {
    map.zoomIn()
  }

  const handleZoomOut = () => {
    map.zoomOut()
  }

  return (
    <div className="absolute bottom-4 right-4 z-[1000] flex flex-col gap-2">
      <Button
        onClick={handleZoomIn}
        size="icon"
        variant="secondary"
        className="h-12 w-12 shadow-lg backdrop-blur-sm"
        title="Zoom in"
      >
        <Plus className="h-5 w-5" />
      </Button>
      <Button
        onClick={handleZoomOut}
        size="icon"
        variant="secondary"
        className="h-12 w-12 shadow-lg backdrop-blur-sm"
        title="Zoom out"
      >
        <Minus className="h-5 w-5" />
      </Button>
    </div>
  )
}
