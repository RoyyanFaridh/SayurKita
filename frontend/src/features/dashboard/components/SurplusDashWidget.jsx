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
  // spasi ganda dibersihkan
  'segar':    { cls: 'bg-(--status-segar-bg) text-(--status-segar-text) border border-(--status-segar-border)',    label: 'Segar'    },
  'mau-basi': { cls: 'bg-(--status-hati-bg) text-(--status-hati-text) border border-(--status-hati-border)',       label: 'Mau basi' },
  'basi':     { cls: 'bg-(--status-basi-bg) text-(--status-basi-text) border border-(--status-basi-border)',       label: 'Basi'     },
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
    <div
      // rounded-md — konsisten, rounded-xl dihapus
      // border-[0.5px] + inline borderColor — --border-subsub dihapus
      // shadow via inline style — konsisten dengan semua card lain
      className="rounded-md overflow-hidden border-[0.5px]"
      style={{ background: 'var(--bg-surface-1)', borderColor: 'var(--border-subtle)', boxShadow: 'var(--shadow-xs)' }}
    >
      <div
        // pt-4 pb-2 px-4 — konsisten dengan pola header card lain
        className="flex justify-between items-start gap-3 px-4 pt-4 pb-2 border-b"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        <div className="flex-1">
          <h2 className="text-compact-lg font-semibold m-0" style={{ color: 'var(--text-primary)' }}>
            Surplus Dekatmu
          </h2>
          <p className="flex items-center gap-1.5 text-compact-sm mt-0.5 m-0" style={{ color: 'var(--text-muted)' }}>
            {/* animate-pulse via Tailwind class, bukan inline style
                bg-secondary-500 (hijau brand) bukan bg-danger-500 (merah) —
                live indicator positif lebih seirama dengan palet SayurKita */}
            <span
              className="inline-block w-1.5 h-1.5 rounded-full shrink-0 bg-secondary-500 animate-pulse"
              aria-hidden="true"
            />
            Live · Aktivitas komunitas
          </p>
        </div>
        <button
          // hover:opacity-75 — konsisten dengan semua button link lain
          className="inline-flex items-center gap-1 text-compact-base font-medium border-none bg-transparent cursor-pointer shrink-0 transition-opacity duration-150 hover:opacity-75"
          style={{ color: 'var(--text-brand)' }}
        >
          Lihat semua <ArrowRight size={14} strokeWidth={2} />
        </button>
      </div>

      {items.length === 0 ? (
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
                      {/* size={12} bukan size={10} — 10px terlalu kecil untuk inline icon */}
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