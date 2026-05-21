import { useState, useRef } from 'react'
import { X } from 'lucide-react'
import { API_ORIGIN } from '../../../config/api'
import KulkasForm from './KulkasForm'

export default function KulkasModal({ item, onClose, onSave }) {
  const isEdit = !!item
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const formRef = useRef(null)

  async function handleDelete() {
    if (!window.confirm('Apakah Anda yakin ingin menghapus bahan ini?')) return
    setIsLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_ORIGIN}/api/ingredients/${item.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!response.ok) {
        const data = await response.json()
        setError(data.message || 'Gagal menghapus bahan')
        return
      }
      if (onSave) onSave(null, 'delete')
      onClose()
    } catch (err) {
      console.error('Delete error:', err)
      setError('Terjadi kesalahan saat menghapus')
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
            className="w-7 h-7 flex items-center justify-center shrink-0 border border-(--border-default) rounded-md bg-transparent text-(--text-muted) cursor-pointer transition-all duration-150 hover:bg-(--bg-surface-3) hover:text-(--text-primary)"
          >
            <X size={16} />
          </button>
        </div>

        {error && (
          <div className="mx-5 mt-4 px-4 py-2.5 bg-danger-50 border border-danger-200 rounded-md">
            <p className="text-compact-sm text-danger-600">{error}</p>
          </div>
        )}

        <KulkasForm ref={formRef} item={item} onSave={handleSave} isLoading={isLoading} />

        <div className="flex items-center gap-2 px-5 py-4 border-t border-(--border-subtle)">
          {isEdit && (
            <button
              onClick={handleDelete}
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 bg-transparent border border-(--border-danger) rounded-md text-compact-lg font-medium text-(--text-danger) cursor-pointer transition-all duration-150 hover:bg-(--bg-danger-subtle) disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Hapus
            </button>
          )}
          <button
            onClick={onClose}
            disabled={isLoading}
            className="w-1/5 px-4 py-2 bg-transparent border border-(--border-default) rounded-md text-compact-lg font-medium text-(--text-secondary) cursor-pointer transition-colors duration-150 hover:bg-(--bg-surface-3) disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Batal
          </button>
          <button
            onClick={() => formRef.current?.submit()}
            disabled={isLoading}
            className="w-4/5 px-5 py-2 bg-primary-500 text-(--text-on-dark) border-0 rounded-md text-compact-lg font-semibold cursor-pointer transition-colors duration-150 hover:bg-secondary-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Menyimpan...' : 'Simpan Bahan'}
          </button>
        </div>
      </div>
    </div>
  )
}