// SelamatkanMapPanel.jsx
import { MapPin, Navigation } from 'lucide-react'
import { KONDISI_MAP } from '../selamatkanData'
import { Map, AdvancedMarker } from '@vis.gl/react-google-maps'

const MARKER_CLS = {
  success: 'text-success-500',
  warning: 'text-warning-500',
  danger:  'text-danger-500',
}

const DOT_CLS = {
  success: 'bg-success-500',
  warning: 'bg-warning-500',
  danger:  'bg-danger-500',
}

const PIN_BG = {
  success: '#22c55e',
  warning: '#f59e0b',
  danger:  '#ef4444',
}

const DEFAULT_CENTER = { lat: -7.7956, lng: 110.3695 }

export default function SelamatkanMapPanel({ items, radius, userCoords, onLocate, locating }) {
  const center = userCoords ?? DEFAULT_CENTER

  return (
    <div className="bg-(--color-bg-primary) border border-(--border-subtle) rounded-xl overflow-hidden flex flex-col sticky top-20">

      {/* Header */}
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-(--border-subtle)">
        <h2 className="text-xs font-semibold text-(--text-primary) m-0">Peta Sekitarmu</h2>
        <button
          onClick={onLocate}
          disabled={locating}
          className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-(--bg-subtle) border border-(--border-subtle) rounded-lg font-medium cursor-pointer transition-colors duration-150 hover:bg-primary-100 disabled:opacity-50 text-(--text-secondary)"
        >
          <Navigation size={11} strokeWidth={2} />
          {locating ? 'Mencari...' : 'Lokasiku'}
        </button>
      </div>

      {/* Map */}
      <div className="h-56">
        <Map
          mapId="b9ea8f23872bbcd4a9eddc22"
          style={{ width: '100%', height: '100%' }}
          defaultCenter={center}
          center={center}
          defaultZoom={14}
          gestureHandling="greedy"
          disableDefaultUI
        >
          <AdvancedMarker position={center}>
            <div className="relative flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-primary-600 border-2 border-white shadow-sm z-10" />
              <div className="absolute w-6 h-6 rounded-full bg-primary-600/20 animate-ping" />
            </div>
          </AdvancedMarker>
          {items.map(item => {
            if (!item.lat || !item.lng) return null
            const color = KONDISI_MAP[item.kondisi]?.color ?? 'success'
            return (
              <AdvancedMarker key={item.id} position={{ lat: item.lat, lng: item.lng }} title={item.nama}>
                <MapPin size={18} strokeWidth={2} className={`${MARKER_CLS[color]} drop-shadow-sm`} fill={PIN_BG[color]} />
              </AdvancedMarker>
            )
          })}
        </Map>
      </div>

      {/* Radius info */}
      <p className="px-3 py-1.5 text-center text-xs bg-(--bg-alt) border-t border-(--border-subtle) text-(--text-muted) m-0">
        Menampilkan radius <strong className="text-(--text-primary) font-medium">{radius} km</strong>
      </p>

      {/* Legend */}
      <div className="flex items-center gap-3 px-3.5 py-2 border-b border-(--border-subtle)">
        {[
          { color: 'success', label: 'Segar' },
          { color: 'warning', label: 'Segera ambil' },
          { color: 'danger',  label: 'Hari ini!' },
        ].map(({ color, label }) => (
          <div key={color} className="flex items-center gap-1 text-xs text-(--text-secondary)">
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${DOT_CLS[color]}`} />
            {label}
          </div>
        ))}
      </div>

      {/* Nearest list */}
      <div className="px-3.5 py-2.5 flex flex-col gap-0.5">
        <p className="text-xs font-medium text-(--text-muted) mb-1.5 m-0">Terdekat</p>
        {items.slice(0, 3).map(item => {
          const color = KONDISI_MAP[item.kondisi]?.color ?? 'success'
          return (
            <div key={item.id} className="flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-colors duration-75 hover:bg-(--bg-alt)">
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${DOT_CLS[color]}`} />
              <div className="min-w-0">
                <p className="text-xs font-medium truncate text-(--text-primary) m-0">{item.nama}</p>
                <p className="text-xs text-(--text-muted) m-0">{item.jarak} · {item.pemilik}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}