import { useMemo, useState } from 'react'
import MapPanel from './components/MapPanel'
import ChartsPanel from './components/ChartsPanel'
import DetailModal from './components/DetailModal'
import type { DataPoint, Location } from './data/mock'
import './App.css'

function App() {
  const [locations, setLocations] = useState<Location[]>([])
  const [picked, setPicked] = useState<string>('')
  const [open, setOpen] = useState(false)
  const [showDashboard, setShowDashboard] = useState(true)
  const selected = useMemo(() => locations.find((l) => l.id === picked) ?? locations[0], [picked, locations])

  // Singapore-wide aggregate series for the main dashboard
  const sgData = useMemo<DataPoint[]>(() => {
    if (locations.length === 0) return []
    const len = locations[0].data.length
    const out: DataPoint[] = []
    for (let i = 0; i < len; i++) {
      const date = locations[0].data[i].date
      let humidity = 0,
        radiation = 0,
        tMin = 0,
        tMax = 0
      for (const loc of locations) {
        humidity += loc.data[i].humidity
        radiation += loc.data[i].radiation
        tMin += loc.data[i].tMin
        tMax += loc.data[i].tMax
      }
      const n = locations.length
      out.push({
        date,
        humidity: Math.round(humidity / n),
        radiation: Math.round(radiation / n),
        tMin: Number((tMin / n).toFixed(1)),
        tMax: Number((tMax / n).toFixed(1)),
      })
    }
    return out
  }, [locations])

  return (
    <div className="min-h-screen bg-transparent">
      {/* Map background: full-screen */}
      <div className="fixed inset-0 z-0">
        <MapPanel
          onPickLocation={(id) => {
            setPicked(id)
            setOpen(true)
          }}
          pickedLocationId={picked}
          onToggleDashboard={() => setShowDashboard((v) => !v)}
          dashboardVisible={showDashboard}
          onLocationsReady={(locs) => {
            setLocations(locs)
            if (!picked && locs.length > 0) setPicked(locs[0].id)
          }}
        />
      </div>

      {/* Top header removed per user request */}

      {/* Charts overlay panel */}
      {showDashboard && !open && sgData.length > 0 && (
        <aside
          aria-label="Charts overlay"
          className="fixed right-4 top-20 z-[1000] w-[min(560px,92vw)] space-y-3 pb-6 md:bottom-4"
        >
          <ChartsPanel title="Singapore" data={sgData} />
        </aside>
      )}

      {/* Large modal when a pin is clicked */}
      {selected && <DetailModal open={open} location={selected} onClose={() => setOpen(false)} />}
    </div>
  )
}

export default App
