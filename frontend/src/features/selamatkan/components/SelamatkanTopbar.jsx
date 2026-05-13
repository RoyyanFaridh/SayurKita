import { Handshake, Plus } from 'lucide-react'

export default function SelamatkanTopbar({ totalAktif, onPosting }) {
  return (
    <div className="bg-white border-b border-(--border-subtle)
                    px-7 py-4 flex items-center justify-between
                    sticky top-0 z-(--z-raised)
                    max-sm:hidden">
      <div className="flex items-center gap-3">
        <Handshake size={18} strokeWidth={1.75} className="text-(--text-brand)" />
        <div>
          <h1 className="text-xl font-bold text-(--text-primary) leading-snug">
            Selamatkan!
          </h1>
          <p className="text-compact-sm text-(--text-muted) mt-0.5">
            {totalAktif} surplus aktif di sekitarmu
          </p>
        </div>
      </div>

      <button
        onClick={onPosting}
        className="inline-flex items-center gap-2 px-4 py-2
                   bg-secondary-500 text-primary-900
                   rounded-lg text-compact-lg font-semibold
                   border-0 cursor-pointer
                   transition-colors duration-150
                   hover:bg-secondary-400"
      >
        <Plus size={14} strokeWidth={2.5} /> Posting Surplus
      </button>
    </div>
  )
}