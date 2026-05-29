import { Star } from 'lucide-react'

export default function PoinTopbar({ points }) {
  return (
    <div className="sticky top-0 z-20 flex items-center justify-between border-b border-(--border-subtle) bg-white px-7 py-4 max-sm:hidden">
      <div className="flex items-center gap-3">
        <Star
          size={18}
          strokeWidth={1.75}
          className="text-primary-600"
        />
        <div>
          <h1 className="text-xl font-bold leading-snug text-(--text-primary)">
            Poin Berkah
          </h1>
          <p className="mt-0.5 text-compact-sm text-(--text-muted)">
            {points !== null ? `${points.toLocaleString('id-ID')} poin terkumpul` : 'Memuat...'}
          </p>
        </div>
      </div>
    </div>
  )
}