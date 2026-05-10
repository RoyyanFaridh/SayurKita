import { useState, useMemo, useRef, useEffect } from 'react'
import {
  X, Search, Refrigerator, Snowflake, ThermometerSun,
  Calendar, Clock, Flame, Beef, Droplets, Wheat, ChevronDown, Package,
} from 'lucide-react'
import { INGREDIENTS_MASTER, INGREDIENTS_MAP } from '../ingredientsMaster'

const KATEGORI_LABEL = {
  bumbu: 'Bumbu', rempah: 'Rempah', sayuran: 'Sayuran', buah: 'Buah',
  protein_hewani: 'Protein Hewani', protein_nabati: 'Protein Nabati',
  karbohidrat: 'Karbohidrat', olahan: 'Olahan',
}

const STORAGE_OPTIONS = [
  { value: 'kulkas',  label: 'Kulkas',     icon: Refrigerator,   field: 'umur_kulkas'  },
  { value: 'freezer', label: 'Freezer',    icon: Snowflake,      field: 'umur_freezer' },
  { value: 'ruang',   label: 'Suhu Ruang', icon: ThermometerSun, field: 'umur_ruang'   },
]

const BELI_OPTIONS = [
  { value: 0, label: 'Hari ini'    },
  { value: 1, label: 'Kemarin'     },
  { value: 2, label: '2 hari lalu' },
]

const ESTIMASI_META = {
  fresh:   { cls: 'bg-(--bg-success-subtle) border border-(--border-success) text-(--text-success)', dot: 'bg-success-400' },
  warning: { cls: 'bg-(--bg-warning-subtle) border border-(--border-warning) text-(--text-warning)', dot: 'bg-warning-400' },
  danger:  { cls: 'bg-(--bg-danger-subtle)  border border-(--border-danger)  text-(--text-danger)',  dot: 'bg-danger-400'  },
}

function addDays(days) {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().split('T')[0]
}

function calcExp(master, storage, beliDaysAgo) {
  if (!master) return ''
  const field = STORAGE_OPTIONS.find(s => s.value === storage)?.field ?? 'umur_kulkas'
  const umur  = master[field] ?? master.umur_kulkas ?? 7
  return addDays(umur - beliDaysAgo)
}

function formatExp(dateStr) {
  if (!dateStr) return null
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const exp   = new Date(dateStr); exp.setHours(0, 0, 0, 0)
  const diff  = Math.round((exp - today) / 86400000)
  if (diff <= 0)  return { label: 'Sudah kadaluwarsa', sublabel: 'Sebaiknya tidak dikonsumsi', color: 'danger'  }
  if (diff === 1) return { label: 'Besok kadaluwarsa', sublabel: 'Segera gunakan hari ini!',   color: 'danger'  }
  if (diff <= 3)  return { label: `${diff} hari lagi`, sublabel: 'Gunakan dalam waktu dekat',  color: 'warning' }
  return                 { label: `${diff} hari lagi`, sublabel: 'Masih aman disimpan',         color: 'fresh'   }
}

function IngredientCombobox({ value, onChange }) {
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

export default function KulkasModal({ item, onClose }) {
  const isEdit = !!item

  const [nama,        setNama]        = useState(item?.nama   || '')
  const [jumlah,      setJumlah]      = useState(item?.jumlah || '')
  const [storage,     setStorage]     = useState('kulkas')
  const [beliMode,    setBeliMode]    = useState('preset')
  const [beliDaysAgo, setBeliDaysAgo] = useState(0)
  const [beliCustom,  setBeliCustom]  = useState('')

  const master = INGREDIENTS_MAP[nama] ?? null

  const expDate = useMemo(() => {
    const daysAgo = beliMode === 'custom' && beliCustom
      ? Math.max(0, Math.round((Date.now() - new Date(beliCustom)) / 86400000))
      : beliDaysAgo
    return calcExp(master, storage, daysAgo)
  }, [master, storage, beliDaysAgo, beliMode, beliCustom])

  const expInfo     = formatExp(expDate)
  const storageUmur = master
    ? (master[STORAGE_OPTIONS.find(s => s.value === storage)?.field] ?? master.umur_kulkas)
    : null

  function handleNamaChange(n) {
    setNama(n)
    setStorage('kulkas')
    setBeliDaysAgo(0)
    setBeliMode('preset')
  }

  const hasNutrition = master &&
    (master.kkal > 0 || master.protein > 0 || master.lemak > 0 || master.karbo > 0)

  const inputCls = 'w-full px-3 py-2.5 bg-(--bg-alt) border border-(--border-default) rounded-xl text-compact-lg text-(--text-primary) box-border transition-colors duration-150 focus:outline-none focus:border-(--border-brand)'

  const beliChipBase = 'px-3.5 py-1.5 rounded-full border text-compact-base font-medium cursor-pointer whitespace-nowrap transition-all duration-150'
  const beliChipIdle = 'bg-(--bg-alt) border-(--border-default) text-(--text-secondary) hover:border-(--border-brand) hover:text-(--text-brand)'
  const beliChipActive = 'bg-primary-900 border-primary-900 text-white'

  return (
    <div
      className="fixed inset-0 bg-(--bg-overlay) z-(--z-modal) flex items-center justify-center p-4 animate-[fadeIn_150ms_ease-out]"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-[500px] max-h-[90vh] overflow-y-auto shadow-(--shadow-xl) flex flex-col animate-[slideUp_280ms_cubic-bezier(0.34,1.56,0.64,1)]"
        onClick={e => e.stopPropagation()}
      >

        {/* ── Header ── */}
        <div className="flex items-start justify-between px-5 py-5 border-b border-(--border-subtle) gap-3">
          <div>
            <h3 className="text-base font-semibold text-(--text-primary) leading-snug">
              {isEdit ? 'Edit Bahan' : 'Tambah ke Kulkas'}
            </h3>
            <p className="text-compact-sm text-(--text-muted) mt-0.5">
              {isEdit ? 'Perbarui info bahan yang tersimpan' : 'Pantau kesegaran bahan makananmu'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center shrink-0 border border-(--border-default) rounded-lg bg-transparent text-(--text-muted) cursor-pointer transition-all duration-150 hover:bg-(--bg-surface-3) hover:text-(--text-primary)"
          >
            <X size={16} />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="px-5 py-5 flex flex-col gap-5">

          {/* 1. Nama bahan */}
          <div className="flex flex-col gap-1.5">
            <label className="text-compact-base font-medium text-(--text-secondary)">
              Nama bahan
            </label>
            <IngredientCombobox value={nama} onChange={handleNamaChange} />
          </div>

          {/* 2. Estimasi banner */}
          {master && expInfo && (
            <div className={`rounded-xl px-4 py-3 flex items-start gap-3 ${ESTIMASI_META[expInfo.color].cls}`}>
              <div className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${ESTIMASI_META[expInfo.color].dot}`} />
              <div className="flex flex-col gap-0.5">
                <p className="text-compact-base font-semibold leading-snug">
                  Kadaluwarsa <span className="font-bold">{expInfo.label}</span>
                </p>
                <p className="text-compact-sm opacity-80">{expInfo.sublabel}</p>
                <p className="text-compact-xs opacity-60 mt-0.5">
                  <span className="capitalize font-medium">{nama}</span>{' '}
                  tahan {storageUmur} hari di {STORAGE_OPTIONS.find(s => s.value === storage)?.label.toLowerCase()}
                </p>
              </div>
            </div>
          )}

          {/* 3. Simpan di */}
          <div className="flex flex-col gap-2">
            <label className="text-compact-base font-medium text-(--text-secondary)">
              Simpan di
            </label>
            <div className="grid grid-cols-3 gap-2">
              {STORAGE_OPTIONS.map(({ value, label, icon: Icon, field }) => {
                const umur    = master?.[field]
                const unavail = master && !umur
                const active  = storage === value
                return (
                  <button
                    key={value}
                    type="button"
                    disabled={unavail}
                    onClick={() => !unavail && setStorage(value)}
                    className={`flex flex-col items-center gap-1.5 py-3.5 px-2 border rounded-xl cursor-pointer transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed ${
                      active
                        ? 'bg-(--bg-subtle) border-primary-900 shadow-[0_0_0_2px_var(--color-primary-100)]'
                        : 'bg-(--bg-alt) border-(--border-default) hover:border-(--border-brand) hover:bg-(--bg-subtle)'
                    }`}
                  >
                    <Icon size={18} strokeWidth={1.5} className={active ? 'text-primary-900' : 'text-(--text-brand)'} />
                    <span className="text-compact-base font-semibold text-(--text-primary)">{label}</span>
                    {master && umur ? (
                      <span className={`text-compact-xs px-2 py-px rounded-full ${active ? 'bg-primary-100 text-primary-700' : 'bg-(--bg-surface-3) text-(--text-muted)'}`}>
                        {umur} hari
                      </span>
                    ) : unavail ? (
                      <span className="text-compact-xs text-(--text-disabled)">—</span>
                    ) : null}
                  </button>
                )
              })}
            </div>
          </div>

          {/* 4. Kapan beli */}
          <div className="flex flex-col gap-2">
            <label className="text-compact-base font-medium text-(--text-secondary)">
              Kapan kamu beli?
            </label>
            <div className="flex items-center gap-1.5 flex-wrap">
              {BELI_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => { setBeliMode('preset'); setBeliDaysAgo(opt.value) }}
                  className={`${beliChipBase} ${beliMode === 'preset' && beliDaysAgo === opt.value ? beliChipActive : beliChipIdle}`}
                >
                  {opt.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setBeliMode('custom')}
                className={`${beliChipBase} border-dashed inline-flex items-center gap-1.5 ${beliMode === 'custom' ? beliChipActive : beliChipIdle}`}
              >
                <Calendar size={12} strokeWidth={2} />
                Pilih tanggal
              </button>
            </div>
            {beliMode === 'custom' && (
              <input
                type="date"
                className={inputCls}
                value={beliCustom}
                max={new Date().toISOString().split('T')[0]}
                onChange={e => setBeliCustom(e.target.value)}
              />
            )}
          </div>

          {/* 5. Jumlah */}
          <div className="flex flex-col gap-1.5">
            <label className="text-compact-base font-medium text-(--text-secondary) flex items-center gap-1.5">
              Jumlah
              <span className="text-compact-sm font-normal text-(--text-muted)">(opsional)</span>
            </label>
            <div className="flex items-center gap-2 bg-(--bg-alt) border border-(--border-default) rounded-xl px-3 focus-within:border-(--border-brand) transition-colors duration-150">
              <Package size={13} strokeWidth={2} className="text-(--text-muted) shrink-0" />
              <input
                className="flex-1 border-0 bg-transparent py-2.5 text-compact-lg text-(--text-primary) min-w-0 placeholder:text-(--text-muted) focus:outline-none"
                value={jumlah}
                onChange={e => setJumlah(e.target.value)}
                placeholder="cth. 200 g, 2 buah, 1 ikat"
              />
            </div>
          </div>

          {/* 6. Info gizi */}
          {hasNutrition && (
            <div className="border border-(--border-subtle) rounded-xl overflow-hidden">
              <div className="px-4 py-2.5 bg-(--bg-alt) border-b border-(--border-subtle)">
                <p className="text-compact-xs font-semibold text-(--text-muted) uppercase tracking-wide">
                  Info Gizi per 100 g
                </p>
              </div>
              <div className="grid grid-cols-4 divide-x divide-(--border-subtle) max-[480px]:grid-cols-2 max-[480px]:divide-x-0">
                {[
                  { icon: Flame,    label: 'Kalori',  value: master.kkal,    unit: 'kkal' },
                  { icon: Beef,     label: 'Protein', value: master.protein, unit: 'g'    },
                  { icon: Droplets, label: 'Lemak',   value: master.lemak,   unit: 'g'    },
                  { icon: Wheat,    label: 'Karbo',   value: master.karbo,   unit: 'g'    },
                ].map(({ icon: Icon, label, value, unit }, idx) => (
                  <div
                    key={label}
                    className={`flex flex-col items-center gap-1 py-3 px-2 text-center max-[480px]:border-b max-[480px]:border-(--border-subtle) ${idx >= 2 ? 'max-[480px]:border-b-0' : ''}`}
                  >
                    <Icon size={13} strokeWidth={1.75} className="text-(--text-brand)" />
                    <p className="text-compact-lg font-bold text-(--text-primary) leading-none">
                      {value > 0 ? value : '—'}
                      {value > 0 && <span className="text-compact-xs font-normal text-(--text-muted)"> {unit}</span>}
                    </p>
                    <p className="text-compact-xs text-(--text-muted)">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* ── Footer ── */}
        <div className="flex items-center gap-2 px-5 py-4 border-t border-(--border-subtle)">
          {isEdit && (
            <button
              onClick={onClose}
              className="inline-flex items-center px-4 py-2 bg-transparent border border-(--border-danger) rounded-xl text-compact-lg font-medium text-(--text-danger) cursor-pointer transition-all duration-150 hover:bg-(--bg-danger-subtle)"
            >
              Hapus
            </button>
          )}
          <div className="flex gap-2 ml-auto">
            <button
              onClick={onClose}
              className="inline-flex items-center px-4 py-2 bg-transparent border border-(--border-default) rounded-xl text-compact-lg font-medium text-(--text-secondary) cursor-pointer transition-colors duration-150 hover:bg-(--bg-surface-3)"
            >
              Batal
            </button>
            <button
              onClick={onClose}
              disabled={!nama}
              className="inline-flex items-center gap-2 px-5 py-2 bg-secondary-500 text-primary-900 border-0 rounded-xl text-compact-lg font-semibold cursor-pointer transition-colors duration-150 hover:bg-secondary-400 disabled:opacity-45 disabled:cursor-not-allowed"
            >
              Simpan Bahan
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}