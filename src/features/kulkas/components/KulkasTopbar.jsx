import { Refrigerator, Plus } from 'lucide-react'

export default function KulkasTopbar({ totalItems, onTambah }) {
  return (
    <div className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-100 bg-white px-7 py-4 max-sm:hidden">
      <div className="flex items-center gap-3">
        <Refrigerator
          size={18}
          strokeWidth={1.75}
          className="text-primary-600"
        />

        <div>
          <h1 className="text-xl font-bold leading-snug text-neutral-900">
            Lihat Kulkas
          </h1>

          <p className="mt-0.5 text-compact-sm text-neutral-400">
            {totalItems} bahan tersimpan
          </p>
        </div>
      </div>

      <button
        className="inline-flex items-center gap-2 rounded-md bg-primary-900 px-4 py-2 font-body text-compact-lg font-medium text-white transition-colors duration-fast ease-out hover:bg-primary-700"
        onClick={onTambah}
      >
        <Plus size={14} strokeWidth={2.5} />
        Tambah Bahan
      </button>
    </div>
  )
}