import { useEffect, useMemo, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet'
import type { FeatureCollection } from 'geojson'
import L, { Map as LeafletMap } from 'leaflet'
import type { LatLngBoundsExpression } from 'leaflet'
import regions from '../data/regionsGeo.json'
import SearchBox from './SearchBox'
import { DEFAULT_LOCATION_ID, generateSeries, type Location } from '../data/mock'

// Fix default marker icon paths in Vite
const DefaultIcon = L.icon({
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).toString(),
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).toString(),
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).toString(),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})
L.Marker.prototype.options.icon = DefaultIcon

export type MapPanelProps = {
  onPickLocation: (id: string) => void
  pickedLocationId?: string
  onToggleDashboard?: () => void
  dashboardVisible?: boolean
  onLocationsReady?: (locations: Location[]) => void
}

const SG_CENTER: [number, number] = [1.3521, 103.8198]

export default function MapPanel({ onPickLocation, pickedLocationId: _pickedLocationId = DEFAULT_LOCATION_ID, onToggleDashboard, dashboardVisible = true, onLocationsReady }: MapPanelProps) {
  const mapRef = useRef<LeafletMap | null>(null)
  const regionNames = useMemo(() => {
    const fc = regions as unknown as FeatureCollection
    return fc.features.map((f: any) => f.properties?.name as string)
  }, [])

  // Build all region markers with generated demo data
  const allLocations = useMemo<Location[]>(() => {
    const fc = regions as unknown as FeatureCollection
    return fc.features.map((f: any, idx: number) => {
      const name: string = f.properties?.name
      const id = String(name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      const bounds = L.geoJSON(f).getBounds()
      const c = bounds.getCenter()
      return {
        id,
        name,
        coords: [c.lat, c.lng],
        data: generateSeries(idx + 1),
      }
    })
  }, [])

  // Notify parent when locations are ready
  useEffect(() => {
    onLocationsReady?.(allLocations)
  }, [onLocationsReady, allLocations])

  // Make regions non-interactive and invisible to avoid blocking marker clicks
  const geoStyle = (): L.PathOptions => ({
    interactive: false,
    color: 'transparent',
    weight: 0,
    opacity: 0,
    fillColor: 'transparent',
    fillOpacity: 0,
  })

  const zoomToRegion = (name: string) => {
    const map = mapRef.current
    if (!map) return
    const fc = regions as unknown as FeatureCollection
    const feature = fc.features.find((f: any) => f.properties?.name === name)
    if (!feature) return
    const geojson = L.geoJSON(feature)
    const bounds = geojson.getBounds() as LatLngBoundsExpression
    map.fitBounds(bounds, { padding: [20, 20] })
  }

  useEffect(() => {
    // Initial fit to Singapore bounds for a nice view
    const map = mapRef.current
    if (!map) return
    map.setView(SG_CENTER, 12)
  }, [])

  return (
    <div className="relative h-full w-full">
      {/* Search overlay (centered pill with zoom buttons) */}
      <div className="pointer-events-none absolute left-1/2 top-5 z-[1000] w-[min(560px,90vw)] -translate-x-1/2">
        <div className="pointer-events-auto flex items-center gap-3 rounded-full border border-white/40 bg-white/70 px-3 py-2 shadow-md backdrop-blur supports-[backdrop-filter]:bg-white/50">
          {/* Zoom controls on the left */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Zoom in"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/60 bg-white/70 text-gray-800 hover:bg-white"
              onClick={() => mapRef.current?.zoomIn()}
            >
              +
            </button>
            <button
              type="button"
              aria-label="Zoom out"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/60 bg-white/70 text-gray-800 hover:bg-white"
              onClick={() => mapRef.current?.zoomOut()}
            >
              −
            </button>
            {/* Reset to center (person icon) */}
            <button
              type="button"
              aria-label="Reset map view"
              title="Reset map view"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/60 bg-white/70 text-gray-800 hover:bg-white"
              onClick={() => mapRef.current?.flyTo(SG_CENTER, 12, { duration: 0.6 })}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path fillRule="evenodd" d="M12 13a5 5 0 100-10 5 5 0 000 10zm-7 9a7 7 0 0114 0h-2a5 5 0 00-10 0H5z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          {/* Search input */}
          <div className="flex-1">
            <SearchBox
              items={regionNames}
              onPick={(name) => zoomToRegion(name)}
              placeholder="Search.."
              variant="pill"
            />
          </div>
          {/* Hamburger/menu icon on the right */}
          <button
            type="button"
            aria-label="Menu"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-white/60 text-gray-700 shadow-sm hover:bg-white"
          >
            ≡
          </button>
          {/* Dashboard icon button */}
          <button
            type="button"
            aria-label="Dashboard"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-white/60 text-gray-700 shadow-sm hover:bg-white"
            onClick={() => onToggleDashboard?.()}
            aria-pressed={dashboardVisible}
          >
            {/* Simple grid/dashboard icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path d="M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 0h6v6h-6v-6z" />
            </svg>
          </button>
        </div>
      </div>

      <MapContainer
        center={SG_CENTER}
        zoom={12}
        zoomControl={false}
        ref={(m: LeafletMap | null) => (mapRef.current = m)}
        className="h-full w-full"
      >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {(regions as unknown as FeatureCollection).features.map((f: any, idx: number) => (
            <GeoJSON key={`region-${idx}`} data={f as any} style={geoStyle} interactive={false} bubblingMouseEvents={false} />
          ))}

          {allLocations.map((loc) => (
            <Marker
              key={loc.id}
              position={loc.coords}
              eventHandlers={{
                click: () => onPickLocation(loc.id),
                popupopen: () => onPickLocation(loc.id),
              }}
            >
              <Popup autoPan>
                <div className="text-sm">
                  <div className="font-semibold">{loc.name}</div>
                  <button
                    type="button"
                    onClick={() => onPickLocation(loc.id)}
                    className="mt-2 rounded-md bg-brand-600 px-3 py-1 text-white hover:bg-brand-700"
                  >
                    Open Details
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  )
}
