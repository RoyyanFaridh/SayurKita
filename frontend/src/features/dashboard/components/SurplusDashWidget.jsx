import { useState, useEffect, useMemo } from 'react'
import { ArrowRight, MapPin, Loader2, AlertCircle } from 'lucide-react'
import { hitungJarak, formatJarak } from '../../../utils/geoUtils'
import { API_ORIGIN } from '../../../config/api'

// Pemetaan status visual
const STATUS_MAP = {
  'segar':    { cls: 'bg-(--status-segar-bg) text-(--status-segar-text) border border-(--status-segar-border)',  label: 'Segar'    },
  'mau-basi': { cls: 'bg-(--status-hati-bg) text-(--status-hati-text) border border-(--status-hati-border)',     label: 'Mau basi' },
  'basi':     { cls: 'bg-(--status-basi-bg) text-(--status-basi-text) border border-(--status-basi-border)',     label: 'Basi'     },
}

// Petakan pickupTime dari backend ke status visual
// Backend tidak punya field segar/basi — kita inferensikan dari pickupTime
function resolveStatus(pickupTime = '') {
  const t = pickupTime.toLowerCase()
  if (t.includes('segera') || t.includes('hari ini')) return 'mau-basi'
  if (t.includes('besok') || t.includes('2 hari'))    return 'segar'
  return 'segar' // default aman
}

export default function SurplusDashWidget({ userCoords }) {
  const [rawData, setRawData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { setLoading(false); return }

    setLoading(true)
    setError('')

    // Kirim koordinat jika tersedia agar backend sort by distance via PostGIS
    // radius=9999 memastikan semua data muncul meski koordinat default jauh
    const params = new URLSearchParams()
    if (userCoords?.lat) params.set('lat', userCoords.lat)
    if (userCoords?.lng) params.set('lng', userCoords.lng)
    params.set('radius', '9999')

    fetch(`${API_ORIGIN}/api/surplus?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.ok ? res.json() : Promise.reject(`HTTP ${res.status}`))
      .then(data => setRawData(data.data || []))
      .catch(() => setError('Gagal memuat data surplus.'))
      .finally(() => setLoading(false))
  }, [userCoords])

  // Sort by jarak di sisi frontend sebagai fallback
  // (jika backend tidak kirim distanceKm karena tidak ada koordinat)
  const items = useMemo(() => {
    return rawData
      .slice(0, 4) // tampilkan max 4 item di widget
      .map(item => {
        // Gunakan distanceKm dari backend (PostGIS) jika ada, fallback ke Haversine
        const km = item.distanceKm != null
          ? item.distanceKm
          : userCoords
            ? hitungJarak(userCoords.lat, userCoords.lng, item.latitude, item.longitude)
            : null

        return {
          id:         item.id,
          name:       item.title,
          by:         item.user?.name ?? 'Anonim',
          qty:        item.quantity,
          status:     resolveStatus(item.pickupTime),
          jarakLabel: km != null ? formatJarak(km) : null,
          _jarakRaw:  km ?? Infinity,
        }
      })
      .sort((a, b) => a._jarakRaw - b._jarakRaw)
  }, [rawData, userCoords])

  return (
    <div
      className="rounded-md overflow-hidden border-[0.5px]"
      style={{ background: 'var(--bg-surface-1)', borderColor: 'var(--border-subtle)', boxShadow: 'var(--shadow-xs)' }}
    >
      {/* Header */}
      <div
        className="flex justify-between items-start gap-3 px-4 pt-4 pb-2 border-b"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        <div className="flex-1">
          <h2 className="text-compact-lg font-semibold m-0" style={{ color: 'var(--text-primary)' }}>
            Surplus Dekatmu
          </h2>
          <p className="flex items-center gap-1.5 text-compact-sm mt-0.5 m-0" style={{ color: 'var(--text-muted)' }}>
            <span
              className="inline-block w-1.5 h-1.5 rounded-full shrink-0 bg-secondary-500 animate-pulse"
              aria-hidden="true"
            />
            Live · Aktivitas komunitas
          </p>
        </div>
        <button
          className="inline-flex items-center gap-1 text-compact-base font-medium border-none bg-transparent cursor-pointer shrink-0 transition-opacity duration-150 hover:opacity-75"
          style={{ color: 'var(--text-brand)' }}
        >
          Lihat semua <ArrowRight size={14} strokeWidth={2} />
        </button>
      </div>

      {/* Body */}
      {loading ? (
        <div className="flex items-center justify-center gap-2 py-8">
          <Loader2 size={16} className="animate-spin" style={{ color: 'var(--color-secondary-600)' }} />
          <p className="text-compact-sm m-0" style={{ color: 'var(--text-muted)' }}>
            Memuat surplus terdekat...
          </p>
        </div>
      ) : error ? (
        <div
          className="flex items-center gap-2 mx-4 my-4 px-3 py-2.5 rounded-md"
          style={{ background: 'var(--bg-warning-subtle)', border: '0.5px solid var(--border-warning)' }}
        >
          <AlertCircle size={14} className="shrink-0" style={{ color: 'var(--color-warning-600)' }} />
          <p className="text-compact-sm m-0" style={{ color: 'var(--color-warning-800)' }}>{error}</p>
        </div>
      ) : items.length === 0 ? (
        <p className="text-compact-sm py-6 text-center m-0" style={{ color: 'var(--text-muted)' }}>
          Belum ada surplus di sekitarmu.
        </p>
      ) : (
        <ul className="list-none p-0 m-0">
          {items.map(({ id, name, by, qty, status, jarakLabel }, i) => (
            <li
              key={id}
              className={`flex justify-between items-center gap-3 px-4 py-3 ${i < items.length - 1 ? 'border-b' : ''}`}
              style={i < items.length - 1 ? { borderColor: 'var(--border-subtle)' } : {}}
            >
              <div className="flex-1 min-w-0">
                <p className="text-compact-lg font-medium truncate m-0" style={{ color: 'var(--text-primary)' }}>
                  {name}
                </p>
                <p className="flex items-center gap-1.5 text-compact-sm mt-0.5 m-0" style={{ color: 'var(--text-muted)' }}>
                  {by} · {qty}
                  {jarakLabel && (
                    <>
                      <span className="w-px h-3 shrink-0" style={{ background: 'var(--border-default)' }} />
                      <MapPin size={12} strokeWidth={2} className="shrink-0" />
                      {jarakLabel}
                    </>
                  )}
                </p>
              </div>
              <span className={`text-compact-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${STATUS_MAP[status]?.cls ?? ''}`}>
                {STATUS_MAP[status]?.label ?? status}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
