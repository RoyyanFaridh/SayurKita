import { ArrowRight } from 'lucide-react'

const SURPLUS = [
  { id: 1, name: 'Nasi Kotak Sisa Acara RT', by: 'Sari',   qty: '10 box',  status: 'segar' },
  { id: 2, name: 'Rendang sisa lebaran',      by: 'Sri',    qty: '2 porsi', status: 'segar' },
  { id: 3, name: 'Sayur campur',              by: 'Joko',   qty: 'Banyak',  status: 'mau-basi' },
  { id: 4, name: 'Nasi Kemarin',              by: 'Aminah', qty: '4 porsi', status: 'basi' },
]

const STATUS_MAP = {
  'segar':    { cls: 'label-kondisi--segar',   label: 'Segar' },
  'mau-basi': { cls: 'label-kondisi--mau-exp', label: 'Mau basi' },
  'basi':     { cls: 'label-kondisi--basi',    label: 'Basi' },
}

export default function SurplusDashWidget() {
  return (
    <div
      className="rounded-md overflow-hidden border"
      style={{ background: 'var(--bg-surface-1)', borderColor: 'var(--border-subsub)', boxShadow: 'var(--shadow-xs)' }}
    >
      <div
        className="flex justify-between items-start gap-3 px-4 py-3.5 border-b"
        style={{ borderColor: 'var(--border-subsub)' }}
      >
        <div className="flex-1">
          <h2 className="text-compact-lg font-semibold m-0" style={{ color: 'var(--text-primary)' }}>
            Surplus Dekatmu
          </h2>
          <p className="flex items-center gap-1.5 text-compact-sm mt-0.5 m-0" style={{ color: 'var(--text-muted)' }}>
            <span
              className="inline-block w-[7px] h-[7px] rounded-full shrink-0"
              style={{
                background: 'var(--color-danger-500)',
                animation: 'pulse 1.6s ease-in-out infinite',
              }}
              aria-hidden="true"
            />
            Live · Aktivitas komunitas
          </p>
        </div>
        <button
          className="inline-flex items-center gap-1 text-compact-base font-medium border-none bg-transparent cursor-pointer shrink-0 transition-colors duration-150"
          style={{ color: 'var(--text-brand)' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--brand-green-light)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-brand)'}
        >
          Lihat semua <ArrowRight size={14} strokeWidth={2} />
        </button>
      </div>

      <ul>
        {SURPLUS.map(({ id, name, by, qty, status }, i) => (
          <li
            key={id}
            className="flex justify-between items-center gap-3 px-4 py-3"
            style={{ borderBottom: i < SURPLUS.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}
          >
            <div className="flex-1 min-w-0">
              <p className="text-compact-lg font-medium truncate m-0" style={{ color: 'var(--text-primary)' }}>
                {name}
              </p>
              <p className="text-compact-sm mt-0.5 m-0" style={{ color: 'var(--text-muted)' }}>
                {by} · {qty}
              </p>
            </div>
            <span className={`label-kondisi ${STATUS_MAP[status].cls}`}>
              {STATUS_MAP[status].label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}