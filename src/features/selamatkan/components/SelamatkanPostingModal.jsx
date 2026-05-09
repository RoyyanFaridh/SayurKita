import { useState } from 'react'
import { X, Upload, MapPin } from 'lucide-react'

const KONDISI_OPTIONS = [
  { value: 'segar',     label: 'Segar',       hint: 'Masih layak dikonsumsi',   active: 'bg-[var(--bg-success-subtle)] border-[var(--border-success)]', activeText: 'text-[var(--text-success)]' },
  { value: 'mau-habis', label: 'Segera ambil', hint: 'Perlu diambil hari ini',   active: 'bg-[var(--bg-warning-subtle)] border-[var(--border-warning)]', activeText: 'text-[var(--text-warning)]' },
  { value: 'segera',    label: 'Hari ini!',    hint: 'Harus segera sebelum basi', active: 'bg-[var(--bg-danger-subtle)] border-[var(--border-danger)]',   activeText: 'text-[var(--text-danger)]'  },
]

const KATEGORI_OPTIONS = ['Makanan Matang', 'Sayuran', 'Lauk', 'Buah', 'Lainnya']

const inputCls = `w-full px-3 py-2.5 bg-[var(--bg-alt)]
  border border-[var(--border-default)] rounded-xl
  text-[0.8125rem] text-[var(--text-primary)] font-[var(--font-body)]
  box-border transition-colors duration-150
  focus:outline-none focus:border-[var(--border-brand)]`

export default function SelamatkanPostingModal({ onClose }) {
  const [kondisi, setKondisi] = useState('segar')

  return (
    <div
      className="fixed inset-0 bg-[var(--bg-overlay)] z-[var(--z-modal)]
                 flex items-center justify-center p-4
                 animate-[fadeIn_150ms_ease-out]"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-[520px] max-h-[90vh]
                   overflow-y-auto shadow-[var(--shadow-xl)]
                   animate-[slideUp_280ms_cubic-bezier(0.34,1.56,0.64,1)]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-5 py-5
                        border-b border-[var(--border-subtle)] gap-3">
          <div>
            <h3 className="text-base font-semibold text-[var(--text-primary)] leading-snug">
              Posting Surplus
            </h3>
            <p className="text-[0.6875rem] text-[var(--text-muted)] mt-0.5">
              Bantu makananmu ditemukan orang yang butuh
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center shrink-0
                       border border-[var(--border-default)] rounded-lg
                       bg-transparent text-[var(--text-muted)] cursor-pointer
                       transition-all duration-150
                       hover:bg-[var(--bg-surface-3)] hover:text-[var(--text-primary)]"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-5 flex flex-col gap-4">
          {/* Upload */}
          <div className="flex flex-col items-center gap-1.5 py-5 px-4
                          border-2 border-dashed border-[var(--border-default)]
                          rounded-xl bg-[var(--bg-alt)] cursor-pointer
                          transition-all duration-150
                          hover:border-[var(--border-brand)] hover:bg-[var(--bg-subtle)]">
            <Upload size={20} strokeWidth={1.5} className="text-[var(--text-muted)]" />
            <p className="text-[0.8125rem] font-medium text-[var(--text-secondary)]">
              Upload foto makanan
            </p>
            <p className="text-[0.6875rem] text-[var(--text-muted)]">JPG, PNG · Maks 5 MB</p>
          </div>

          {/* Nama */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[0.75rem] font-medium text-[var(--text-secondary)]">
              Nama makanan / bahan
            </label>
            <input className={inputCls} placeholder="cth. Nasi kotak sisa acara" />
          </div>

          {/* Deskripsi */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[0.75rem] font-medium text-[var(--text-secondary)]">
              Deskripsi
            </label>
            <textarea
              className={`${inputCls} resize-y min-h-[80px] leading-relaxed`}
              placeholder="Ceritakan kondisi, lauk, atau info penting lainnya…"
              rows={3}
            />
          </div>

          {/* Kategori + Jumlah */}
          <div className="grid grid-cols-2 gap-3 max-[480px]:grid-cols-1">
            <div className="flex flex-col gap-1.5">
              <label className="text-[0.75rem] font-medium text-[var(--text-secondary)]">
                Kategori
              </label>
              <select className={inputCls}>
                {KATEGORI_OPTIONS.map(k => <option key={k}>{k}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[0.75rem] font-medium text-[var(--text-secondary)]">
                Jumlah
              </label>
              <input className={inputCls} placeholder="cth. 5 porsi" />
            </div>
          </div>

          {/* Kondisi pills */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[0.75rem] font-medium text-[var(--text-secondary)]">
              Kondisi
            </label>
            <div className="grid grid-cols-3 gap-2 max-[480px]:grid-cols-1">
              {KONDISI_OPTIONS.map(({ value, label, hint, active, activeText }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setKondisi(value)}
                  className={`flex flex-col items-center gap-1 px-2 py-2.5
                               border rounded-xl font-[var(--font-body)]
                               cursor-pointer transition-all duration-150
                               ${kondisi === value
                                 ? `${active} ${activeText}`
                                 : 'bg-[var(--bg-alt)] border-[var(--border-default)] hover:bg-[var(--bg-surface-3)] hover:border-[var(--border-strong)]'
                               }`}
                >
                  <span className={`text-[0.75rem] font-semibold ${kondisi === value ? activeText : 'text-[var(--text-primary)]'}`}>
                    {label}
                  </span>
                  <span className="text-[0.625rem] text-[var(--text-muted)] text-center">
                    {hint}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Lokasi */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[0.75rem] font-medium text-[var(--text-secondary)]">
              Lokasi pengambilan
            </label>
            <div className="flex items-center gap-2 bg-[var(--bg-alt)]
                            border border-[var(--border-default)] rounded-xl px-3
                            focus-within:border-[var(--border-brand)] transition-colors duration-150">
              <MapPin size={13} strokeWidth={2} className="text-[var(--text-muted)] shrink-0" />
              <input
                className="flex-1 border-0 bg-transparent py-2.5 text-[0.8125rem]
                           text-[var(--text-primary)] font-[var(--font-body)] min-w-0
                           placeholder:text-[var(--text-muted)] focus:outline-none"
                placeholder="Alamat atau titik lokasi"
              />
              <button className="shrink-0 px-2.5 py-1 bg-[var(--bg-subtle)]
                                  border border-[var(--border-subtle)] rounded-lg
                                  text-[0.6875rem] font-medium font-[var(--font-body)]
                                  text-[var(--text-brand)] cursor-pointer whitespace-nowrap
                                  transition-colors duration-150 hover:bg-primary-100">
                Gunakan lokasimu
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-5 py-4
                        border-t border-[var(--border-subtle)]">
          <button
            onClick={onClose}
            className="inline-flex items-center px-4 py-2 bg-transparent
                       border border-[var(--border-default)] rounded-xl
                       text-[0.8125rem] font-medium font-[var(--font-body)]
                       text-[var(--text-secondary)] cursor-pointer
                       transition-colors duration-150 hover:bg-[var(--bg-surface-3)]"
          >
            Batal
          </button>
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 px-5 py-2
                       bg-secondary-500 text-primary-900
                       border-0 rounded-xl
                       text-[0.8125rem] font-semibold font-[var(--font-body)]
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