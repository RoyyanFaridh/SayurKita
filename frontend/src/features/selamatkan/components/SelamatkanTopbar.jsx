import { Handshake, Plus } from 'lucide-react'

export default function SelamatkanTopbar({ totalAktif, onPosting }) {
  return (
    <div className="sticky top-0 z-20 flex items-center justify-between border-b border-(--border-subtle) bg-white px-7 py-4 max-sm:hidden">
      <div className="flex items-center gap-3">
        <Handshake size={18} strokeWidth={1.75} className="text-primary-600" />
        <div>
          <h1 className="text-xl font-bold leading-snug text-(--text-primary)">
            Selamatkan!
          </h1>
          <p className="mt-0.5 text-compact-sm text-(--text-muted)">
            {totalAktif} surplus aktif di sekitarmu
          </p>
        </div>
      </div>

      <button
        onClick={onPosting}
        className="inline-flex items-center gap-2 rounded-md bg-primary-600 px-4 py-2 text-compact-lg font-medium text-white transition-colors duration-150 hover:bg-primary-700"
      >
        <Plus size={14} strokeWidth={2.5} /> Posting Surplus
      </button>
    </div>
  )
}