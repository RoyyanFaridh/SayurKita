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
    <div className="bg-white border border-(--border-subtle) rounded-xl shadow-(--shadow-xs) overflow-hidden flex flex-col sticky top-20">
      <div className="flex items-center justify-between px-4 py-3 border-b border-(--border-subtle)">
        <h2 className="text-(--text-compact-lg) font-semibold">Peta Sekitarmu</h2>
        <button
          onClick={onLocate}
          disabled={locating}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-(--bg-subtle) border border-(--border-subtle) rounded-lg text-(--text-compact-sm) font-medium cursor-pointer transition-colors duration-150 hover:bg-primary-100 disabled:opacity-50"
        >
          <Navigation size={13} strokeWidth={2} />
          {locating ? 'Mencari...' : 'Lokasiku'}
        </button>
      </div>

      <div className="h-60">
        <Map
          mapId="b9ea8f23872bbcd4a9eddc22"
          style={{ width: '100%', height: '100%' }}
          defaultCenter={center}
          center={center}
          defaultZoom={14}
          gestureHandling="greedy"
          disableDefaultUI
          zoomControl={false}
          mapTypeControl={false}
          scaleControl={false}
          streetViewControl={false}
          rotateControl={false}
          fullscreenControl={false}
        >
          <AdvancedMarker position={center}>
            <div className="relative flex items-center justify-center">
              <div className="w-3.5 h-3.5 rounded-full bg-primary-600 border-2 border-white shadow-sm z-10" />
              <div className="absolute w-7 h-7 rounded-full bg-primary-600/20 animate-ping" />
            </div>
          </AdvancedMarker>

          {items.map(item => {
            if (!item.lat || !item.lng) return null
            const color = KONDISI_MAP[item.kondisi]?.color ?? 'success'
            return (
              <AdvancedMarker
                key={item.id}
                position={{ lat: item.lat, lng: item.lng }}
                title={item.nama}
              >
                <MapPin
                  size={20}
                  strokeWidth={2}
                  className={`${MARKER_CLS[color]} drop-shadow-sm`}
                  fill={PIN_BG[color]}
                />
              </AdvancedMarker>
            )
          })}
        </Map>
      </div>

      <p className="px-3 py-1.5 text-(--text-compact-xs) text-center bg-(--bg-alt) border-t border-(--border-subtle)">
        Menampilkan radius <strong>{radius} km</strong>
      </p>

      <div className="flex items-center gap-4 px-4 py-2.5 border-b border-(--border-subtle)">
        {[
          { color: 'success', label: 'Segar' },
          { color: 'warning', label: 'Segera ambil' },
          { color: 'danger',  label: 'Hari ini!' },
        ].map(({ color, label }) => (
          <div key={color} className="flex items-center gap-1.5 text-(--text-compact-xs)">
            <span className={`w-2 h-2 rounded-full shrink-0 ${DOT_CLS[color]}`} />
            {label}
          </div>
        ))}
      </div>

      <div className="px-4 py-3 flex flex-col gap-1">
        <p className="text-(--text-compact-sm) font-semibold uppercase tracking-wide mb-1">Terdekat</p>
        {items.slice(0, 3).map(item => {
          const color = KONDISI_MAP[item.kondisi]?.color ?? 'success'
          return (
            <div key={item.id} className="flex items-center gap-2.5 px-2 py-2 rounded-lg cursor-pointer transition-colors duration-75 hover:bg-(--bg-alt)">
              <span className={`w-2 h-2 rounded-full shrink-0 ${DOT_CLS[color]}`} />
              <div className="min-w-0">
                <p className="text-(--text-compact-base) font-medium truncate">{item.nama}</p>
                <p className="text-(--text-compact-xs)">{item.jarak} · {item.pemilik}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}