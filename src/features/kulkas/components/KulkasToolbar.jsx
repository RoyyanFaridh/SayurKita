import { Search, Filter, ChevronDown } from 'lucide-react'

const KATEGORI_LIST = ['Semua', 'Sayur', 'Protein', 'Bumbu']

export default function KulkasToolbar({
  search,
  onSearch,
  kategori,
  onKategori,
  sortBy,
  onSort,
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative min-w-[180px] flex-1">
        <Search
          size={13}
          strokeWidth={2}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
        />

        <input
          className="w-full rounded-md border border-neutral-200 bg-neutral-50 py-2 pl-8 pr-3 font-body text-compact-lg text-neutral-900 transition-colors duration-fast ease-out placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none"
          placeholder="Cari bahan…"
          value={search}
          onChange={e => onSearch(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {KATEGORI_LIST.map(k => (
          <button
            key={k}
            className={`whitespace-nowrap rounded-full border px-3 py-1.5 font-body text-compact-base font-medium transition-all duration-fast ease-out ${
              kategori === k
                ? 'border-primary-900 bg-primary-900 text-white hover:border-primary-700'
                : 'border-neutral-200 bg-white text-neutral-600 hover:border-primary-500 hover:text-primary-600'
            }`}
            onClick={() => onKategori(k)}
          >
            {k}
          </button>
        ))}
      </div>

      <div className="relative flex items-center gap-2 whitespace-nowrap rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-neutral-600 max-sm:w-full">
        <Filter size={12} strokeWidth={2} />

        <select
          className="appearance-none bg-transparent pr-5 font-body text-compact-base text-neutral-600 outline-none max-sm:flex-1"
          value={sortBy}
          onChange={e => onSort(e.target.value)}
        >
          <option value="exp">Urutkan: Kadaluwarsa</option>
          <option value="nama">Urutkan: Nama</option>
        </select>

        <ChevronDown
          size={12}
          strokeWidth={2}
          className="pointer-events-none absolute right-3"
        />
      </div>
    </div>
  )
}