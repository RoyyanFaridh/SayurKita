import { MapPin, Navigation } from 'lucide-react'
import { KONDISI_MAP } from '../selamatkanData'

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

const PSEUDO_POS = [
  { top: '30%', left: '62%' },
  { top: '55%', left: '40%' },
  { top: '70%', left: '65%' },
  { top: '25%', left: '35%' },
  { top: '60%', left: '25%' },
]

export default function SelamatkanMapPanel({ items, radius }) {
  return (
    <div className="bg-white border border-[var(--border-subtle)] rounded-xl
                    shadow-[var(--shadow-xs)] overflow-hidden flex flex-col
                    sticky top-[calc(64px+1rem)]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3
                      border-b border-[var(--border-subtle)]">
        <h2 className="text-[0.8125rem] font-semibold text-[var(--text-primary)]">
          Peta Sekitarmu
        </h2>
        <button className="inline-flex items-center gap-1.5 px-2.5 py-1
                           bg-[var(--bg-subtle)] border border-[var(--border-subtle)]
                           rounded-lg text-[0.6875rem] font-medium font-[var(--font-body)]
                           text-[var(--text-brand)] cursor-pointer
                           transition-colors duration-150 hover:bg-primary-100">
          <Navigation size={13} strokeWidth={2} /> Lokasiku
        </button>
      </div>

      {/* Map placeholder */}
      <div className="relative">
        <div className="h-[240px] bg-primary-50 relative overflow-hidden">
          {/* Grid SVG */}
          <svg className="absolute inset-0 text-primary-300" width="100%" height="100%">
            <defs>
              <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
                <path d="M 32 0 L 0 0 0 32" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {/* Radius ring */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                          w-[160px] h-[160px] rounded-full
                          border-2 border-dashed border-primary-300
                          bg-primary-600/5" />

          {/* User pin */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                          flex items-center justify-center">
            <div className="w-3.5 h-3.5 rounded-full bg-primary-600 border-2 border-white
                            shadow-sm z-10" />
            <div className="absolute w-[30px] h-[30px] rounded-full bg-primary-600/20
                            animate-ping" />
          </div>

          {/* Item markers */}
          {items.map((item, i) => {
            const color = KONDISI_MAP[item.kondisi]?.color ?? 'success'
            const pos   = PSEUDO_POS[i % PSEUDO_POS.length]
            return (
              <div key={item.id}
                className={`absolute -translate-x-1/2 -translate-y-full
                            drop-shadow-sm ${MARKER_CLS[color]}`}
                style={pos}>
                <MapPin size={16} strokeWidth={2} />
              </div>
            )
          })}
        </div>

        <p className="px-3 py-1.5 text-[0.625rem] text-[var(--text-muted)] text-center
                      bg-[var(--bg-alt)] border-t border-[var(--border-subtle)]">
          Menampilkan radius <strong>{radius} km</strong> · Google Maps akan diintegrasikan
        </p>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 px-4 py-2.5
                      border-b border-[var(--border-subtle)]">
        {[
          { color: 'success', label: 'Segar'       },
          { color: 'warning', label: 'Segera ambil' },
          { color: 'danger',  label: 'Hari ini!'   },
        ].map(({ color, label }) => (
          <div key={color} className="flex items-center gap-1.5 text-[0.625rem] text-[var(--text-muted)]">
            <span className={`w-2 h-2 rounded-full shrink-0 ${DOT_CLS[color]}`} />
            {label}
          </div>
        ))}
      </div>

      {/* Quick list */}
      <div className="px-4 py-3 flex flex-col gap-1">
        <p className="text-[0.6875rem] font-semibold text-[var(--text-muted)]
                      uppercase tracking-[0.06em] mb-1">
          Terdekat
        </p>
        {items.slice(0, 3).map(item => {
          const color = KONDISI_MAP[item.kondisi]?.color ?? 'success'
          return (
            <div key={item.id}
              className="flex items-center gap-2.5 px-2 py-2 rounded-lg
                         cursor-pointer transition-colors duration-75
                         hover:bg-[var(--bg-alt)]">
              <span className={`w-2 h-2 rounded-full shrink-0 ${DOT_CLS[color]}`} />
              <div className="min-w-0">
                <p className="text-[0.75rem] font-medium text-[var(--text-primary)]
                               truncate">
                  {item.nama}
                </p>
                <p className="text-[0.625rem] text-[var(--text-muted)]">
                  {item.jarak} · {item.pemilik}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}