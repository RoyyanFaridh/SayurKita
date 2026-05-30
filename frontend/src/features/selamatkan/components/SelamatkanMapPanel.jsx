import { useEffect, useRef } from 'react'
import { Navigation } from 'lucide-react'
import { KONDISI_MAP } from '../selamatkanData'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

import iconRetina from 'leaflet/dist/images/marker-icon-2x.png'
import iconUrl    from 'leaflet/dist/images/marker-icon.png'
import shadowUrl  from 'leaflet/dist/images/marker-shadow.png'

L.Icon.Default.mergeOptions({ iconRetinaUrl: iconRetina, iconUrl, shadowUrl })

// ─── Constants ───────────────────────────────────────────────────────
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

const DEFAULT_CENTER = [-7.7956, 110.3695]

// ─── Guard Helper ─────────────────────────────────────────────────────
// Menolak: null, undefined, NaN, string kosong, Infinity
const isValidCoord  = (v) => Number.isFinite(Number(v))
const isValidLatLng = (lat, lng) => isValidCoord(lat) && isValidCoord(lng)

function MapController({ center, isUserLocation }) {
  const map = useMap()
  const prevCenter = useRef(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize()
    }, 100)
    return () => clearTimeout(timer)
  }, [map])

  useEffect(() => {
    if (!isUserLocation || !center) return
    const [lat, lng] = center
    if (!isValidLatLng(lat, lng)) return

    const prev = prevCenter.current
    if (prev && prev[0] === lat && prev[1] === lng) return
    prevCenter.current = center

    const timer = setTimeout(() => {
      try {
        map.flyTo([Number(lat), Number(lng)], 14, { duration: 1.5 })
      } catch {
        // ignore race condition
      }
    }, 150)

    return () => clearTimeout(timer)
  }, [center, isUserLocation, map])

  return null
}

// ─── Icon Factories ───────────────────────────────────────────────────
const createCustomIcon = (colorKey) => {
  const bgColor = PIN_BG[colorKey] || PIN_BG.success
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `<div style="background-color:${bgColor};width:16px;height:16px;border-radius:50%;border:2px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.3);"></div>`,
    iconSize:   [16, 16],
    iconAnchor: [8, 8],
  })
}

const userIcon = L.divIcon({
  className: 'custom-leaflet-user-marker',
  html: `
    <div style="position:relative;display:flex;align-items:center;justify-content:center;">
      <div style="width:12px;height:12px;border-radius:50%;background-color:#2563eb;border:2px solid white;box-shadow:0 1px 3px rgba(0,0,0,0.3);z-index:10;"></div>
      <div style="position:absolute;width:24px;height:24px;border-radius:50%;background-color:rgba(37,99,235,0.2);animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;"></div>
    </div>
  `,
  iconSize:   [24, 24],
  iconAnchor: [12, 12],
})

// ─── Component ────────────────────────────────────────────────────────
export default function SelamatkanMapPanel({ items, radius, userCoords, onLocate, locating }) {
  // Koordinat user hanya dianggap valid kalau lat & lng keduanya finite number.
  // Cek ini penting karena userCoords bisa berupa {} atau { lat: undefined, lng: undefined }
  // dari state awal parent, yang akan lolos truthy check biasa tapi menghasilkan NaN.
  const hasValidUserCoords = userCoords != null &&
    isValidLatLng(userCoords.lat, userCoords.lng)

  const center = hasValidUserCoords
    ? [Number(userCoords.lat), Number(userCoords.lng)]
    : DEFAULT_CENTER

  return (
    <div
      className="rounded-xl overflow-hidden flex flex-col sticky top-18.25 border-[0.5px]"
      style={{
        background:  'var(--bg-surface-1)',
        borderColor: 'var(--border-subtle)',
        boxShadow:   'var(--shadow-xs)',
      }}
    >
      <style>{`@keyframes ping { 75%,100%{ transform:scale(2);opacity:0; } }`}</style>

      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4 border-b-[0.5px]"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        <p className="text-compact-base font-semibold m-0" style={{ color: 'var(--text-primary)' }}>
          Peta Sekitarmu
        </p>
        <button
          onClick={onLocate}
          disabled={locating}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-compact-xs font-medium cursor-pointer transition-colors duration-fast border-[0.5px] disabled:opacity-50"
          style={{
            background:  'var(--bg-subtle)',
            borderColor: 'var(--border-subtle)',
            color:       'var(--text-secondary)',
          }}
        >
          <Navigation size={12} strokeWidth={2} />
          {locating ? 'Mencari...' : 'Lokasiku'}
        </button>
      </div>

      {/* Map */}
      <div className="h-56 z-0">
        <MapContainer
          center={center}
          zoom={14}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%', zIndex: 0 }}
          // ← hapus prop ref yang ada typo `map.invalidateSize()`
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapController center={center} isUserLocation={hasValidUserCoords} />

          {/* Marker user */}
          {hasValidUserCoords && (
            <Marker
              position={[Number(userCoords.lat), Number(userCoords.lng)]}
              icon={userIcon}
            >
              <Popup>Lokasi Anda saat ini</Popup>
            </Marker>
          )}

          {/* Marker item surplus — skip kalau lat/lng tidak valid */}
          {items.map(item => {
            if (!isValidLatLng(item.lat, item.lng)) return null
            const color = KONDISI_MAP[item.kondisi]?.color ?? 'success'
            return (
              <Marker
                key={item.id}
                position={[Number(item.lat), Number(item.lng)]}
                icon={createCustomIcon(color)}
              >
                <Popup>
                  <div className="text-sm font-semibold m-0">{item.nama}</div>
                  <div className="text-xs text-gray-500 m-0">{item.pemilik}</div>
                </Popup>
              </Marker>
            )
          })}
        </MapContainer>
      </div>

      {/* Radius info */}
      <p
        className="px-4 py-2 text-center text-compact-xs border-t-[0.5px] m-0"
        style={{
          background:  'var(--bg-subtle)',
          borderColor: 'var(--border-subtle)',
          color:       'var(--text-muted)',
        }}
      >
        Radius{' '}
        <strong className="font-semibold" style={{ color: 'var(--text-primary)' }}>
          {radius} km
        </strong>
      </p>

      {/* Legend */}
      <div
        className="flex items-center gap-4 px-5 py-3 border-b-[0.5px]"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        {[
          { color: 'success', label: 'Segar'        },
          { color: 'warning', label: 'Segera ambil'  },
          { color: 'danger',  label: 'Hari ini!'    },
        ].map(({ color, label }) => (
          <div key={color} className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full shrink-0 ${DOT_CLS[color]}`} />
            <span className="text-compact-xs" style={{ color: 'var(--text-secondary)' }}>
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Nearest list */}
      <div className="px-5 py-4 flex flex-col gap-0.5">
        <p
          className="text-compact-xs font-semibold uppercase tracking-wide mb-2 m-0"
          style={{ color: 'var(--text-muted)' }}
        >
          Terdekat
        </p>
        {items.slice(0, 3).map(item => {
          const color = KONDISI_MAP[item.kondisi]?.color ?? 'success'
          return (
            <div
              key={item.id}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer transition-colors duration-fast"
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-subtle)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <span className={`w-2 h-2 rounded-full shrink-0 ${DOT_CLS[color]}`} />
              <div className="min-w-0">
                <p className="text-compact-sm font-medium truncate m-0" style={{ color: 'var(--text-primary)' }}>
                  {item.nama}
                </p>
                <p className="text-compact-xs m-0" style={{ color: 'var(--text-muted)' }}>
                  {item.jarak} · {item.pemilik}
                </p>
              </div>
            </div>
          )
        })}

        {items.length === 0 && (
          <p className="text-compact-sm py-3 text-center m-0" style={{ color: 'var(--text-muted)' }}>
            Tidak ada surplus di sekitarmu
          </p>
        )}
      </div>
    </div>
  )
}