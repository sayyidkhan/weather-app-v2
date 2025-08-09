import { useEffect } from 'react'
import type { Location } from '../data/mock'
import ChartsPanel from './ChartsPanel'
import { MapContainer, TileLayer } from 'react-leaflet'

export type DetailModalProps = {
  open: boolean
  location: Location
  onClose: () => void
}

export default function DetailModal({ open, location, onClose }: DetailModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (open) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  // Lock background scroll when open
  useEffect(() => {
    if (!open) return
    const { body } = document
    const prev = body.style.overflow
    body.style.overflow = 'hidden'
    return () => {
      body.style.overflow = prev
    }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[2000]">
      {/* Dim / blur background */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      {/* Content */}
      <div className="pointer-events-auto absolute left-1/2 top-1/2 w-[min(1400px,96vw)] max-h-[90vh] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-white/40 bg-white/10 p-5 shadow-2xl backdrop-blur-md">
        {/* Title + close */}
        <div className="mb-4 flex items-start justify-between">
          <h3 className="text-3xl font-bold tracking-wide text-white drop-shadow md:text-4xl">{location.name.toUpperCase()}</h3>
          <button aria-label="Close" className="rounded-full bg-white/20 p-2 text-white hover:bg-white/30" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Two columns: charts left, mini-map right */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <ChartsPanel title={location.name} data={location.data} showHeader={false} />
          </div>
          <div className="glass p-2">
            <div className="h-[560px] w-full overflow-hidden rounded-lg">
              <MapContainer center={location.coords} zoom={16} zoomControl={false} className="h-full w-full">
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
              </MapContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
