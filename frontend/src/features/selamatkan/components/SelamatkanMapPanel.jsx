// SelamatkanMapPanel.jsx
import { useEffect, useRef } from 'react'
import { MapPin, Navigation } from 'lucide-react'
import { KONDISI_MAP } from '../selamatkanData'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix untuk Leaflet icon default
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png'
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'

L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetina,
  iconUrl: iconUrl,
  shadowUrl: shadowUrl,
})

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

const DEFAULT_CENTER = [-7.7956, 110.3695] // Yogyakarta fallback (atau bisa diganti Medan)

// Komponen pembantu untuk memindahkan kamera peta ketika posisi user berubah
function MapController({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 14, { duration: 1.5 });
    }
  }, [center, map]);
  return null;
}

// Custom DivIcon untuk membuat pin bulat berwarna sesuai kondisi
const createCustomIcon = (colorKey) => {
  const bgColor = PIN_BG[colorKey] || PIN_BG.success;
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `<div style="background-color: ${bgColor}; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });
}

// Custom DivIcon untuk User (Lokasiku)
const userIcon = L.divIcon({
  className: 'custom-leaflet-user-marker',
  html: `
    <div style="position: relative; display: flex; align-items: center; justify-content: center;">
      <div style="width: 12px; height: 12px; border-radius: 50%; background-color: #2563eb; border: 2px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.3); z-index: 10;"></div>
      <div style="position: absolute; width: 24px; height: 24px; border-radius: 50%; background-color: rgba(37,99,235,0.2); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
    </div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

export default function SelamatkanMapPanel({ items, radius, userCoords, onLocate, locating }) {
  const center = userCoords ? [userCoords.lat, userCoords.lng] : DEFAULT_CENTER;

  return (
    <div className="bg-(--color-bg-primary) border border-(--border-subtle) rounded-xl overflow-hidden flex flex-col sticky top-20">
      <style>{`
        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
      `}</style>
      
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

      {/* Map (React-Leaflet) */}
      <div className="h-56 z-0">
        <MapContainer 
          center={center} 
          zoom={14} 
          scrollWheelZoom={true} 
          style={{ height: '100%', width: '100%', zIndex: 0 }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapController center={center} />
          
          {/* Marker Lokasi User */}
          {userCoords && (
            <Marker position={[userCoords.lat, userCoords.lng]} icon={userIcon}>
              <Popup>Lokasi Anda saat ini</Popup>
            </Marker>
          )}

          {/* Marker Data Surplus */}
          {items.map(item => {
            if (!item.lat || !item.lng) return null
            const color = KONDISI_MAP[item.kondisi]?.color ?? 'success'
            return (
              <Marker 
                key={item.id} 
                position={[item.lat, item.lng]} 
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