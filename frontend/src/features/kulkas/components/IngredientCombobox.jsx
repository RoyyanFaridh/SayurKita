import { useState, useMemo, useRef, useEffect } from 'react'
import { Search, ChevronDown } from 'lucide-react'
import { fetchIngredientsMaster } from '../ingredientsMaster'

const KATEGORI_LABEL = {
  bumbu: 'Bumbu', rempah: 'Rempah', sayuran: 'Sayuran', buah: 'Buah',
  protein_hewani: 'Protein Hewani', protein_nabati: 'Protein Nabati',
  karbohidrat: 'Karbohidrat', olahan: 'Olahan',
}

export default function IngredientCombobox({ value, onChange }) {
  const [query,  setQuery]  = useState(value || '')
  const [open,   setOpen]   = useState(false)
  const [master, setMaster] = useState([])
  const wrapRef = useRef(null)

  useEffect(() => {
    fetchIngredientsMaster().then(map => {
      setMaster(Object.values(map))
    })
  }, [])

  useEffect(() => { setQuery(value || '') }, [value])

  useEffect(() => {
    const fn = e => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return master.slice(0, 40)
    return master.filter(i => i.nama.includes(q)).slice(0, 40)
  }, [query, master])

  function select(item) {
    setQuery(item.nama)
    setOpen(false)
    onChange(item.nama)
  }

  function handleBlur() {
    setTimeout(() => {
      if (wrapRef.current && !wrapRef.current.contains(document.activeElement)) {
        onChange(query.trim())
        setOpen(false)
      }
    }, 150)
  }

  return (
    <div className="relative" ref={wrapRef}>
      <div className={`flex items-center gap-2.5 bg-(--bg-alt) border rounded-md px-3 transition-colors duration-150 ${open ? 'border-(--border-brand)' : 'border-(--border-default)'}`}>
        <Search size={14} strokeWidth={2} className="text-(--text-muted) shrink-0" />
        <input
          className="flex-1 border-0 bg-transparent py-2.5 text-compact-lg text-(--text-primary) min-w-0 focus:outline-none placeholder:text-(--text-muted)"
          placeholder="Ketik nama bahan…"
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          onBlur={handleBlur}
        />
        <ChevronDown
          size={13}
          strokeWidth={2}
          className={`shrink-0 transition-transform duration-150 text-(--text-muted) ${open ? 'rotate-180' : ''}`}
        />
      </div>

      {open && (
        <ul className="absolute top-[calc(100%+6px)] left-0 right-0 bg-white border border-(--border-default) rounded-md shadow-lg z-50 max-h-52 overflow-y-auto list-none p-0 py-1.5 m-0">
          {filtered.length > 0 ? (
            filtered.map(item => (
              <li
                key={item.nama}
                onMouseDown={() => select(item)}
                className="flex items-center justify-between px-3.5 py-2 gap-3 cursor-pointer transition-colors duration-75 hover:bg-(--bg-subtle)"
              >
                <span className="text-compact-lg text-(--text-primary) capitalize">{item.nama}</span>
                {/* Fix 6: bg-(--bg-subtle) konsisten dengan badge lain */}
                <span className="text-compact-xs text-(--text-muted) whitespace-nowrap shrink-0 bg-(--bg-subtle) px-2 py-px rounded-full">
                  {KATEGORI_LABEL[item.kategori] ?? item.kategori}
                </span>
              </li>
            ))
          ) : (
            <li className="px-3.5 py-3 text-compact-base text-(--text-muted) text-center">
              Bahan tidak ditemukan
            </li>
          )}
        </ul>
      )}
    </div>
  )
}