import { Search, Filter, ChevronDown, MapPin } from 'lucide-react'
import { KATEGORI_FILTER } from '../selamatkanData'

export default function SelamatkanToolbar({ search, onSearch, kategori, onKategori, radius, onRadius, sortBy, onSort }) {
  const selectCls = `flex items-center gap-2 relative
    bg-[var(--bg-alt)] border border-[var(--border-default)]
    rounded-xl px-3 py-2 text-[var(--text-secondary)] whitespace-nowrap`

  const selectInner = `bg-transparent border-0 text-[var(--text-secondary)]
    text-[0.75rem] font-[var(--font-body)] cursor-pointer appearance-none pr-5
    focus:outline-none`

  return (
    <div className="flex flex-col gap-2.5">
      {/* Row: search + selects */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-44">
          <Search size={13} strokeWidth={2}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-(--text-muted) pointer-events-none" />
          <input
            className="w-full py-2 pl-8 pr-3 bg-[var(--bg-alt)]
                       border border-[var(--border-default)] rounded-xl
                       text-[0.8125rem] text-[var(--text-primary)]
                       placeholder:text-[var(--text-muted)]
                       font-[var(--font-body)] box-border
                       transition-colors duration-150
                       focus:outline-none focus:border-[var(--border-brand)]"
            placeholder="Cari surplus makanan…"
            value={search}
            onChange={e => onSearch(e.target.value)}
          />
        </div>

        {/* Radius */}
        <div className={selectCls}>
          <MapPin size={12} strokeWidth={2} className="shrink-0" />
          <select className={selectInner} value={radius} onChange={e => onRadius(e.target.value)}>
            <option value="1">Radius 1 km</option>
            <option value="3">Radius 3 km</option>
            <option value="5">Radius 5 km</option>
            <option value="10">Radius 10 km</option>
          </select>
          <ChevronDown size={12} strokeWidth={2} className="absolute right-3 pointer-events-none" />
        </div>

        {/* Sort */}
        <div className={selectCls}>
          <Filter size={12} strokeWidth={2} className="shrink-0" />
          <select className={selectInner} value={sortBy} onChange={e => onSort(e.target.value)}>
            <option value="waktu">Terbaru</option>
            <option value="jarak">Terdekat</option>
            <option value="kondisi">Paling mendesak</option>
          </select>
          <ChevronDown size={12} strokeWidth={2} className="absolute right-3 pointer-events-none" />
        </div>
      </div>

      {/* Kategori chips */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {KATEGORI_FILTER.map(k => (
          <button
            key={k}
            onClick={() => onKategori(k)}
            className={`px-3 py-1.5 rounded-full border text-[0.75rem] font-medium
                        font-[var(--font-body)] whitespace-nowrap cursor-pointer
                        transition-all duration-150
                        ${kategori === k
                          ? 'bg-primary-900 border-primary-900 text-white'
                          : 'bg-white border-[var(--border-default)] text-[var(--text-secondary)] hover:border-[var(--border-brand)] hover:text-[var(--text-brand)]'
                        }`}
          >
            {k}
          </button>
        ))}
      </div>
    </div>
  )
}