import { X } from 'lucide-react'

export default function KulkasModal({ item, onClose }) {
  const isEdit = !!item

  return (
    <div
      className="fixed inset-0 z-[400] flex items-center justify-center bg-[var(--bg-overlay)] p-4 animate-in fade-in duration-fast"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[440px] rounded-xl bg-white shadow-xl animate-in slide-in-from-bottom-3 duration-normal"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-neutral-100 px-5 pb-4 pt-5">
          <h3 className="text-base font-semibold text-neutral-900">
            {isEdit ? 'Edit Bahan' : 'Tambah Bahan'}
          </h3>

          <button
            className="flex h-7 w-7 items-center justify-center rounded-sm border border-neutral-200 bg-transparent text-neutral-400 transition-all duration-fast ease-out hover:bg-neutral-100 hover:text-neutral-900"
            onClick={onClose}
            aria-label="Tutup"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex flex-col gap-4 p-5">
          <div className="flex flex-1 flex-col gap-1.5">
            <label className="text-compact-base font-medium text-neutral-600">
              Nama bahan
            </label>

            <input
              className="w-full rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2.5 font-body text-compact-lg text-neutral-900 transition-colors duration-fast ease-out focus:border-primary-500 focus:outline-none"
              defaultValue={item?.nama}
              placeholder="cth. Bayam segar"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 max-[480px]:grid-cols-1">
            <div className="flex flex-1 flex-col gap-1.5">
              <label className="text-compact-base font-medium text-neutral-600">
                Kategori
              </label>

              <select
                className="w-full rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2.5 font-body text-compact-lg text-neutral-900 transition-colors duration-fast ease-out focus:border-primary-500 focus:outline-none"
                defaultValue={item?.kategori || 'Sayur'}
              >
                {['Sayur', 'Protein', 'Bumbu', 'Lainnya'].map(k => (
                  <option key={k}>{k}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-1 flex-col gap-1.5">
              <label className="text-compact-base font-medium text-neutral-600">
                Jumlah
              </label>

              <input
                className="w-full rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2.5 font-body text-compact-lg text-neutral-900 transition-colors duration-fast ease-out focus:border-primary-500 focus:outline-none"
                defaultValue={item?.jumlah}
                placeholder="cth. 1 ikat"
              />
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-1.5">
            <label className="text-compact-base font-medium text-neutral-600">
              Kadaluwarsa
            </label>

            <input
              className="w-full rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2.5 font-body text-compact-lg text-neutral-900 transition-colors duration-fast ease-out focus:border-primary-500 focus:outline-none"
              type="date"
              defaultValue={item?.exp}
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-neutral-100 px-5 py-4">
          {isEdit && (
            <button
              className="inline-flex items-center rounded-md border border-danger-200 bg-transparent px-4 py-2 font-body text-compact-lg font-medium text-danger-500 transition-all duration-fast ease-out hover:bg-danger-50"
              onClick={onClose}
            >
              Hapus
            </button>
          )}

          <div className="ml-auto flex gap-2">
            <button
              className="inline-flex items-center rounded-md border border-neutral-200 bg-transparent px-4 py-2 font-body text-compact-lg font-medium text-neutral-600 transition-colors duration-fast ease-out hover:bg-neutral-100"
              onClick={onClose}
            >
              Batal
            </button>

            <button
              className="inline-flex items-center rounded-md bg-primary-900 px-4 py-2 font-body text-compact-lg font-medium text-white transition-colors duration-fast ease-out hover:bg-primary-700"
              onClick={onClose}
            >
              Simpan
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}