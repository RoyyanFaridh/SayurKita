import { useState, useMemo } from 'react'
import {
  Refrigerator, Snowflake, ThermometerSun,
  Calendar, Flame, Beef, Droplets, Wheat, Package,
} from 'lucide-react'
import { INGREDIENTS_MAP } from '../ingredientsMaster'
import IngredientCombobox from './IngredientCombobox'

const STORAGE_OPTIONS = [
  { value: 'kulkas',  label: 'Kulkas',     icon: Refrigerator,   field: 'umur_kulkas'  },
  { value: 'freezer', label: 'Freezer',    icon: Snowflake,      field: 'umur_freezer' },
  { value: 'ruang',   label: 'Suhu Ruang', icon: ThermometerSun, field: 'umur_ruang'   },
]

const BELI_OPTIONS = [
  { value: 0, label: 'Hari ini'    },
  { value: 1, label: 'Kemarin'     },
  { value: 7, label: 'Satu minggu lalu' },
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

const inputCls = 'w-full px-3 py-2.5 bg-(--bg-alt) border border-(--border-default) rounded-xl text-compact-lg text-(--text-primary) box-border transition-colors duration-150 focus:outline-none focus:border-(--border-brand)'
const beliChipBase = 'px-3.5 py-1.5 rounded-full border text-compact-base font-medium cursor-pointer whitespace-nowrap transition-all duration-150'
const beliChipIdle = 'bg-(--bg-alt) border-(--border-default) text-(--text-secondary) hover:border-(--border-brand) hover:text-(--text-brand)'
const beliChipActive = 'bg-primary-900 border-primary-900 text-white'

export default function KulkasForm({ item }) {
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

  const hasNutrition = master &&
    (master.kkal > 0 || master.protein > 0 || master.lemak > 0 || master.karbo > 0)

  function handleNamaChange(n) {
    setNama(n)
    setStorage('kulkas')
    setBeliDaysAgo(0)
    setBeliMode('preset')
  }

  return (
    <div className="px-5 py-5 flex flex-col gap-5">

      <div className="flex flex-col gap-1.5">
        <label className="text-compact-base font-medium text-(--text-secondary)">Nama bahan</label>
        <IngredientCombobox value={nama} onChange={handleNamaChange} />
      </div>

      {master && expInfo && (
        <div className={`rounded-xl px-4 py-3 flex items-start gap-3 ${ESTIMASI_META[expInfo.color].cls}`}>
          <div className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${ESTIMASI_META[expInfo.color].dot}`} />
          <div className="flex flex-col gap-0.5">
            <p className="text-compact-base font-semibold">
              <span className="font-bold">{expInfo.label}</span>
            </p>
            <p className="text-compact-sm opacity-80">{expInfo.sublabel}</p>
            <p className="text-compact-xs opacity-60 mt-0.5">
              <span className="capitalize font-medium">{nama}</span>{' '}
              tahan {storageUmur} hari di {STORAGE_OPTIONS.find(s => s.value === storage)?.label.toLowerCase()}
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label className="text-compact-base font-medium text-(--text-secondary)">Simpan di</label>
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

      <div className="flex flex-col gap-2">
        <label className="text-compact-base font-medium text-(--text-secondary)">Kapan kamu beli?</label>
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
  )
}