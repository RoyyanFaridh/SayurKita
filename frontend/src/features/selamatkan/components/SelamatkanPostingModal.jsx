import { useState } from 'react'
import { X, Upload, MapPin } from 'lucide-react'

const KONDISI_OPTIONS = [
  { value: 'segar',     label: 'Segar',       hint: 'Masih layak dikonsumsi',   active: 'bg-(--bg-success-subtle) border-(--border-success)', activeText: 'text-(--text-success)' },
  { value: 'mau-habis', label: 'Segera ambil', hint: 'Perlu diambil hari ini',   active: 'bg-(--bg-warning-subtle) border-(--border-warning)', activeText: 'text-(--text-warning)' },
  { value: 'segera',    label: 'Hari ini!',    hint: 'Harus segera sebelum basi', active: 'bg-(--bg-danger-subtle) border-(--border-danger)',   activeText: 'text-(--text-danger)'  },
]

const KATEGORI_OPTIONS = ['Makanan Matang', 'Sayuran', 'Lauk', 'Buah', 'Lainnya']

const inputCls = `w-full px-3 py-2.5 bg-(--bg-alt)
  border border-(--border-default) rounded-xl
  text-compact-lg text-(--text-primary)
  box-border transition-colors duration-150
  focus:outline-none focus:border-(--border-brand)`

export default function SelamatkanPostingModal({ onClose }) {
  const [kondisi, setKondisi] = useState('segar')

  return (
    <div
      className="fixed inset-0 bg-(--bg-overlay) z-(--z-modal)
                 flex items-center justify-center p-4
                 animate-[fadeIn_150ms_ease-out]"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-130 max-h-[90vh]
                   overflow-y-auto shadow-(--shadow-xl)
                   animate-[slideUp_280ms_cubic-bezier(0.34,1.56,0.64,1)]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-5 py-5
                        border-b border-(--border-subtle) gap-3">
          <div>
            <h3 className="text-base font-semibold text-(--text-primary) leading-snug">
              Posting Surplus
            </h3>
            <p className="text-compact-sm text-(--text-muted) mt-0.5">
              Bantu makananmu ditemukan orang yang butuh
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center shrink-0
                       border border-(--border-default) rounded-lg
                       bg-transparent text-(--text-muted) cursor-pointer
                       transition-all duration-150
                       hover:bg-(--bg-surface-3) hover:text-(--text-primary)"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-5 flex flex-col gap-4">
          {/* Upload */}
          <div className="flex flex-col items-center gap-1.5 py-5 px-4
                          border-2 border-dashed border-(--border-default)
                          rounded-xl bg-(--bg-alt) cursor-pointer
                          transition-all duration-150
                          hover:border-(--border-brand) hover:bg-(--bg-subtle)">
            <Upload size={20} strokeWidth={1.5} className="text-(--text-muted)" />
            <p className="text-compact-lg font-medium text-(--text-secondary)">
              Upload foto makanan
            </p>
            <p className="text-compact-sm text-(--text-muted)">JPG, PNG · Maks 5 MB</p>
          </div>

          {/* Nama */}
          <div className="flex flex-col gap-1.5">
            <label className="text-compact-base font-medium text-(--text-secondary)">
              Nama makanan / bahan
            </label>
            <input className={inputCls} placeholder="cth. Nasi kotak sisa acara" />
          </div>

          {/* Deskripsi */}
          <div className="flex flex-col gap-1.5">
            <label className="text-compact-base font-medium text-(--text-secondary)">
              Deskripsi
            </label>
            <textarea
              className={`${inputCls} resize-y min-h-20 leading-relaxed`}
              placeholder="Ceritakan kondisi, lauk, atau info penting lainnya…"
              rows={3}
            />
          </div>

          {/* Kategori + Jumlah */}
          <div className="grid grid-cols-2 gap-3 max-[480px]:grid-cols-1">
            <div className="flex flex-col gap-1.5">
              <label className="text-compact-base font-medium text-(--text-secondary)">
                Kategori
              </label>
              <select className={inputCls}>
                {KATEGORI_OPTIONS.map(k => <option key={k}>{k}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-compact-base font-medium text-(--text-secondary)">
                Jumlah
              </label>
              <input className={inputCls} placeholder="cth. 5 porsi" />
            </div>
          </div>

          {/* Kondisi pills */}
          <div className="flex flex-col gap-1.5">
            <label className="text-compact-base font-medium text-(--text-secondary)">
              Kondisi
            </label>
            <div className="grid grid-cols-3 gap-2 max-[480px]:grid-cols-1">
              {KONDISI_OPTIONS.map(({ value, label, hint, active, activeText }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setKondisi(value)}
                  className={`flex flex-col items-center gap-1 px-2 py-2.5
                               border rounded-xl
                               cursor-pointer transition-all duration-150
                               ${kondisi === value
                                 ? `${active} ${activeText}`
                                 : 'bg-(--bg-alt) border-(--border-default) hover:bg-(--bg-surface-3) hover:border-(--border-strong)'
                               }`}
                >
                  <span className={`text-compact-base font-semibold ${kondisi === value ? activeText : 'text-(--text-primary)'}`}>
                    {label}
                  </span>
                  <span className="text-compact-xs text-(--text-muted) text-center">
                    {hint}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Lokasi */}
          <div className="flex flex-col gap-1.5">
            <label className="text-compact-base font-medium text-(--text-secondary)">
              Lokasi pengambilan
            </label>
            <div className="flex items-center gap-2 bg-(--bg-alt)
                            border border-(--border-default) rounded-xl px-3
                            focus-within:border-(--border-brand) transition-colors duration-150">
              <MapPin size={13} strokeWidth={2} className="text-(--text-muted) shrink-0" />
              <input
                className="flex-1 border-0 bg-transparent py-2.5 text-compact-lg
                           text-(--text-primary) min-w-0
                           placeholder:text-(--text-muted) focus:outline-none"
                placeholder="Alamat atau titik lokasi"
              />
              <button className="shrink-0 px-2.5 py-1 bg-(--bg-subtle)
                                  border border-(--border-subtle) rounded-lg
                                  text-compact-sm font-medium
                                  text-(--text-brand) cursor-pointer whitespace-nowrap
                                  transition-colors duration-150 hover:bg-primary-100">
                Gunakan lokasimu
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-5 py-4
                        border-t border-(--border-subtle)">
          <button
            onClick={onClose}
            className="inline-flex items-center px-4 py-2 bg-transparent
                       border border-(--border-default) rounded-xl
                       text-compact-lg font-medium
                       text-(--text-secondary) cursor-pointer
                       transition-colors duration-150 hover:bg-(--bg-surface-3)"
          >
            Batal
          </button>
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 px-5 py-2
                       bg-secondary-500 text-primary-900
                       border-0 rounded-xl
                       text-compact-lg font-semibold
                       cursor-pointer transition-colors duration-150
                       hover:bg-secondary-400"
          >
            Posting Sekarang
          </button>
        </div>
      </div>
    </div>
  )
}