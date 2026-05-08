import { ArrowRight } from 'lucide-react'

const POSTINGS = [
  {
    id: 1,
    name: 'Rendang Sisa Lebaran',
    statusLabel: 'Aktif',
    statusType: 'aktif',
    sub: 'Menunggu klaim',
    note: 'Jika tidak diklaim, otomatis akan dikirim ke Mitra Organik',
  },
]

const badgeStyle = {
  aktif: { background: 'var(--bg-dark)', color: 'var(--text-brand-dark)' },
}

export default function PostingWidget() {
  return (
    <div
      className="rounded-md overflow-hidden border"
      style={{ background: 'var(--bg-surface-1)', borderColor: 'var(--border-subsub)', boxShadow: 'var(--shadow-xs)' }}
    >
      <div
        className="flex justify-between items-center px-4 py-3.5 border-b"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        <h2 className="text-compact-lg font-semibold m-0" style={{ color: 'var(--text-primary)' }}>
          Posting Aktifmu
        </h2>
        <button
          className="inline-flex items-center gap-1 text-compact-base font-medium border-none bg-transparent cursor-pointer transition-colors duration-150"
          style={{ color: 'var(--text-brand)' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--brand-green-light)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-brand)'}
        >
          Lihat semua <ArrowRight size={14} strokeWidth={2} />
        </button>
      </div>

      <ul>
        {POSTINGS.map((p, i) => (
          <li
            key={p.id}
            style={{ borderBottom: i < POSTINGS.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}
          >
            <div className="flex items-center gap-3 px-4 py-3.5">
              <div
                className="w-10 h-10 rounded-md shrink-0"
                style={{ background: 'var(--bg-subtle)' }}
                aria-hidden="true"
              />
              <div className="flex-1 min-w-0">
                <p className="text-compact-lg font-semibold truncate m-0" style={{ color: 'var(--text-primary)' }}>
                  {p.name}
                </p>
                <p className="text-compact-sm mt-0.5 m-0" style={{ color: 'var(--text-muted)' }}>
                  {p.sub}
                </p>
              </div>
              <span
                className="text-compact-xs font-semibold px-2.5 py-1 rounded-full shrink-0"
                style={badgeStyle[p.statusType]}
              >
                {p.statusLabel}
              </span>
            </div>
            {p.note && (
              <p
                className="text-compact-sm px-4 py-2.5 m-0"
                style={{ color: 'var(--text-brand)', background: 'var(--bg-subtle)' }}
              >
                {p.note}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}