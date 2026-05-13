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

const BADGE_MAP = {
  aktif: 'bg-(--bg-dark) text-(--text-brand-dark)',
}

export default function PostingWidget() {
  return (
    <div className="rounded-xl overflow-hidden border bg-(--bg-surface-1) border-(--border-subsub) shadow-(--shadow-xs)">
      <div className="flex justify-between items-center px-4 py-3.5 border-b border-(--border-subtle)">
        <h2 className="text-compact-lg font-semibold text-(--text-primary)">Posting Aktifmu</h2>
        <button className="inline-flex items-center gap-1 text-compact-base font-medium border-none bg-transparent cursor-pointer transition-colors duration-150 text-(--text-brand) hover:text-primary-400">
          Lihat semua <ArrowRight size={14} strokeWidth={2} />
        </button>
      </div>

      <ul>
        {POSTINGS.map((p, i) => (
          <li key={p.id} className={i < POSTINGS.length - 1 ? 'border-b border-(--border-subtle)' : ''}>
            <div className="flex items-center gap-3 px-4 py-3.5">
              <div className="w-10 h-10 rounded-md shrink-0 bg-(--bg-subtle)" aria-hidden="true" />
              <div className="flex-1 min-w-0">
                <p className="text-compact-lg font-semibold truncate text-(--text-primary)">{p.name}</p>
                <p className="text-compact-sm mt-0.5 text-(--text-muted)">{p.sub}</p>
              </div>
              <span className={`text-compact-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${BADGE_MAP[p.statusType]}`}>
                {p.statusLabel}
              </span>
            </div>
            {p.note && (
              <p className="text-compact-sm px-4 py-2.5 text-(--text-brand) bg-(--bg-subtle)">
                {p.note}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}