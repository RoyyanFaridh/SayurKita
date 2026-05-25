import { Sparkles } from 'lucide-react'

export default function PoinBerkah() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 px-6 text-center">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center"
        style={{ background: 'var(--bg-warning-subtle)' }}
      >
        <Sparkles size={24} strokeWidth={1.5} className="text-(--text-warning)" />
      </div>

      <div className="flex flex-col gap-1.5 max-w-xs">
        <h2 className="text-lg font-semibold text-(--text-primary) leading-snug m-0">
          Poin Berkah
        </h2>
        <p className="text-compact-base text-(--text-secondary) m-0">
          Kumpulkan poin setiap kali kamu menyelamatkan makanan atau berbagi surplus.
        </p>
      </div>

      <span
        className="px-3 py-1 rounded-full text-compact-sm font-medium"
        style={{
          background: 'var(--bg-warning-subtle)',
          color:      'var(--text-warning)',
        }}
      >
        Segera hadir
      </span>
    </div>
  )
}