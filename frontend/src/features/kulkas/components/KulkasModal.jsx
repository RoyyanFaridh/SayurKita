import { X } from 'lucide-react'
import KulkasForm from './KulkasForm'

export default function KulkasModal({ item, onClose }) {
  const isEdit = !!item

  return (
    <div
      className="fixed inset-0 bg-(--bg-overlay) z-(--z-modal) flex items-center justify-center p-4 animate-[fadeIn_150ms_ease-out]"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-125 max-h-[90vh] overflow-y-auto shadow-(--shadow-xl) flex flex-col animate-[slideUp_280ms_cubic-bezier(0.34,1.56,0.64,1)]"
        onClick={e => e.stopPropagation()}
      >

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

        <KulkasForm item={item} />

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
              className="inline-flex items-center gap-2 px-5 py-2 bg-secondary-500 text-primary-900 border-0 rounded-xl text-compact-lg font-semibold cursor-pointer transition-colors duration-150 hover:bg-secondary-400"
            >
              Simpan Bahan
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}