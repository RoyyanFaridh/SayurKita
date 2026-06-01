import { useState, useRef } from 'react'
import { X, Upload, MapPin, Package } from 'lucide-react'
import { API_ORIGIN } from '../../../config/api'

const KONDISI_OPTIONS = [
  { value: 'segar',     label: 'Segar',        hint: 'Masih layak dikonsumsi',    active: 'bg-(--bg-success-subtle) border-(--border-success)', activeText: 'text-(--text-success)' },
  { value: 'mau-habis', label: 'Segera ambil',  hint: 'Perlu diambil hari ini',    active: 'bg-(--bg-warning-subtle) border-(--border-warning)', activeText: 'text-(--text-warning)' },
  { value: 'segera',    label: 'Hari ini!',     hint: 'Harus segera sebelum basi', active: 'bg-(--bg-danger-subtle)  border-(--border-danger)',   activeText: 'text-(--text-danger)'  },
]

const KATEGORI_OPTIONS = ['Makanan Matang', 'Sayuran', 'Lauk', 'Buah', 'Lainnya']

const inputCls = `w-full px-3 py-2.5 bg-(--bg-alt)
  border border-(--border-default) rounded-md
  text-compact-lg text-(--text-primary)
  box-border transition-colors duration-150
  focus:outline-none focus:border-(--border-brand)`

const inputErrCls = `w-full px-3 py-2.5 bg-(--bg-alt)
  border border-red-400 rounded-md
  text-compact-lg text-(--text-primary)
  box-border transition-colors duration-150
  focus:outline-none focus:border-red-500`

function FieldError({ message }) {
  if (!message) return null
  return <p className="text-xs text-red-500 mt-0.5 m-0">{message}</p>
}

export default function SelamatkanPostingModal({ onClose, onSuccess }) {
  const [kondisi, setKondisi]           = useState('segar')
  const [nama, setNama]                 = useState('')
  const [deskripsi, setDeskripsi]       = useState('')
  const [kategori, setKategori]         = useState(KATEGORI_OPTIONS[0])
  const [jumlah, setJumlah]             = useState('')
  const [lokasi, setLokasi]             = useState('')
  const [lat, setLat]                   = useState(null)
  const [lng, setLng]                   = useState(null)
  const [file, setFile]                 = useState(null)
  const [preview, setPreview]           = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLocating, setIsLocating]     = useState(false)
  const [errors, setErrors]             = useState({})
  const fileInputRef                    = useRef(null)

  const clearError = (field) => setErrors(p => ({ ...p, [field]: undefined }))

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (!selectedFile) return
    if (selectedFile.size > 5 * 1024 * 1024) {
      setErrors(p => ({ ...p, file: 'Ukuran file maksimal 5 MB' }))
      return
    }
    clearError('file')
    setFile(selectedFile)
    const reader = new FileReader()
    reader.onloadend = () => setPreview(reader.result)
    reader.readAsDataURL(selectedFile)
  }

  const handleLocate = () => {
    if (!navigator.geolocation) {
      setErrors(p => ({ ...p, lokasi: 'Browser tidak mendukung geolokasi' }))
      return
    }
    setIsLocating(true)
    navigator.geolocation.getCurrentPosition(
      pos => {
        setLat(pos.coords.latitude)
        setLng(pos.coords.longitude)
        setLokasi(`${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`)
        clearError('lokasi')
        setIsLocating(false)
      },
      () => {
        setErrors(p => ({ ...p, lokasi: 'Gagal mendapatkan lokasi — izinkan akses lokasi di browser.' }))
        setIsLocating(false)
      }
    )
  }

  const validate = () => {
    const errs = {}
    if (!nama.trim())      errs.nama      = 'Nama makanan wajib diisi'
    if (!deskripsi.trim()) errs.deskripsi = 'Deskripsi wajib diisi'
    if (!jumlah.trim())    errs.jumlah    = 'Jumlah wajib diisi'
    if (!lokasi.trim())    errs.lokasi    = 'Alamat lokasi wajib diisi'
    if (lat === null || lng === null) {
      errs.lokasi = 'Klik "Gunakan lokasimu" untuk mendapatkan koordinat GPS'
    }
    return errs
  }

  const handleSubmit = async () => {
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      // scroll ke error pertama
      setTimeout(() => {
        document.querySelector('[data-field-error]')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 50)
      return
    }

    setErrors({})
    setIsSubmitting(true)

    try {
      const pickupTimeMap = {
        'segar':     'Kapan saja',
        'mau-habis': 'Segera ambil',
        'segera':    'Hari ini!',
      }

      const formData = new FormData()
      formData.append('title',       nama)
      formData.append('description', deskripsi)
      formData.append('category',    kategori)
      formData.append('quantity',    jumlah)
      formData.append('pickupTime',  pickupTimeMap[kondisi] || 'Kapan saja')
      formData.append('address',     lokasi)
      formData.append('latitude',    lat.toString())
      formData.append('longitude',   lng.toString())
      if (file) formData.append('image', file)

      const token = localStorage.getItem('token')
      const response = await fetch(`${API_ORIGIN}/api/surplus`, {
        method:  'POST',
        headers: { Authorization: `Bearer ${token}` },
        body:    formData,
      })

      const data = await response.json()

      if (data.success) {
        onSuccess?.()
        onClose()
        return
      }

      // Backend kirim field-level errors — langsung merge ke state
      if (data.fields && typeof data.fields === 'object') {
        setErrors(data.fields)
        setTimeout(() => {
          document.querySelector('[data-field-error]')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }, 50)
        return
      }

      // Fallback: error umum tanpa field spesifik
      setErrors({ _general: data.message || 'Gagal memposting surplus.' })

    } catch {
      setErrors({ _general: 'Terjadi kesalahan jaringan. Pastikan koneksi internetmu aktif.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-(--bg-overlay) animate-[fadeIn_150ms_ease-out]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-130 max-h-[90vh] overflow-y-auto rounded-2xl animate-[slideUp_280ms_cubic-bezier(0.34,1.56,0.64,1)]"
        style={{ background: 'var(--bg-surface-1)', boxShadow: 'var(--shadow-xl)' }}
        onClick={e => e.stopPropagation()}
      >

        {/* Header */}
        <div className="flex items-start justify-between gap-3 px-5 py-5 border-b border-(--border-subtle)">
          <div>
            <h3 className="text-base font-semibold text-(--text-primary) leading-snug m-0">Posting Surplus</h3>
            <p className="text-compact-sm text-(--text-muted) mt-0.5 m-0">Bantu makananmu ditemukan orang yang butuh</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup modal"
            className="w-7 h-7 flex items-center justify-center shrink-0 bg-transparent border border-(--border-default) rounded-md text-(--text-muted) cursor-pointer transition-all duration-150 hover:bg-(--bg-surface-3) hover:text-(--text-primary)"
          >
            <X size={16} />
          </button>
        </div>

        {/* General error banner */}
        {errors._general && (
          <div className="mx-5 mt-4 flex items-start gap-2 px-3 py-2.5 bg-red-50 border border-red-200 rounded-md">
            <span className="text-red-500 mt-0.5 shrink-0">⚠</span>
            <p className="text-compact-sm text-red-700 m-0">{errors._general}</p>
          </div>
        )}

        {/* Body */}
        <div className="px-5 py-5 flex flex-col gap-5">

          {/* Upload */}
          <div className="flex flex-col gap-1.5">
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`flex flex-col items-center gap-1.5 py-8 px-4 border-2 border-dashed rounded-md cursor-pointer transition-all duration-150 hover:border-(--border-brand) hover:bg-(--bg-subtle) relative overflow-hidden
                ${errors.file ? 'border-red-400' : 'border-(--border-default)'}`}
            >
              {preview ? (
                <img src={preview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <>
                  <Upload size={20} strokeWidth={1.5} className="text-(--text-muted)" />
                  <p className="text-compact-lg font-medium text-(--text-secondary) m-0">Upload foto makanan</p>
                  <p className="text-compact-sm text-(--text-muted) m-0">JPG, PNG · Maks 5 MB</p>
                </>
              )}
              <input type="file" accept="image/*" style={{ display: 'none' }} ref={fileInputRef} onChange={handleFileChange} />
            </div>
            <FieldError message={errors.file} />
          </div>

          {/* Nama */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="nama-makanan" className="text-compact-base font-medium text-(--text-secondary)">
              Nama makanan / bahan
            </label>
            <input
              id="nama-makanan"
              className={errors.nama ? inputErrCls : inputCls}
              placeholder="cth. Nasi kotak sisa acara"
              value={nama}
              onChange={e => { setNama(e.target.value); clearError('nama') }}
            />
            <FieldError message={errors.nama} />
          </div>

          {/* Deskripsi */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="deskripsi" className="text-compact-base font-medium text-(--text-secondary)">
              Deskripsi
            </label>
            <textarea
              id="deskripsi"
              className={`${errors.deskripsi ? inputErrCls : inputCls} resize-y min-h-20 leading-relaxed`}
              placeholder="Ceritakan kondisi, lauk, atau info penting lainnya…"
              rows={3}
              value={deskripsi}
              onChange={e => { setDeskripsi(e.target.value); clearError('deskripsi') }}
            />
            <FieldError message={errors.deskripsi} />
          </div>

          {/* Kategori + Jumlah */}
          <div className="grid grid-cols-2 gap-3 max-[480px]:grid-cols-1">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="kategori" className="text-compact-base font-medium text-(--text-secondary)">Kategori</label>
              <select id="kategori" className={inputCls} value={kategori} onChange={e => setKategori(e.target.value)}>
                {KATEGORI_OPTIONS.map(k => <option key={k}>{k}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="jumlah" className="text-compact-base font-medium text-(--text-secondary)">Jumlah</label>
              <div className={`flex items-center gap-2 bg-(--bg-alt) border rounded-md px-3 focus-within:border-(--border-brand) transition-colors duration-150
                ${errors.jumlah ? 'border-red-400' : 'border-(--border-default)'}`}>
                <Package size={13} strokeWidth={2} className="text-(--text-muted) shrink-0" />
                <input
                  id="jumlah"
                  className="flex-1 border-0 bg-transparent py-2.5 text-compact-lg text-(--text-primary) min-w-0 placeholder:text-(--text-muted) focus:outline-none"
                  placeholder="5 porsi, 3 bungkus"
                  value={jumlah}
                  onChange={e => { setJumlah(e.target.value); clearError('jumlah') }}
                />
              </div>
              <FieldError message={errors.jumlah} />
            </div>
          </div>

          {/* Kondisi */}
          <div className="flex flex-col gap-2">
            <label className="text-compact-base font-medium text-(--text-secondary)">Kondisi</label>
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
                    <span className={`text-compact-base font-semibold ${isActive ? activeText : 'text-(--text-primary)'}`}>{label}</span>
                    <span className="text-compact-xs text-(--text-muted) text-center leading-snug">{hint}</span>
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
            <div className={`flex items-center gap-2 bg-(--bg-alt) border rounded-md px-3 focus-within:border-(--border-brand) transition-colors duration-150
              ${errors.lokasi ? 'border-red-400' : 'border-(--border-default)'}`}>
              <MapPin size={13} strokeWidth={2} className="text-(--text-muted) shrink-0" />
              <input
                id="lokasi"
                className="flex-1 border-0 bg-transparent py-2.5 text-compact-lg text-(--text-primary) min-w-0 placeholder:text-(--text-muted) focus:outline-none"
                placeholder="Alamat atau titik lokasi"
                value={lokasi}
                onChange={e => { setLokasi(e.target.value); clearError('lokasi') }}
              />
              <button
                onClick={handleLocate}
                disabled={isLocating}
                className="shrink-0 px-2.5 py-1 bg-(--bg-subtle) border border-(--border-subtle) rounded-md text-compact-sm font-medium text-(--text-brand) cursor-pointer whitespace-nowrap transition-colors duration-150 hover:bg-primary-100 disabled:opacity-50"
              >
                {isLocating ? 'Mencari...' : 'Gunakan lokasimu'}
              </button>
            </div>
            {/* Error lokasi dengan hint aksi jika koordinat belum ada */}
            {errors.lokasi && (
              <div data-field-error className="flex items-start gap-1.5 mt-0.5">
                <span className="text-red-400 text-xs mt-0.5 shrink-0">⚠</span>
                <p className="text-xs text-red-500 m-0">{errors.lokasi}</p>
              </div>
            )}
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
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-5 py-2 bg-primary-600 text-white border-0 rounded-md text-compact-lg font-semibold cursor-pointer transition-colors duration-150 hover:bg-primary-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Memposting...' : 'Posting Sekarang'}
          </button>
        </div>

      </div>
    </div>
  )
}