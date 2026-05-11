import { useMemo } from 'react'
import { ArrowRight, MapPin } from 'lucide-react'
import { hitungJarak, formatJarak } from '../../../utils/geoUtils'

const SURPLUS = [
  { id: 1, name: 'Nasi Kotak Sisa Acara RT', by: 'Sari',   qty: '10 box',  status: 'segar',    lat: -7.7934, lng: 110.3658 },
  { id: 2, name: 'Rendang sisa lebaran',      by: 'Sri',    qty: '2 porsi', status: 'segar',    lat: -7.8012, lng: 110.3714 },
  { id: 3, name: 'Sayur campur',              by: 'Joko',   qty: 'Banyak',  status: 'mau-basi', lat: -7.7889, lng: 110.3801 },
  { id: 4, name: 'Nasi Kemarin',              by: 'Aminah', qty: '4 porsi', status: 'basi',     lat: -7.8103, lng: 110.3592 },
]

const STATUS_MAP = {
  'segar':    { cls: 'bg-(--status-segar-bg) text-(--status-segar-text) border border-(--status-segar-border)',     label: 'Segar'    },
  'mau-basi': { cls: 'bg-(--status-hati-bg)  text-(--status-hati-text)  border border-(--status-hati-border)',      label: 'Mau basi' },
  'basi':     { cls: 'bg-(--status-basi-bg)  text-(--status-basi-text)  border border-(--status-basi-border)',      label: 'Basi'     },
}

export default function SurplusDashWidget({ userCoords }) {
  const items = useMemo(() => {
    return SURPLUS
      .map(item => {
        if (!userCoords) return { ...item, _jarakRaw: Infinity, jarakLabel: null }
        const km = hitungJarak(userCoords.lat, userCoords.lng, item.lat, item.lng)
        return { ...item, _jarakRaw: km, jarakLabel: formatJarak(km) }
      })
      .sort((a, b) => a._jarakRaw - b._jarakRaw)
  }, [userCoords])

  return (
    <div className="rounded-xl overflow-hidden border bg-(--bg-surface-1) border-(--border-subsub) shadow-(--shadow-xs)">
      <div className="flex justify-between items-start gap-3 px-4 py-3.5 border-b border-(--border-subtle)">
        <div className="flex-1">
          <h2 className="text-compact-lg font-semibold text-(--text-primary)">Surplus Dekatmu</h2>
          <p className="flex items-center gap-1.5 text-compact-sm mt-0.5 text-(--text-muted)">
            <span
              className="inline-block w-1.5 h-1.5 rounded-full shrink-0 bg-danger-500"
              style={{ animation: 'pulse 1.6s ease-in-out infinite' }}
              aria-hidden="true"
            />
            Live · Aktivitas komunitas
          </p>
        </div>
        <button className="inline-flex items-center gap-1 text-compact-base font-medium border-none bg-transparent cursor-pointer shrink-0 transition-colors duration-150 text-(--text-brand) hover:text-primary-400">
          Lihat semua <ArrowRight size={14} strokeWidth={2} />
        </button>
      </div>

      <ul>
        {items.map(({ id, name, by, qty, status, jarakLabel }, i) => (
          <li
            key={id}
            className={`flex justify-between items-center gap-3 px-4 py-3 ${i < items.length - 1 ? 'border-b border-(--border-subtle)' : ''}`}
          >
            <div className="flex-1 min-w-0">
              <p className="text-compact-lg font-medium truncate text-(--text-primary)">{name}</p>
              <p className="flex items-center gap-1.5 text-compact-sm mt-0.5 text-(--text-muted)">
                {by} · {qty}
                {jarakLabel && (
                  <>
                    <span className="w-px h-3 bg-(--border-default) shrink-0" />
                    <MapPin size={10} strokeWidth={2} className="shrink-0" />
                    {jarakLabel}
                  </>
                )}
              </p>
            </div>
            <span className={`text-compact-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${STATUS_MAP[status].cls}`}>
              {STATUS_MAP[status].label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}