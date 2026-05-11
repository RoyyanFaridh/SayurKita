import { useState, useMemo, useRef, useEffect } from 'react'
import { Search, ChevronDown } from 'lucide-react'
import { INGREDIENTS_MASTER } from '../ingredientsMaster'

const KATEGORI_LABEL = {
  bumbu: 'Bumbu', rempah: 'Rempah', sayuran: 'Sayuran', buah: 'Buah',
  protein_hewani: 'Protein Hewani', protein_nabati: 'Protein Nabati',
  karbohidrat: 'Karbohidrat', olahan: 'Olahan',
}

export default function IngredientCombobox({ value, onChange }) {
  const [query, setQuery] = useState(value || '')
  const [open,  setOpen]  = useState(false)
  const wrapRef = useRef(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return INGREDIENTS_MASTER.slice(0, 40)
    return INGREDIENTS_MASTER.filter(i => i.nama.includes(q)).slice(0, 40)
  }, [query])

  useEffect(() => { setQuery(value || '') }, [value])

  useEffect(() => {
    const fn = e => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  function select(item) {
    setQuery(item.nama)
    setOpen(false)
    onChange(item.nama)
  }

  return (
    <div className="relative" ref={wrapRef}>
      <div className={`flex items-center gap-2.5 bg-(--bg-alt) border rounded-xl px-3 transition-colors duration-150 ${open ? 'border-(--border-brand)' : 'border-(--border-default)'}`}>
        <Search size={14} strokeWidth={2} className="text-(--text-muted) shrink-0" />
        <input
          className="flex-1 border-0 bg-transparent py-2.5 text-compact-lg text-(--text-primary) min-w-0 focus:outline-none placeholder:text-(--text-muted)"
          placeholder="Ketik nama bahan…"
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
        />
        <ChevronDown size={13} strokeWidth={2} className={`shrink-0 transition-transform duration-150 text-(--text-muted) ${open ? 'rotate-180' : ''}`} />
      </div>

      {open && filtered.length > 0 && (
        <ul className="absolute top-[calc(100%+6px)] left-0 right-0 bg-white border border-(--border-default) rounded-xl shadow-(--shadow-lg) z-(--z-dropdown) max-h-52 overflow-y-auto list-none py-1.5">
          {filtered.map(item => (
            <li
              key={item.nama}
              onMouseDown={() => select(item)}
              className="flex items-center justify-between px-3.5 py-2 gap-3 cursor-pointer transition-colors duration-75 hover:bg-(--bg-subtle)"
            >
              <span className="text-compact-lg text-(--text-primary) capitalize">{item.nama}</span>
              <span className="text-compact-xs text-(--text-muted) whitespace-nowrap shrink-0 bg-(--bg-surface-3) px-2 py-px rounded-full">
                {KATEGORI_LABEL[item.kategori] ?? item.kategori}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}