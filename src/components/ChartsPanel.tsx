import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import type { DataPoint } from '../data/mock'

export type ChartsPanelProps = {
  title?: string
  data: DataPoint[]
  showHeader?: boolean
}

const tooltipStyle = { fontSize: 12 }

export default function ChartsPanel({ title = 'Dashboard', data, showHeader = true }: ChartsPanelProps) {
  // Prepare range chart data using stacked bars: hidden base = tMin, visible = (tMax - tMin)
  const rangeData = data.map((d) => ({ ...d, base: d.tMin, range: Number((d.tMax - d.tMin).toFixed(1)) }))

  return (
    <div className="flex h-full flex-col gap-3">
      {showHeader && (
        <div className="glass p-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          </div>
        </div>
      )}

      {/* Top: Humidity (bar) + Radiation (line) dual axis */}
      <div className="glass p-3">
        <div className="h-[280px] w-full">
          <ResponsiveContainer>
            <ComposedChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis yAxisId="left" unit="%" tick={{ fontSize: 12 }} domain={[0, 100]} />
              <YAxis yAxisId="right" orientation="right" unit=" W/m²" tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
              <Bar yAxisId="left" dataKey="humidity" name="Humidity (%)" barSize={22} fill="#60a5fa" />
              <Line yAxisId="right" type="monotone" dataKey="radiation" name="Radiation (W/m²)" stroke="#ef4444" strokeWidth={2} dot={{ r: 2 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom: Temperature range chart */}
      <div className="glass p-3">
        <div className="h-[240px] w-full">
          <ResponsiveContainer>
            <ComposedChart data={rangeData} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis unit=" °C" tick={{ fontSize: 12 }} domain={[18, 38]} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
              {/* Invisible base */}
              <Bar dataKey="base" stackId="temp" fill="#ffffff00" name="Min" />
              {/* Visible range */}
              <Bar dataKey="range" stackId="temp" name="Temperature Range" fill="#fca5a5" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
