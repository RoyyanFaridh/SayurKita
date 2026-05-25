import { useState } from 'react'
import { X, Upload, MapPin, Package } from 'lucide-react'

const KONDISI_OPTIONS = [
  { value: 'segar',     label: 'Segar',        hint: 'Masih layak dikonsumsi',    active: 'bg-(--bg-success-subtle) border-(--border-success)', activeText: 'text-(--text-success)' },
  { value: 'mau-habis', label: 'Segera ambil',  hint: 'Perlu diambil hari ini',    active: 'bg-(--bg-warning-subtle) border-(--border-warning)', activeText: 'text-(--text-warning)' },
  { value: 'segera',    label: 'Hari ini!',     hint: 'Harus segera sebelum basi', active: 'bg-(--bg-danger-subtle)  border-(--border-danger)',   activeText: 'text-(--text-danger)'  },
]

const KATEGORI_OPTIONS = ['Makanan Matang', 'Sayuran', 'Lauk', 'Buah', 'Lainnya']

// rounded-md — selaras dengan KulkasForm
const inputCls = `w-full px-3 py-2.5 bg-(--bg-alt)
  border border-(--border-default) rounded-md
  text-compact-lg text-(--text-primary)
  box-border transition-colors duration-150
  focus:outline-none focus:border-(--border-brand)`

export default function SelamatkanPostingModal({ onClose }) {
  const [kondisi, setKondisi] = useState('segar')

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-(--bg-overlay) animate-[fadeIn_150ms_ease-out]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[520px] max-h-[90vh] overflow-y-auto rounded-2xl animate-[slideUp_280ms_cubic-bezier(0.34,1.56,0.64,1)]"
        style={{
          background: 'var(--bg-surface-1)',
          boxShadow:  'var(--shadow-xl)',
        }}
        onClick={e => e.stopPropagation()}
      >

        {/* Header */}
        <div className="flex items-start justify-between gap-3 px-5 py-5 border-b border-(--border-subtle)">
          <div>
            <h3 className="text-base font-semibold text-(--text-primary) leading-snug m-0">
              Posting Surplus
            </h3>
            <p className="text-compact-sm text-(--text-muted) mt-0.5 m-0">
              Bantu makananmu ditemukan orang yang butuh
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup modal"
            className="w-7 h-7 flex items-center justify-center shrink-0 bg-transparent border border-(--border-default) rounded-md text-(--text-muted) cursor-pointer transition-all duration-150 hover:bg-(--bg-surface-3) hover:text-(--text-primary)"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body — gap-5 selaras dengan KulkasForm */}
        <div className="px-5 py-5 flex flex-col gap-5">

          {/* Upload */}
          <div className="flex flex-col items-center gap-1.5 py-8 px-4 border-2 border-dashed border-(--border-default) rounded-md cursor-pointer transition-all duration-150 hover:border-(--border-brand) hover:bg-(--bg-subtle)">
            <Upload size={20} strokeWidth={1.5} className="text-(--text-muted)" />
            <p className="text-compact-lg font-medium text-(--text-secondary) m-0">
              Upload foto makanan
            </p>
            <p className="text-compact-sm text-(--text-muted) m-0">JPG, PNG · Maks 5 MB</p>
          </div>

          {/* Nama */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="nama-makanan" className="text-compact-base font-medium text-(--text-secondary)">
              Nama makanan / bahan
            </label>
            <input
              id="nama-makanan"
              className={inputCls}
              placeholder="cth. Nasi kotak sisa acara"
            />
          </div>

          {/* Deskripsi */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="deskripsi" className="text-compact-base font-medium text-(--text-secondary)">
              Deskripsi
            </label>
            <textarea
              id="deskripsi"
              className={`${inputCls} resize-y min-h-20 leading-relaxed`}
              placeholder="Ceritakan kondisi, lauk, atau info penting lainnya…"
              rows={3}
            />
          </div>

          {/* Kategori + Jumlah */}
          <div className="grid grid-cols-2 gap-3 max-[480px]:grid-cols-1">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="kategori" className="text-compact-base font-medium text-(--text-secondary)">
                Kategori
              </label>
              <select id="kategori" className={inputCls}>
                {KATEGORI_OPTIONS.map(k => <option key={k}>{k}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="jumlah" className="text-compact-base font-medium text-(--text-secondary)">
                Jumlah
              </label>
              {/* Input jumlah dengan ikon — selaras dengan pola jumlah di KulkasForm */}
              <div className="flex items-center gap-2 bg-(--bg-alt) border border-(--border-default) rounded-md px-3 focus-within:border-(--border-brand) transition-colors duration-150">
                <Package size={13} strokeWidth={2} className="text-(--text-muted) shrink-0" />
                <input
                  id="jumlah"
                  className="flex-1 border-0 bg-transparent py-2.5 text-compact-lg text-(--text-primary) min-w-0 placeholder:text-(--text-muted) focus:outline-none"
                  placeholder="5 porsi, 3 bungkus"
                />
              </div>
            </div>
          </div>

          {/* Kondisi pills — active state selaras dengan storage button KulkasForm */}
          <div className="flex flex-col gap-2">
            <label className="text-compact-base font-medium text-(--text-secondary)">
              Kondisi
            </label>
            <div className="grid grid-cols-3 gap-2 max-[480px]:grid-cols-1">
              {KONDISI_OPTIONS.map(({ value, label, hint, active, activeText }) => {
                const isActive = kondisi === value
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setKondisi(value)}
                    className={`flex flex-col items-center gap-1 px-2 py-3 border rounded-md cursor-pointer transition-all duration-150
                      ${isActive
                        ? `${active} ${activeText} ring-2 ring-primary-100`
                        : 'bg-(--bg-alt) border-(--border-default) hover:border-(--border-brand) hover:bg-(--bg-subtle)'
                      }`}
                  >
                    <span className={`text-compact-base font-semibold ${isActive ? activeText : 'text-(--text-primary)'}`}>
                      {label}
                    </span>
                    <span className="text-compact-xs text-(--text-muted) text-center leading-snug">
                      {hint}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Lokasi */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="lokasi" className="text-compact-base font-medium text-(--text-secondary)">
              Lokasi pengambilan
            </label>
            <div className="flex items-center gap-2 bg-(--bg-alt) border border-(--border-default) rounded-md px-3 focus-within:border-(--border-brand) transition-colors duration-150">
              <MapPin size={13} strokeWidth={2} className="text-(--text-muted) shrink-0" />
              <input
                id="lokasi"
                className="flex-1 border-0 bg-transparent py-2.5 text-compact-lg text-(--text-primary) min-w-0 placeholder:text-(--text-muted) focus:outline-none"
                placeholder="Alamat atau titik lokasi"
              />
              <button className="shrink-0 px-2.5 py-1 bg-(--bg-subtle) border border-(--border-subtle) rounded-md text-compact-sm font-medium text-(--text-brand) cursor-pointer whitespace-nowrap transition-colors duration-150 hover:bg-primary-100">
                Gunakan lokasimu
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-5 py-4 border-t border-(--border-subtle)">
          <button
            onClick={onClose}
            className="inline-flex items-center px-4 py-2 bg-transparent border border-(--border-default) rounded-md text-compact-lg font-medium text-(--text-secondary) cursor-pointer transition-colors duration-150 hover:bg-(--bg-surface-3)"
          >
            Batal
          </button>
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 px-5 py-2 bg-primary-600 text-white border-0 rounded-md text-compact-lg font-semibold cursor-pointer transition-colors duration-150 hover:bg-primary-700"
          >
            Posting Sekarang
          </button>
        </div>

      </div>
    </div>
  )
}