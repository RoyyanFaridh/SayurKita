import { ArrowRight } from 'lucide-react'

const RESEP = [
  { id: 1, name: 'Sayur Lodeh Bayam Tahu Tempe', ingredients: ['Bayam segar', 'Tahu putih', 'Tempe'], featured: true },
  { id: 2, name: 'Sayur Bening Bayam Tahu',       ingredients: ['Bayam segar', 'Tahu putih'],          featured: false },
]

export default function ResepWidget() {
  return (
    <div
      className="rounded-md overflow-hidden p-4 border"
      style={{ background: 'var(--bg-surface-1)', borderColor: 'var(--border-subsub)', boxShadow: 'var(--shadow-xs)' }}
    >
      <div
        className="flex justify-between items-start gap-3 pb-2 mb-3 border-b"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        <div>
          <h2 className="text-compact-lg font-semibold leading-snug m-0" style={{ color: 'var(--text-primary)' }}>
            Resep Rekomendasi AI
          </h2>
          <p className="text-compact-sm mt-0.5 m-0" style={{ color: 'var(--text-muted)' }}>
            Saran resep dari bahan yang akan basi:
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

      <ul className="flex flex-col gap-1">
        {RESEP.map(r => (
          <li
            key={r.id}
            className="group relative flex justify-between items-center gap-2.5 px-3 py-2.5 rounded-md cursor-pointer transition-colors duration-150"
            style={{ background: r.featured ? 'var(--bg-subtle)' : 'transparent' }}
            onMouseEnter={e => { if (!r.featured) e.currentTarget.style.background = 'var(--bg-subtle)' }}
            onMouseLeave={e => { if (!r.featured) e.currentTarget.style.background = 'transparent' }}
          >
            {r.featured && (
              <span
                className="absolute left-0 top-1.5 bottom-1.5 w-0.75 rounded-full"
                style={{ background: 'var(--accent-primary)' }}
              />
            )}
            <div className="flex-1 min-w-0">
              <p
                className="text-compact-lg m-0"
                style={{ color: 'var(--text-primary)', fontWeight: r.featured ? 700 : 500 }}
              >
                {r.name}
              </p>
              <p className="text-compact-sm mt-0.5 m-0" style={{ color: 'var(--text-secondary)' }}>
                {r.ingredients.join(' · ')}
              </p>
            </div>
            <span
              className="shrink-0 ml-2 transition-transform duration-150 group-hover:translate-x-0.5"
              style={{ color: r.featured ? 'var(--text-brand)' : 'var(--text-muted)' }}
            >
              <ArrowRight size={16} strokeWidth={2} />
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}