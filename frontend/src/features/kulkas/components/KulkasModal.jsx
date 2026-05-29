import { useState, useRef } from 'react'
import { X, Trash2 } from 'lucide-react'
import { API_ORIGIN } from '../../../config/api'
import KulkasForm from './KulkasForm'

export default function KulkasModal({ item, preFillNama, onClose, onSave }) {
  const isEdit = !!item
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)
  const formRef = useRef(null)

  async function handleDelete() {
    setIsLoading(true)
    setError('')
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_ORIGIN}/api/ingredients/${item.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!response.ok) {
        const data = await response.json()
        setError(data.message || 'Gagal menghapus bahan')
        setConfirmDelete(false)
        return
      }
      if (onSave) onSave(null, 'delete')
      onClose()
    } catch (err) {
      console.error('Delete error:', err)
      setError('Terjadi kesalahan saat menghapus')
      setConfirmDelete(false)
    } finally {
      setIsLoading(false)
    }
  }

  function handleSave(data) {
    if (onSave) onSave(data, isEdit ? 'update' : 'create')
    onClose()
  }

  return (
    <div
      className="fixed inset-0 bg-(--bg-overlay) z-(--z-modal) flex items-end sm:items-center justify-center p-0 sm:p-4 animate-[fadeIn_150ms_ease-out]"
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:max-w-125 max-h-[90vh] rounded-t-2xl sm:rounded-2xl overflow-y-auto shadow-xl flex flex-col animate-[slideUp_280ms_cubic-bezier(0.34,1.56,0.64,1)]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-(--border-subtle) gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-semibold text-(--text-primary) leading-snug">
              {isEdit ? 'Edit Bahan' : 'Tambah ke Kulkas'}
            </h3>
            <p className="text-compact-sm text-(--text-muted) mt-0.5">
              {isEdit ? 'Perbarui info bahan yang tersimpan' : 'Pantau kesegaran bahan makananmu'}
            </p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {isEdit && (
              <button
                onClick={() => setConfirmDelete(true)}
                disabled={isLoading}
                className="w-7 h-7 flex items-center justify-center border border-(--border-danger) rounded-md bg-transparent text-(--text-danger) cursor-pointer transition-all duration-150 hover:bg-(--bg-danger-subtle) disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Hapus bahan"
              >
                <Trash2 size={14} strokeWidth={2} />
              </button>
            )}
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center border border-(--border-default) rounded-md bg-transparent text-(--text-muted) cursor-pointer transition-all duration-150 hover:bg-(--bg-surface-3) hover:text-(--text-primary)"
              aria-label="Tutup modal"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Confirm delete — inline, menggantikan window.confirm */}
        {confirmDelete && (
          <div className="mx-5 mt-4 px-4 py-3 bg-(--bg-danger-subtle) border border-(--border-danger) rounded-md flex items-center justify-between gap-3">
            <p className="text-compact-sm text-(--text-danger) font-medium">
              Hapus <span className="font-semibold capitalize">{item?.nama}</span> dari kulkas?
            </p>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setConfirmDelete(false)}
                disabled={isLoading}
                className="px-3 py-1 rounded-md text-compact-sm font-medium bg-transparent border border-(--border-danger) text-(--text-danger) cursor-pointer transition-colors duration-150 hover:bg-white disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                disabled={isLoading}
                className="px-3 py-1 rounded-md text-compact-sm font-semibold bg-danger-500 text-white border-0 cursor-pointer transition-colors duration-150 hover:bg-danger-600 disabled:opacity-50"
              >
                {isLoading ? 'Menghapus...' : 'Hapus'}
              </button>
            </div>
          </div>
        )}

        {/* Error banner */}
        {error && (
          <div className="mx-5 mt-4 px-4 py-2.5 bg-(--bg-danger-subtle) border border-(--border-danger) rounded-md">
            <p className="text-compact-sm text-(--text-danger)">{error}</p>
          </div>
        )}

        <KulkasForm ref={formRef} item={item} preFillNama={preFillNama} onSave={handleSave} isLoading={isLoading} />

        {/* Footer */}
        <div className="flex items-center gap-2 px-5 py-4 border-t border-(--border-subtle)">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 bg-transparent border border-(--border-default) rounded-md text-compact-lg font-medium text-(--text-secondary) cursor-pointer transition-colors duration-150 hover:bg-(--bg-surface-3) disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Batal
          </button>
          <button
            onClick={() => formRef.current?.submit()}
            disabled={isLoading}
            className="flex-1 px-5 py-2 bg-primary-600 text-white border-0 rounded-md text-compact-lg font-semibold cursor-pointer transition-colors duration-150 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Simpan Bahan'}
          </button>
        </div>
      </div>
    </div>
  )
}