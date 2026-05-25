import { useState, useRef, useEffect } from 'react'
import { Search, ArrowUpDown, Check, ChevronDown } from 'lucide-react'

const SORT_OPTIONS = [
  { value: 'exp',  label: 'Kadaluwarsa' },
  { value: 'nama', label: 'Nama'        },
]

export default function KulkasToolbar({ search, onSearch, sortBy, onSort }) {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selected = SORT_OPTIONS.find(o => o.value === sortBy)

  return (
    <div className="flex items-center gap-3">

      {/* Search */}
      <div className="relative flex-1">
        <Search
          size={13}
          strokeWidth={2}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--text-muted)"
        />
        <input
          className="w-full rounded-md border border-(--border-default) bg-(--bg-alt) py-2 pl-8 pr-3 text-compact-lg text-(--text-primary) transition-colors duration-150 placeholder:text-(--text-muted) focus:outline-none focus:border-(--border-brand)"
          placeholder="Cari bahan…"
          value={search}
          onChange={e => onSearch(e.target.value)}
        />
      </div>

      {/* Sort */}
      <div className="relative shrink-0" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          className={`flex items-center gap-1.5 rounded-md border px-3 py-2 text-compact-base font-medium transition-colors duration-150 cursor-pointer ${
            open
              ? 'bg-(--bg-subtle) border-(--border-brand) text-(--text-brand)'
              : 'bg-(--bg-alt) border-(--border-default) text-(--text-secondary) hover:border-(--border-brand) hover:text-(--text-brand)'
          }`}
        >
          <ArrowUpDown size={13} strokeWidth={2} />
          {/* Fix 2: selalu tampilkan label, bukan hidden di mobile */}
          <span className="text-compact-base">{selected?.label}</span>
          <ChevronDown
            size={12}
            strokeWidth={2}
            className={`transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
          />
        </button>

        {open && (
          <div
            className="absolute right-0 top-[calc(100%+6px)] z-50 w-40 overflow-hidden rounded-md border border-(--border-default)"
            style={{
              background: 'var(--bg-surface-1)',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            {SORT_OPTIONS.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => { onSort(opt.value); setOpen(false) }}
                className={`flex w-full items-center justify-between px-3 py-2.5 text-compact-base transition-colors duration-150 cursor-pointer ${
                  sortBy === opt.value
                    ? 'bg-(--bg-subtle) text-(--text-brand) font-medium'
                    : 'text-(--text-secondary) font-normal hover:bg-(--bg-alt)'
                }`}
              >
                {opt.label}
                {sortBy === opt.value && <Check size={13} strokeWidth={2.5} />}
              </button>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}