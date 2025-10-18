import { Check, X } from "lucide-react"
import { useEffect } from "react"

interface ToastProps {
  message: string
  onClose: () => void
}

export function Toast({ message, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 3000)

    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="fixed top-[140px] right-4 z-[9999] animate-in slide-in-from-top-5">
      <div className="bg-emerald-600 text-white rounded-lg shadow-2xl p-4 flex items-center gap-3 max-w-sm">
        <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
          <Check className="h-5 w-5" />
        </div>
        <p className="font-medium">{message}</p>
        <button
          onClick={onClose}
          className="ml-2 hover:bg-white/20 rounded-full p-1 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
