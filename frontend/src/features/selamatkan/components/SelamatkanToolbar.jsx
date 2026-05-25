import { useState, useRef, useEffect } from 'react'
import { Search, ArrowUpDown, MapPin, Check, ChevronDown } from 'lucide-react'

const RADIUS_OPTIONS = [
  { value: '1',  label: '1 km'  },
  { value: '3',  label: '3 km'  },
  { value: '5',  label: '5 km'  },
  { value: '10', label: '10 km' },
]

const SORT_OPTIONS = [
  { value: 'waktu',   label: 'Terbaru'         },
  { value: 'jarak',   label: 'Terdekat'        },
  { value: 'kondisi', label: 'Paling mendesak' },
]

function DropdownSelect({ icon: Icon, options, value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selected = options.find(o => o.value === value)

  return (
    <div className="relative shrink-0" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-1.5 rounded-md border px-3 py-2 text-compact-base font-medium transition-colors duration-150 cursor-pointer ${
          open
            ? 'bg-(--bg-subtle) border-(--border-brand) text-(--text-brand)'
            : 'bg-(--bg-alt) border-(--border-default) text-(--text-secondary) hover:border-(--border-brand) hover:text-(--text-brand)'
        }`}
      >
        <Icon size={13} strokeWidth={2} />
        <span>{selected?.label}</span>
        <ChevronDown
          size={12}
          strokeWidth={2}
          className={`transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div
          className="absolute right-0 top-[calc(100%+6px)] z-50 w-44 overflow-hidden rounded-md border border-(--border-default)"
          style={{
            background: 'var(--bg-surface-1)',
            boxShadow:  'var(--shadow-md)',
          }}
        >
          {options.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false) }}
              className={`flex w-full items-center justify-between px-3 py-2.5 text-compact-base transition-colors duration-150 cursor-pointer ${
                value === opt.value
                  ? 'bg-(--bg-subtle) text-(--text-brand) font-medium'
                  : 'text-(--text-secondary) font-normal hover:bg-(--bg-alt)'
              }`}
            >
              {opt.label}
              {value === opt.value && <Check size={13} strokeWidth={2.5} />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function SelamatkanToolbar({ search, onSearch, radius, onRadius, sortBy, onSort }) {
  return (
    <div className="flex items-center gap-3">

      {/* Search — identik dengan KulkasToolbar */}
      <div className="relative flex-1 min-w-44">
        <Search
          size={13}
          strokeWidth={2}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--text-muted)"
        />
        <input
          className="w-full rounded-md border border-(--border-default) bg-(--bg-alt) py-2 pl-8 pr-3 text-compact-lg text-(--text-primary) transition-colors duration-150 placeholder:text-(--text-muted) focus:outline-none focus:border-(--border-brand)"
          placeholder="Cari surplus makanan…"
          value={search}
          onChange={e => onSearch(e.target.value)}
        />
      </div>

      {/* Radius */}
      <DropdownSelect
        icon={MapPin}
        options={RADIUS_OPTIONS}
        value={radius}
        onChange={onRadius}
      />

      {/* Sort */}
      <DropdownSelect
        icon={ArrowUpDown}
        options={SORT_OPTIONS}
        value={sortBy}
        onChange={onSort}
      />

    </div>
  )
}